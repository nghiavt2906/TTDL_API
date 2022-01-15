import models from "models"
import Client from "ftp"
import _ from "lodash"
import chalk from 'chalk'
import validator from 'validator'
import {reformatSystemInfo} from "./utils"
import { sendStructureMail, sendThresholdMail, sendDisconnectionMail } from "utils/email"
import * as sms from "utils/sms"
import app from "app"
import * as func from "utils/functions"
import { newId } from "models/utils"
import moment from "moment"

class Ftp {
  constructor() {}

  syncFtpData = async () => {
    let systemInfo = await app.System.findSystemInfo('1', ['dirReceiveFtp', 'dirSaveFtp', 'dirWrongFtp', 'ftpserverStnmt', 'ftpusernameStnmt', 'ftppasswordStnmt', 'ftpportStnmt'])
    systemInfo = reformatSystemInfo(systemInfo)
    // console.log(systemInfo)
    const stationInfo = await app.Station.getFtpInfo()
    stationInfo.forEach(station => {
      const configFtp = {
        host: station.host,
        user: station.username,
        password: station.password,
        port : station.port
      }

      // console.log(station)
      
      let ftp = new Client()
      ftp.on("ready", async () => {
        try {
          let files = await this.listFolder(ftp, "/", "-")
          if (files.length === 0) {
            checkDisconnectionStation(station, systemInfo)
          }
          // console.log(files)
          await Promise.all(
            files.map( file => {
                return this.readFileFtp(ftp, file, station, systemInfo)
            })
          )
          ftp.end()
        } catch (error) {
          console.log(chalk.blue(error))
          ftp.end()
        }
      })
      ftp.connect(configFtp)

    })
  }

  listFolder = (ftp, folderDir, type) => {
    return new Promise((resolve, reject) => {
      ftp.list(folderDir, (err, result) => {
        if (err) {
          console.log(chalk.red(`Error At listFolder`), err)
          reject(err)
        }
        let listFiles = []
        if (result !== undefined) {
          // // console.log('=====> Here')
          result.forEach(folder => {
            if (folder.type === type) {
              listFiles.push(folder.name)
            }
          })
        }
        resolve(listFiles)
      })
    })
  }

  readFileFtp = async (ftp, fileName, station, systemInfo) => {
    try {
      const configFtpStnmt = {
        host : systemInfo.ftpserverStnmt,
        user: systemInfo.ftpusernameStnmt,
        password: systemInfo.ftppasswordStnmt,
        port : systemInfo.ftpportStnmt
      }
      const dirFile = fileName
      const fileInfo = this.analyzeFile(fileName)
      let sentTime = func.convertTimeToISOFormat(fileInfo.time)
      let dataInfo = {}
      // sentTime = new Date(sentTime)
      sentTime = moment.utc(sentTime).tz('Asia/Ho_Chi_Minh').format()
      dataInfo.id = newId()
      dataInfo.stationId = station.id
      dataInfo.sentAt = sentTime
      dataInfo.isFtpdata = 1
      
      let streamData = await this.streamDataFtp(ftp, dirFile)
      let data = await this.convertStreamData(streamData)
      // await this.deleteFtpFile(ftp, dirFile)

      // Check isValid file, if false do backup file in wrong format filename
      // const isValidFilename = this.compareFormatFile(fileName, station.ftpFilename)
      // if(!isValidFilename) {
        //   this.backupFile(configFtpStnmt, data, station, systemInfo.dirWrongFtp, fileName)
      //   return
      // }

      dataInfo.monitoringContent = data
      // console.log(dataInfo)
      
      const monitoringData = this.splitData(data, 'kjhadkjfhka')
      const finalData = {
        ... dataInfo,
        MonitoringData : monitoringData
      }
      // console.log(finalData)
      // await app.MonitoringDataInfo.createData(finalData)
      // console.log(result)

      let checkOverThreshold = await this.checkOverThreshold(finalData, station)
      if(checkOverThreshold.isOverThreshold){
        await app.Station.updateStationById({numberOfThreshold: station.numberOfThreshold + 1}, station.id)
        if(this.sendAlertThreshold(station, filterResult, sentTime, systemInfo)){
          await app.Station.updateStationById({numberOfAlertThreshold : station.numberOfAlertThreshold + 1}, station.id)
        }
      } else {
        await this.setDefaultAlert(station.id)
      }

      // Save file right format
      this.backupFile(configFtpStnmt, data, station, systemInfo.dirSaveFtp, fileName)
    } catch (error) {
      console.log(chalk.red(error))
      ftp.end()
      throw error
    }
  }

