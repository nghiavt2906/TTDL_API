var Client = require("ftp")
const path = require("path")
var fs = require("graceful-fs")
const _ = require("lodash")
const chalk = require("chalk")
const moment = require("moment")
const validator = require("validator")
import { sendStructureMail, sendThresholdMail, sendDisconnectionMail } from "utils/email"
import * as sms from "utils/sms"
import app from "app"
import * as func from "utils/functions"
import { newId } from "models/utils"
import { stat } from "fs"
import { Char } from "mssql"

var config = {
  // host: "192.168.1.29",
  host: "10.17.19.8",
  user: "admin",
  password: "quantracftp",
  port: 21
}

module.exports = {
  handleFtpServer: () => {
    
    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        let databaseInfo = await getDataInfo()
        let arrivedFolder = await listFolder(ftp, "/ArriveFiles", "d")
        // let arrivedFolder = ftpFolder[0]
        let activedStation = findActiveStation(arrivedFolder, databaseInfo.stationInfo)
        await Promise.all(
          activedStation.map(async station => {
            let files = await listFilesFtp(ftp, station, databaseInfo.systemInfo)
            if(!files.length){
              checkDisconnectionStation(station, databaseInfo.systemInfo)
            }
            await Promise.all(
              files.map( file => {
                  return readFileFtp(ftp, file, station, databaseInfo.systemInfo, databaseInfo.thresholdInfo)
              })
            )
          })
        )
  
        console.log(chalk.yellow("--------------- 7. Finish FTP ------------"))
        ftp.end()
        
      } catch (error) {
        console.log(chalk.blue(error))
        ftp.end()
      }
    })
    ftp.connect(config)
  }
}

async function readFiles(ftp, files, station, systemInfo, thresholdInfo){
  files.map(async file => {
    await readFileFtp(ftp, file, station, systemInfo, thresholdInfo)
  })
}

async function readFolders(ftp, activedStation, systemInfo, thresholdInfo){
  activedStation.map(async station => {
    let files = await listFilesFtp(ftp, station, systemInfo)
    await readFiles(ftp, files, station, systemInfo, thresholdInfo)
  })
}


async function getDataInfo() {
  try {
    let data = {}
    let stationAttributes = [
      "id",
      "monitoringType",
      "name",
      "monitoringGroupId",
      "symbol",
      "address",
      "ftpFolder",
      "ftpFilename",
      "latestSentAt",
      "numberOfThreshold",
      "numberOfAlertThreshold",
      "alertThresholdStatus",
      "numberOfAlertStructure",
      "alertStructureStatus",
      "numberOfDisconnection",
      "alertDisconnectionStatus"
    ]
    let stationInfo = await app.Station.findStationInfo(stationAttributes)
    stationInfo = stationInfo.map(element => {
      return element.dataValues
    })

    let systemInfo = await app.System.getSystemParams("1")
    systemInfo = systemInfo.map(element => {
      return element.dataValues
    })

    let thresholdInfo = await app.IndicatorThreshold.getThreshold()
    thresholdInfo = func.changeNestedField(thresholdInfo, "Indicator", "name", "indicatorName", true)
    thresholdInfo = func.changeNestedField(thresholdInfo, "MonitoringGroup", "name", "groupName", false)

    data.stationInfo = stationInfo
    data.systemInfo = systemInfo
    data.thresholdInfo = thresholdInfo
    return data
    
  } catch (error) {
    console.log(chalk.red(`Error in getDataInfo function`))
    throw error
  }
}

function findActiveStation(arrayFtpFolder, arrayStationInfo) {
  try {
    let activeStation = []
    arrayStationInfo.forEach(station => {
      let index = _.findIndex(arrayFtpFolder, folder => {
        return folder === station.ftpFolder
      })
      if (index > -1) {
        activeStation.push(station)
      }
    })
    return activeStation
    
  } catch (error) {
    console.log(chalk.red(`Error in findActiveStation`))
    throw error
  }
}

function listFtpFolder(ftp) {
  let listArriveFolder = listFolder(ftp, "/ArriveFiles", "d")
  let listErrorFolder = listFolder(ftp, "/ErrorFiles", "d")
  let listDataFolder = listFolder(ftp, "/DataFiles", "d")
  return Promise.all([listArriveFolder, listErrorFolder, listDataFolder])
}