  analyzeFile(fileName) {
    try {
      var file = {}
      var formatFile = _.split(fileName, ".")
      var splittingFile = _.split(formatFile[0], "_")
    
      file.type = formatFile[1]
      if (splittingFile.length > 3) {
        file.symbol = splittingFile[2]
        file.time = splittingFile[3]
        file.name = _.split(formatFile[0], file.time)[0]
        file.year = file.time.substr(0, 4)
        file.month = file.time.substr(4, 2)
        file.day = file.time.substr(6, 2)
        file.hour = file.time.substr(8, 2)
        file.min = file.time.substr(10, 2)
        file.sec = file.time.substr(12, 2)
      } else {
        file.symbol = splittingFile[0]
        file.time = splittingFile[1]
        file.name = formatFile[0].replace(file.time, "")
        file.year = file.time.substr(0, 4)
        file.month = file.time.substr(4, 2)
        file.day = file.time.substr(6, 2)
        file.hour = file.time.substr(8, 2)
        file.min = file.time.substr(10, 2)
        file.sec = file.time.substr(12, 2)
      }
      // // console.log({file})
      return file
      
    } catch (error) {
      console.log(chalk.red(`Error in analyzeFile`), error)
      throw error
    }
  }

  streamDataFtp = async (ftp, dirFile) => {
    return new Promise((resolve, reject) => {
      ftp.get(dirFile, (err, streamData) => {
        console.log(`Stream data ${dirFile}`)
        if (err) { 
          console.log('Stream data error', err)
          reject(err)
        }
        resolve(streamData)
      })
    })
  }

  convertStreamData(streamData) {
    return new Promise((resolve, reject) => {
      let data = ""
      streamData
        .on("data", chunk => {
          data += chunk
        })
        .on("end", () => {
          console.log(`convert Stream Data`)
          resolve(data)
        })
    })
  }

  deleteFtpFile = (ftp, path) => {
    return new Promise((resolve, reject) => {
      ftp.delete(path, err => {
        if (err) {
          console.log(`Delete ${path} error`, err)
          reject(err)
        }
        console.log('Delete file ftp success', path)
        resolve()
      })
    })
  }

  checkFtpFileFolder = async (ftp, fileName, station, rootFolder) => {
    try {
      let fileInfo = this.analyzeFile(fileName)
      let typeFolder = ""
      if (station.monitoringType == "QTN") {
        typeFolder = "nuoc"
      } else {
        typeFolder = "khi"
      }
  
      let folderStation = `${rootFolder}/${station.ftpFolder}`
      let folderRootType = `${folderStation}/${typeFolder}`
      let dirMonthFolder = `${folderRootType}/${fileInfo.year}/Thang${fileInfo.month}`
      let dirTimeFolder = `${fileInfo.day}${fileInfo.month}${fileInfo.year}`
      let dirFileFolder = `${dirMonthFolder}/${dirTimeFolder}`
  
      this.mkdirFtp(ftp, dirFileFolder)
      return dirFileFolder
    } catch (error) {
      console.log(chalk.red("Error at checkFtpFileFolder"))
      throw error
    }
  }

  putFileFTP = (ftp, content, destDir) => {
    return new Promise((resolve, reject) => {
      ftp.put(content, destDir, err => {
        if (err) {
          console.log(chalk.red(`Error At putFileFTP ${destDir}`))
          reject(err)
        }
        resolve()
      })
    })
  }