function listFilesFtp(ftp, station, systemInfo) {
  return new Promise((resolve, reject) => {
    let dirStation = `${func.getValueSystem(systemInfo, "dirReceiveFtp")}/${station.ftpFolder}`
    ftp.list(dirStation, (err, result) => {
      if (err) {
        console.log(chalk.red(`Error in listFilesFtp`))
        reject(err)
      }
      let listFiles = []
      if (result === undefined || !result.length) {       
        resolve([])
      } else {
        result.forEach(file => {
          if (file.type === "-") {
            listFiles = [...listFiles, file.name]
          }
        })
        resolve(listFiles)
      }
    })
  })
}

function checkDisconnectionStation(station, systemInfo){
  try {
    let vietnamTimeNow = new Date().toDateString("en-US", {
      timeZone: "Asia/Ho_Chi_Minh"
    })
    // let timeSubtract =
      // Math.abs(new Date(vietnamTimeNow) - new Date(station.latestSentAt)) /
      // (parseInt(func.getValueSystem(systemInfo, "paramDisconnectionFirstlevel")) * 1000)
  
    let timeSubtract = Math.abs(new Date(vietnamTimeNow) - new Date(station.latestSentAt))
  
    if (timeSubtract > (parseInt(func.getValueSystem(systemInfo, "paramDisconnectionFirstlevel")) * 1000)) {
      if (station.numberOfDisconnection === null) {
        station.numberOfDisconnection = 0
      }
      if (sendAlertDisconnection(station, systemInfo)) {
        let alertCount = station.numberOfDisconnection + 1
        let stationAlertFields = { numberOfDisconnection: alertCount }
        app.Station.updateStationById(stationAlertFields, station.id).then(result => {
          console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`) 

        })
      }
    }
    
  } catch (error) {
    console.log(chalk.red(`Error in checkDisconnectionStation`))
    throw error
  }
}

async function readFileFtp(ftp, fileName, station, systemInfo, indicatorThreshold) {
  try {
    let dirFile = `${func.getValueSystem(systemInfo, "dirReceiveFtp")}/${station.ftpFolder}/${fileName}`

    console.log(' ====> Dirfile' ,dirFile)
    let fileInfo = analyzeFile(fileName)
    let dataInfo = {}
    let sentTime = func.convertTimeToISOFormat(fileInfo.time)

    // sentTime = moment(sentTime).format("YYYY-MM-DD HH:mm:ss")
    // sentTime = moment(sentTime, "YYYY-MM-DD HH:mm:ss")
    sentTime = new Date(sentTime)
    dataInfo.id = newId()
    dataInfo.stationId = station.id
    dataInfo.sentAt = sentTime
    dataInfo.location = null
    dataInfo.battery = null
    dataInfo.isFtpdata = 1

    console.log(chalk.yellow(`-------- 4. Read File Ftp ${station.name}--------`))
    let streamData = await streamDataFtp(ftp, dirFile)
    let data = await convertStreamData(streamData, fileName)
    // console.log({data})
    // console.log(chalk.yellow(`-------- 4.1 Done Stream File Ftp ${station.name}--------`))
    await deleteFtpFile(ftp, dirFile)
    console.log(chalk.yellow(`-------- 5. Check Format File ${station.name} --------`))
    let validateFileName = compareFormatFile(fileName, station.ftpFilename)
    if (!validateFileName) {
      
      let dirFolder = await checkFtpFileFolder(ftp, fileName, station, func.getValueSystem(systemInfo, "dirWrongFtp"))
      console.log({ dirFolder })
      if(dirFolder){
        await putFileFTP(ftp, data, `${dirFolder}/${fileName}`)
      }
      
      if (sendAlertWrongStructure(station, systemInfo)) {
        console.log("===> Sending Alert Structure")
        let stationAlertFields = { numberOfAlertStructure: alertCount }
        let alertCount = station.numberOfAlertStructure + 1
        app.Station.updateStationById(stationAlertFields, station.id).then(result => {
          // console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
          // // console.log({result})
        })
      }
      return
    }

    dataInfo.monitoringContent = data
    console.log({dataInfo})

    let insertedInfo = await app.MonitoringDataInfo.createMonitoringDataInfo(dataInfo)
    // console.log(chalk.red(insertedInfo.id))
    if (insertedInfo.id !== undefined) {
      let finalData = splitData(data, insertedInfo.id)
      // console.log({finalData})
      await app.MonitoringData.createMonitoringData(finalData)
      await app.Station.updateStationById({latestSentAt : dataInfo.sentAt}, dataInfo.stationId)
      
      // console.log(chalk.yellow(`-------- 6. Check Threshold ${station.name} --------`))
      let resultCheckThreshold = checkOverThreshold(finalData, station, indicatorThreshold)
      // // console.log({resultCheckThreshold})
      let filterResult = resultCheckThreshold.filter(item => {
        return item !== null
      })
      // // console.log({filterResult})
      if (filterResult.length > 0) {
        let countOverThreshold = station.numberOfThreshold + 1
        let stationFiles = { numberOfThreshold: countOverThreshold }
        app.Station.updateStationById(stationFiles, station.id).then(result => {
          // console.log(`Đã update số lần vượt ngưỡng của tram ${station.name} lên ${countOverThreshold}`)
        })

        if (sendAlertThreshold(station, filterResult, sentTime, systemInfo)) {
          let alertCount = station.numberOfAlertThreshold + 1
          let stationAlertFields = { numberOfAlertThreshold: alertCount }
          app.Station.updateStationById(stationAlertFields, station.id).then(result => {
            // console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
          })
        }
      } else {
        let stationAlertFields = {
          numberOfThreshold: 0,
          numberOfAlertThreshold: 0,
          numberOfAlertStructure: 0,
          numberOfDisconnection: 0
        }
        app.Station.updateStationById(stationAlertFields, station.id).then(result => {
          // console.log(`Đã update các thông số của tram ${station.name} về 0`)
        })
      }

      let dirFolder = await checkFtpFileFolder(ftp, fileName, station, func.getValueSystem(systemInfo, "dirSaveFtp"))

      // console.log(chalk.red(`DirFoloder${dirFolder}`))
      if (dirFolder) {
        // console.log(chalk.blue("============================================="))
        await putFileFTP(ftp, data, `${dirFolder}/${fileName}`)
      } else {
        // console.log(chalk.red("======================> dirFile not exist"))
      }
    }
  } catch (error) {
    console.log(chalk.red(error))
    ftp.end()
    throw error
  }
  // // console.log({station})
}


function streamDataFtp(ftp, dirFile) {
  return new Promise((resolve, reject) => {
    ftp.get(dirFile, (err, streamData) => {
      console.log(`Stream data ${dirFile}`)
      if (err) { 
        console.log('Stream data error', err)
        // ftp.end()
        reject(err)
        // throw err
      }

      resolve(streamData)
    })
  })
}

function convertStreamData(streamData, fileName) {
  return new Promise((resolve, reject) => {
    let data = ""
    streamData
      .on("data", chunk => {
        data += chunk
      })
      .on("end", () => {
        // fs.writeFile(`./server/ftp/${fileName}`, data, err => {
        //   if (err) {
        //     // console.log({ err })
        //     reject(err)
        //   }
        // })
        console.log(`convert Stream Data`)
        resolve(data)
      })
  })
}

//Check over threshold
function checkOverThreshold(stationData, station, indicatorThreshold) {
  try {
    // // console.log({indicatorThreshold})
    let checkResult = stationData.map(data => {
      let test = {
        indicatorName: data.indicator,
        monitoringGroupId: station.monitoringGroupId
      }
      // // console.log({test})
      let index = _.findIndex(indicatorThreshold, {
        indicatorName: data.indicator,
        monitoringGroupId: station.monitoringGroupId
      })
      // // console.log({index})
      if (index < 0) return null
      let monitoringValue = parseFloat(data.value)
      let upperLimit = parseFloat(indicatorThreshold[index].upperLimit)
      let lowerLimit = parseFloat(indicatorThreshold[index].lowerLimit)
      if (monitoringValue < lowerLimit || monitoringValue > upperLimit) {
        return data.indicator
      } else {
        // // console.log('this case')
        return null
      }
    })
    return checkResult
    
  } catch (error) {
    console.log(chalk.red(`Error At CheckOverThreshold`))
    throw error
  }
}

//Send Alert Disconnection
function sendAlertDisconnection(station, systemInfo) {
  try {
    let isSendAlert = false
    if (station.alertDisconnectionStatus === 1 && station.numberOfDisconnection < parseInt(func.getValueSystem(systemInfo, "numberOfAlertEmail"))) {
      if (func.getValueSystem(systemInfo, "alertEmailStatus") === "1") {
        sendDisconnectionMail(station)
        if (func.getValueSystem(systemInfo, "alertSmsStatus") === "1") {
          sms.sendSmsDisconnection(station)
        }
        isSendAlert = true
      }
    }
    return isSendAlert
    
  } catch (error) {
    console.log(chalk.red(`Error At sendAlertDisconnection`))
    throw error
  }
}

//Send Alert Wrong Structure
function sendAlertWrongStructure(station, systemInfo) {
  try {
    let isSendAlert = false
    if (station.alertStructureStatus === 1 && station.numberOfAlertStructure < parseInt(func.getValueSystem(systemInfo, "numberOfAlertEmail"))) {
      if (func.getValueSystem(systemInfo, "alertEmailStatus") === "1") {
        sendStructureMail(station)
        if (func.getValueSystem(systemInfo, "alertSmsStatus") === "1") {
          sms.sendSmsWrongStructure(station)
        }
        isSendAlert = true
      }
    }
    return isSendAlert
    
  } catch (error) {
    console.log(chalk.red(`Error At sendAlertWrongStructure`))
    throw error
  }
}

//Send Alert Wrong Structure
function sendAlertThreshold(station, sensors, sentTime, systemInfo) {
  try {
    let isSendAlert = false
    sensors = sensors.join(", ")
    // // console.log('status', station.alertThresholdStatus, station.numberOfThreshold, parseInt(func.getValueSystem(systemInfo, 'paramThresholdFirstlevel')), station.numberOfAlertThreshold, parseInt(func.getValueSystem(systemInfo, 'numberOfAlertEmail')))
    if (
      station.alertThresholdStatus === 1 &&
      station.numberOfThreshold > parseInt(func.getValueSystem(systemInfo, "paramThresholdFirstlevel")) &&
      station.numberOfAlertThreshold < parseInt(func.getValueSystem(systemInfo, "numberOfAlertEmail"))
    ) {
      if (func.getValueSystem(systemInfo, "alertEmailStatus") === "1") {
        sendThresholdMail(station, sensors, sentTime)
        if (func.getValueSystem(systemInfo, "alertSmsStatus") === "1") {
          sms.sendSmsThreshold(station, sensors, sentTime)
        }
        isSendAlert = true
      }
    }
    return isSendAlert
    
  } catch (error) {
    console.log(chalk.red(`Error At sendAlertThreshold`))
    throw error
  }
}

/*
 * Description: Hàm này để chuyển các giá trị QT trong array of arrays thành array of objects
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {array} data : Array của các array data VD: data = [ ['﻿PH', '7.657', '', '20190929130707', '00\r' ],..]
 *
 * return {array} array of objects data
 * VD: [{tenchiso: "PH" ,
 * ketqua: "7.657" ,
 * donvi: "" ,
 * thoigian: "20190929130707" ,
 * trangthaiSensor: "00},...]
 */
function convertArrayToObject(data, idData) {
  return data.map(smalldata => {
    let newData = {}

    // Kiểm tra dữ liệu thuộc form cũ hay form mới
    if (smalldata.length > 4) {
      newData.id = newId()
      newData.idData = idData
      newData.indicator = smalldata[0].replace("﻿", "")
      newData.value = smalldata[1]
      newData.unit = smalldata[2]
      // newData.time = smalldata[3]
      newData.sensorStatus = smalldata[4].replace("\r", "")
    } else {
      newData.id = newId()
      newData.idData = idData
      newData.indicator = smalldata[1].replace("﻿", "")
      newData.value = smalldata[2]
      newData.unit = smalldata[3].replace("\r", "")
      // newData.time = smalldata[0]
      newData.sensorStatus = "01"
    }
    return newData
  })
}

/*
 * Description: Chuyển string dữ liệu trong file ftp và chuyển thành các object data
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {string} data : string data trong file dữ liệu
 * @param {boolean} isNewDulieu : xác nhận string data này thuộc form cũ hay form mới
 *
 * return {array} array of objects data
 * VD: [{tenchiso: "PH" ,
 * ketqua: "7.657" ,
 * donvi: "" ,
 * thoigian: "20190929130707" ,
 * trangthaiSensor: "00},...]
 */
function splitData(data, idData) {
  try {
    
    let dataArray = []
    data = _.split(data, "\n")
  
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
  
    //Chuyển array dữ liệu thành các object dữ liệu
    return convertArrayToObject(dataArray, idData)
  } catch (error) {
    console.log(chalk.red(`Error At splitData`), error)
    throw error
  }
}

/*
 * Description: Hàm này để tách tên file ra thành tên file, thời gian gửi về, loại file
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {string} tenfile : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
 *
 * return {object} file gồm loại file, thời gian gửi về và tên file
 */
function analyzeFile(fileName) {
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

/*
 * Description: Hàm này để so sánh file gửi về và file mặc định trong DB có giống không
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {string} tenFileGuive : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
 * @param {string} tenFileMacdinh : String tên file ví dụ "DNa_CENT_NUOHDX_yyyyMMddhhmmss.txt"
 *
 * return {bolean} true nếu file gửi về giống với mặc định
 */
function compareFormatFile(sentFileName, defaultFileName) {
  try {
    var sentFile = analyzeFile(sentFileName)
    var defaultFile = analyzeFile(defaultFileName)
    // // console.log({sentFile,defaultFile})
    if (sentFile.type !== "txt" || sentFile.name !== defaultFile.name || !validateTime(sentFile.time) || isNaN(sentFile.time)) {
      return false
    }
    return true
    
  } catch (error) {
    console.log(chalk.red(`Error in compareFormatFile`))
    throw error
  }
}

/*
 * Description: Hàm này để validate thời gian gửi về có đúng không
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {string} thoigian : String thời gian ví dụ "20190912010203"
 *
 * return {boolean} true/false
 */
function validateTime(time) {
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

/*
 * Description: Hàm này để validate nội dung của file ftp gửi về có đúng cấu trúc không.
 * Writer: Đỗ Hữu Tín (06/09/2019)
 *
 * @param {array} noidung : Array dữ liệu quan trắc
 *
 * Kết quả trả về false nếu:
 * - Kết quả quan trắc không phải là số
 * - Thời gian gửi về không hợp lệ
 * - Trạng thái của sensor bị sai quy định
 * Kết quả gửi về true nếu validate thành công
 */
function validateContentFile(noidung) {
  return noidung.every(dataChiso => {
    if (!validator.isNumeric(dataChiso.ketqua) || !validateTime(dataChiso.thoigian) || _.indexOf(["00", "01", "02"], dataChiso.trangthaiSensor) < 0) {
      return false
    }
    return true
  })
}


function listFolder(ftp, folderDir, type) {
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

function putFileFTP(ftp, content, destDir) {
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



async function checkFtpFileFolder(ftp, fileName, station, rootFolder) {
  try {
    let fileInfo = analyzeFile(fileName)
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
    
    mkdirFtp(ftp, dirFileFolder)
    return dirFileFolder
  } catch (error) {
    console.log(chalk.red('Error at checkFtpFileFolder'))
    throw error
  }
}

async function createFtpFolder(ftp, rootDir, folderDir) {
  try {
    // await sleep(500)
    console.log('===> List rootDir', rootDir)
    let listFolder1 = await listFolder(ftp, rootDir, "d")
    console.log('List Folder:',listFolder1)
    // await sleep(500)
    console.log(chalk.green('===>',listFolder1))
    if (!listFolder1.includes(folderDir)) {
      let result = await mkdirFtp(ftp, `${rootDir}/${folderDir}`)
      // console.log(chalk.blue('Here',result))
    }
       
  } catch (error) {
    console.log('Loi day bac', error)
    throw error
  }
  
}

function mkdirFtp(ftp, dirFolder) {
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

function deleteFtpFile(ftp, path) {
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


function getFileInfo(fileName) {
  try {
    let fileInfo = {}
    let file = fileName.split(".")
    fileInfo.type = file[1]
    let name = file[0].split("_")
    fileInfo.name = file[0].split(name[name.length - 1])[0]
    fileInfo.time = name[name.length - 1]
    fileInfo.year = fileInfo.time.substr(0, 4)
    fileInfo.month = fileInfo.time.substr(4, 2)
    fileInfo.day = fileInfo.time.substr(6, 2)
    fileInfo.hour = fileInfo.time.substr(8, 2)
    fileInfo.min = fileInfo.time.substr(10, 2)
    fileInfo.sec = fileInfo.time.substr(12, 2)
    return fileInfo
    
  } catch (error) {
    console.log(chalk.red(`Error in getFileInfo`))
    throw error
  }
}