  mkdirFtp = (ftp, dirFolder) => {
    return new Promise((resolve, reject) => {
      ftp.mkdir(dirFolder, [true],  err => {
        if (err){
          console.log('Create folder error', err)
          reject(err)
        } 
        // // console.log(`==> Đã tạo thành công folder ${dirFolder}`)
        resolve()
      })
    })
  }

  compareFormatFile = (sentFileName, defaultFileName) => {
    try {
      var sentFile = this.analyzeFile(sentFileName)
      var defaultFile = this.analyzeFile(defaultFileName)
      // console.log({sentFile,defaultFile})
      if (sentFile.type !== "txt" || sentFile.name !== defaultFile.name || !this.validateTime(sentFile.time) || isNaN(sentFile.time)) {
        return false
      }
      return true
      
    } catch (error) {
      console.log(chalk.red(`Error in compareFormatFile`))
      throw error
    }
  }

  validateTime = (time) => {
    try {
      if (!validator.isNumeric(time) || time.length !== 14) {
        return false
      }
      var year = parseInt(time.substr(0, 4))
      var month = parseInt(time.substr(4, 2))
      var day = parseInt(time.substr(6, 2))
      var hour = parseInt(time.substr(8, 2))
      var min = parseInt(time.substr(10, 2))
      var sec = parseInt(time.substr(12, 2))
      if (month > 12 || day > 31) {
        return false
      }
      if (hour > 24 || min > 60 || sec > 60) {
        return false
      }
      return true
      
    } catch (error) {
      console.log(chalk.red(`Error in validateTime`))
      throw error
    }
  }

  splitData = (data, idData) => {
    try {
      
      let dataArray = []
      data = _.split(data, "\n")
      // console.log({data})
      //Cắt string data thành các mảng array
      data.forEach(smallData => {
        smallData = _.split(smallData, "\t")
        if(isNaN(parseFloat(smallData[0]))){
          if(!isNaN(parseFloat(smallData[1]))){
            dataArray.push(smallData)
          }
        } else {
          dataArray.push(smallData)
        }
      })
      // console.log({dataArray})
      return this.convertArrayToObject(dataArray, idData)
    } catch (error) {
      console.log(chalk.red(`Error At splitData`), error)
      throw error
    }
  }

  convertArrayToObject = (data, idData) =>  {
    return data.map(smalldata => {
      let newData = {}
      if(smalldata.length > 4 && smalldata[smalldata.length-1] !== '\r'){
        let index = smalldata.indexOf('\r')
        if(index !== -1) smalldata.splice(index, 1)
      }
      // Kiểm tra dữ liệu thuộc form cũ hay form mới
      if (isNaN(parseFloat(smalldata[0]))) {
        // console.log('case 1')
        newData.id = newId()
        // newData.idData = idData
        newData.indicator = smalldata[0].replace("﻿", "")
        newData.value = smalldata[1]
        newData.unit = smalldata[2].split('\r').join('')
        // newData.time = smalldata[3]
        newData.sensorStatus = smalldata[4].split('\r').join('')
      } else {
        // console.log('case 2')
        newData.id = newId()
        // newData.idData = idData
        newData.indicator = smalldata[1].replace("﻿", "")
        newData.value = smalldata[2]
        newData.unit = smalldata[3].split('\r').join('')
        // newData.time = smalldata[0]
        newData.sensorStatus = "01"
      }
      return newData
    })
  }

  backupFile = (config, data, station, rootFolder, fileName) => {
    let ftp = new Client()
    ftp.on("ready", async () => {
      let dirFolder = await this.checkFtpFileFolder(ftp, fileName, station, rootFolder)
      console.log({ dirFolder })
      if(dirFolder){
        await this.putFileFTP(ftp, data, `${dirFolder}/${fileName}`)
      }
      // ftp.end()
      ftp.end()
    })
    ftp.connect(config)
  }

  setDefaultAlert = async (stationId) => {
    let stationAlertFields = {
      numberOfThreshold: 0,
      numberOfAlertThreshold: 0,
      numberOfAlertStructure: 0,
      numberOfDisconnection: 0
    }
    await app.Station.updateStationById(stationAlertFields, stationId)
  }

  checkOverThreshold = async (stationData, station) => {
    try{
      const indicatorThreshold = await app.Station.getIndicatorThreshold(station.id)
      let checkResult = stationData.map(data => {
        let index = _.findIndex(indicatorThreshold, {name : data.indicator})
        if(index < 0) return null
        let monitoringValue = parseFloat(data.value)
        let upperLimit = parseFloat(indicatorThreshold[index].upperLimit)
        let lowerLimit = parseFloat(indicatorThreshold[index].lowerLimit)
        if (monitoringValue < lowerLimit || monitoringValue > upperLimit) {
          return data.indicator
        } else {
          return null
        }
      })
      //Loc xem co indicator nao vuot nguong hay khong
      const filterResult = checkResult.filter(item => {
        return item !== null
      })

      if(filterResult.length > 0){
        return {
          isOverThreshold : true,
          indicators: filterResult
        }
      } else {
        return {
          isOverThreshold: false,
          indicators: []
        }
      }
    } catch (error){
      throw(error)
    }
  }

  updateNumberOfOverThreshold = async (stationId, numberOfThreshold) => {
  }

  sendAlertThreshold = async (station, sensors, sentTime, systemInfo) => {
    try {
      let isSentAlert = false
      const numberOfThresholdLevel = parseInt(systemInfo.paramThresholdFirstlevel)
      const numberOfAlert = parseInt(systemInfo.numberOfAlertEmail)
      sensors = sensors.join(", ")
      if(station.alertThresholdStatus === 1 && station.numberOfThreshold > numberOfThresholdLevel && station.numberOfAlertThreshold < numberOfAlert){
        if(systemInfo.alertEmailStatus === '1'){
          sendThresholdMail(station, sensors, sentTime)
          isSentAlert = true
        }
        if(systemInfo.alertSmsStatus === '1'){
          sms.sendSmsThreshold(station, sensors, sentTime)
          isSentAlert = true
        } 
      }
      return isSentAlert
    } catch (error) {
      throw error
    }
  }

  checkDisconnectionStation = async (station, systemInfo) => {
    try{
      const timeNow = moment.utc().tz('Asia/Ho_Chi_Minh').format()
      const latestSentAt = moment.utc(station.latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const disconnectionTime = parseInt(station.disconnectTime)

      const timeSubtract = Math.abs(timeNow - latestSentAt)
      if(timeSubtract > disconnectionTime*60000){
        if (sendAlertDisconnection(station, systemInfo)) {
          await app.Station.updateStationById({numberOfDisconnection: station.numberOfDisconnection + 1}, station.id)
        }
      }
    } catch (error) {
      throw error
    }
  }

  sendAlertDisconnection = (station, systemInfo) => {
    try{
      const isSentAlert = false
      const numberOfAlert = parseInt(systemInfo.numberOfAlertEmail)
      if(station.alertDisconnectStatus === 1 && station.numberOfDisconnection < numberOfAlert){
        if(systemInfo.alertEmailStatus === '1'){
          sendThresholdMail(station, sensors, sentTime)
          isSentAlert = true
        }
        if(systemInfo.alertSmsStatus === '1'){
          sms.sendSmsThreshold(station, sensors, sentTime)
          isSentAlert = true
        } 
      }
      return isSentAlert
    } catch (error){
      throw error
    } 
  }

  
  // checkDisconnectionStation(station, systemInfo) {
  //   try {
  //     const vietnamTimeNow = new Date().toDateString("en-US", {
  //       timeZone: "Asia/Ho_Chi_Minh"
  //     })
  //     const latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(station.id)
  //     if(latestSentAt === null ) return
  
  //     let timeSubtract = Math.abs(
  //       new Date(vietnamTimeNow) - new Date(latestSentAt)
  //     )
  
  //     if (
  //       timeSubtract > station.disconnectionTime*60000
  //     ) {
  //       if (station.numberOfDisconnection === null) {
  //         station.numberOfDisconnection = 0
  //       }
  //       updateDisconnectState(station.activeState, station)
        
  //       if (sendAlertDisconnection(station, systemInfo)) {
  //         let alertCount = station.numberOfDisconnection + 1
  //         let stationAlertFields = { numberOfDisconnection: alertCount }
  //         app.Station.updateStationById(stationAlertFields, station.id).then(
  //           result => {
  //             console.log(
  //               `Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`
  //             )
  //           }
  //         )
  
          
  //       }
  //     }
  //   } catch (error) {
  //     console.log(chalk.red(`Error in checkDisconnectionStation`))
  //     throw error
  //   }
  // }

  // SEND FTP
  sendFtp = (configFtp, ftpFilename, ftpContent) => {

    // var ftp = new Client()
    // const config = {
    //   host: '49.156.54.202',
    //   user: 'ftp_btnmt',
    //   password: 'btnmt@@tnmt',
    //   port: 21
    // }
    // let content = 'MA TRAM: HOBAUTRAM'
    // let ftpDir = '/fileText2.txt'
    // ftp.on('ready', async () => {
    //   await this.putFileFTP(ftp, content, ftpDir)
    //   ftp.end()
    // })
    // ftp.connect(config)

    var ftp = new Client()
    let ftpDir = `/${ftpFilename}`
    ftp.on('ready', async () => {
      await this.putFileFTP(ftp, ftpContent, ftpDir)
      ftp.end()
    })
    ftp.connect(configFtp)
  }

  syncDataBotnmt = async () => {
    // let startAt = moment().tz('Asia/Ho_Chi_Minh').format("YYYY-MM-DD HH:mm:ss")
    // let startAt = moment().utcOffset(-420).format()
    // let endAt = moment().utcOffset(-420).subtract(1, 'h').format()
    let startAt = '2017-08-10T10:07:42-07:00'
    let endAt = '2020-08-10T10:07:42-07:00'
    let dateTime = {
      year : moment(startAt).year(),
      month: moment(startAt).month() + 1,
      day: moment(startAt).date(),
      hour: moment(startAt).hour(),
      min: moment(startAt).minute(),
      second: moment(startAt).second(),
    }
    // console.log(startAt, endAt, dateTime)
    const dateTimeStr = this.convertDateTimeToBotnmtString(dateTime)
    let stationData = await app.Station.getStationFtpBotnmt()
    // console.log(stationData)
    await Promise.map(stationData.map(async station => {
      let stationIndicators = await app.StationIndicators.getIndicators(station.id)
      // console.log(stationIndicators)
      if(stationIndicators.length > 0){
        let indicators = stationIndicators.map(item => {return item.name})
        let data = await app.MonitoringDataInfo.getAverageData(station.id, indicators,  startAt, endAt )
        const content = this.generateBtnmtData(stationIndicators, data, dateTimeStr)
        const filename = station.ftpFilenameBotnmt.replace('yyyyMMddhhmmss', dateTimeStr)
        const config = {
          host: station.hostFtpBotnmt,
          user: station.usernameFtpBotnmt,
          password: station.passwordFtpBotnmt,
          port: station.portFtpBotnmt
        }
        this.sendFtp(config, filename, content)
      }
    }))
  }

  convertDateTimeToBotnmtString = (dateTime) => {
    const year = dateTime.year
    const month = ("0" + dateTime.month).slice(-2)
    const day = ("0" + dateTime.day).slice(-2)
    const hour = ("0" + dateTime.hour).slice(-2)
    const dateTimeStr = `${year}${month}${day}${hour}0000`
    return dateTimeStr
  }

  generateBtnmtData = (indicators, data, dateTimeStr) => {
    let dataStr = ''
    data.forEach(item => {
      const index = _.findIndex(indicators, element => {
        return element.name === item.indicator
      })
      const str = `${item.indicator}\t${item.avg}\t${indicators[index].unit}\t${dateTimeStr}\t${indicators[index].status}\n`
      dataStr = dataStr + str
    })
    // console.log(dataStr)
    return dataStr
  }
}

export default Ftp