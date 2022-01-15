// import Client from 'ftp'
// import path from 'path'
// import fs from 'graceful-fs'
// import _ from 'lodash'
// import {analyze_FolderName} from 'src/utils/functions'
// import async from 'async'
// import chalk from 'chalk'
// import func from 'src/utils/functions'
// import moment from 'moment'
// import validator from 'validator'
// import {sendStructureMail, sendThresholdMail,sendDisconnectionMail } from 'src/utils/email'
// import sms from 'src/utils/sms'

var Client = require('ftp')
const path = require('path');
// var fs = require('fs')
var fs = require('graceful-fs')
const _ = require('lodash')
// const db = require('../Database/queryDatabase')
const async = require('async')
const chalk = require('chalk')
// const func = require('./objectFunctions')
const moment = require('moment')
const validator = require('validator')
import {sendStructureMail, sendThresholdMail,sendDisconnectionMail } from 'utils/email'
import * as sms from 'utils/sms'
import models from 'models'
import * as func from "utils/functions"
import system from 'api/routes/system';
import { newId } from 'models/utils';

var config = {
  host: '192.168.1.29',
  user: 'admin',
  password: 'quantracftp',
  port: 21
}


module.exports = {
  checkFtpFolder : () => {
    var ftp = new Client();
    ftp.on('ready', async () => {
      try{
        let dir = './server/ftp'
        deleteFtpFiles(dir).then(() => {
          console.log('===> Finish Delete Files')
        })
        
        let databaseInfo = await getDataInfo()
        // console.log(databaseInfo.thresholdInfo)
        let ftpFolder = await listFtpFolder(ftp)
        let arrivedFolder = ftpFolder[0]
        let errorFolder = ftpFolder[1]
        let dataFolder = ftpFolder[2]
        // console.log({arrivedFolder, errorFolder, dataFolder})
        let activedStation = findActiveStation(arrivedFolder, databaseInfo.stationInfo )
        // console.log({activedStation})
        console.log(chalk.yellow('------- 1. Find Actived Station ---------'))
        await Promise.all(activedStation.map(async station => {
          let files = await listFilesFtp(ftp, station, databaseInfo.systemInfo)
          console.log(chalk.yellow(`------- 3. Find files in Station Folder ${station.name}------------`))
          // console.log({files})
          let test = await Promise.all(files.map(async file => {
            // let data = await readFileFtp(ftp, file, station, databaseInfo.systemInfo, databaseInfo.thresholdInfo)
            readFileFtp(ftp, file, station, databaseInfo.systemInfo, databaseInfo.thresholdInfo)
          }))
          console.log(chalk.red({test}))
        }))
        
        console.log(chalk.yellow('--------------- 7. Finish FTP ------------'))
        
        // console.log({analyzeFtp})
        // getDataInfo().then(result => {
        //   // console.log(result.stationInfo)
        //   listFtpFolder(ftp).then(result1 => {
        //     // console.log(result1[0])
        //     findActiveStation(result1[0],result.stationInfo)
        //     console.log(findActiveStation(result1[0],result.stationInfo))
        //   })
        // })
        // console.log('--------------- FinishFTP ----------------')
        ftp.end()
      } catch (err){
        console.log({err})
        ftp.end()
      }
    })
    ftp.connect(config)  
  }      
}



// Delete all file in FTP folder
function deleteFtpFiles(dir){
  return new Promise((resolve, reject) => {
    fs.readdir(dir, async (err, files) => {
      if(err) reject(err)
      await Promise.all(files.map(file => {
        deleteFile(dir, file).then(() => {
          resolve()
        })
      }))
    })
  })
}

function getDataInfo (){
  return new Promise(async(resolve, reject) => {
    let data = {}
    let stationAttributes = ['id', 'monitoringType', 'name', 'monitoringGroupId', 'symbol', 'address', 'ftpFolder', 'ftpFilename', 'latestSentAt','numberOfThreshold','numberOfAlertThreshold', 'alertThresholdStatus', 'numberOfAlertStructure', 'alertStructureStatus', 'numberOfDisconnection', 'alertDisconnectionStatus']
    let stationInfo = await models.Station.findStationInfo(stationAttributes)
    stationInfo = stationInfo.map(element => {
      return element.dataValues
    })

    let systemInfo = await models.System.getSystemParams('1')
    systemInfo = systemInfo.map(element => {
      return element.dataValues
    })

    let thresholdInfo = await models.IndicatorThreshold.getThreshold()
    thresholdInfo = func.changeNestedField(thresholdInfo, 'Indicator', 'name', 'indicatorName', true)
    thresholdInfo = func.changeNestedField(thresholdInfo, 'MonitoringGroup', 'name', 'groupName', false)

    data.stationInfo = stationInfo
    data.systemInfo = systemInfo
    data.thresholdInfo = thresholdInfo
    resolve(data)
  })
}

function findActiveStation (arrayFtpFolder, arrayStationInfo){
  let activeStation = []
  arrayStationInfo.forEach(station => {
    let index = _.findIndex(arrayFtpFolder, (folder) => {
      return folder === station.ftpFolder
    })
    if(index > -1){
      activeStation.push(station)
    }
  })
  return activeStation
}

function listFtpFolder(ftp){
  let listArriveFolder = listFolder(ftp,'/ArriveFiles','d')
  let listErrorFolder = listFolder(ftp,'/ErrorFiles','d')
  let listDataFolder = listFolder(ftp,'/DataFiles','d')
  return Promise.all([listArriveFolder, listErrorFolder, listDataFolder])
}

function listFilesFtp (ftp, station, systemInfo){
  return new Promise((resolve, reject) => {
    let dirStation = `${func.getValueSystem(systemInfo, 'dirReceiveFtp')}/${station.ftpFolder}`
    ftp.list(dirStation, (err, result) => {
      if(err) return reject(err)
      let listFiles = []
      console.log(chalk.yellow(`------- 2. Check Disconnection  ${station.name} --------`))
      if(result === undefined || !result.length){
        console.log(`Tram ${station.ftpFolder} khong gui du lieu ve`)
        let vietnamTimeNow = new Date().toDateString('en-US', {timeZone: 'Asia/Ho_Chi_Minh'})
        let timeSubtract = Math.abs(new Date(vietnamTimeNow) - new Date(station.latestSentAt))/(parseInt(func.getValueSystem(systemInfo, 'paramDisconnectionFirstlevel'))*1000)
        // console.log('time: ', new Date(vietnamTimeNow), new Date(station.latestSentAt), timeSubtract)
        
        if(timeSubtract > 60){
          if(station.numberOfDisconnection === null){
            station.numberOfDisconnection = 0
          }
          if(sendAlertDisconnection(station, systemInfo)){
            let alertCount = station.numberOfDisconnection + 1
            let stationAlertFields = {'numberOfDisconnection' : alertCount}
            models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
              console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
              console.log({result})
            })
          }
        }
        resolve([])
      }
      result.forEach(file => {
        if(file.type === '-'){
          listFiles = [...listFiles, file.name]
        }
      })
      resolve(listFiles)
    })
  })
}

function readFileFtp (ftp, fileName, station, systemInfo, indicatorThreshold){
  return new Promise((resolve, reject) => {
    // console.log({station})
    let dirFile = `${func.getValueSystem(systemInfo, 'dirReceiveFtp')}/${station.ftpFolder}/${fileName}`
    // console.log({dirFile})
    let fileInfo = analyzeFile(fileName)
    let dataInfo = {}
  
    let sentTime = func.convertTimeToISOFormat(fileInfo.time)
    sentTime = moment(sentTime).format('YYYY-MM-DD HH:mm:ss')
    dataInfo.id = newId()
    dataInfo.stationId = station.id
    dataInfo.sentAt = sentTime
    dataInfo.location = null
    dataInfo.battery = null
    dataInfo.isFtpdata = 1
    console.log(chalk.yellow(`-------- 4. Read File Ftp ${station.name}--------`))
    ftp.get(dirFile, (err, streamData) => {
      if(err){
        console.log('=====> Error Here')
        console.log(chalk.red(err))
        reject(err)
      }
      console.log(chalk.yellow(`------- 4.1 Get Stream Data --------`))
      if(streamData === undefined){
        console.log(chalk.blue('Stream Data is undefined'))
        resolve()
        return
      }
  
      let data = ''
      streamData.on('data', chunk => {
        data += chunk
      }).on('end', async () => {
        fs.writeFile(`./server/ftp/${fileName}`, data, err => {
          if(err) {
            console.log({err})
            reject(err)
          }
        })
  
        if(data == undefined){
          console.log(chalk.red('Data is undifined'))
          resolve()
        }
  
        console.log(chalk.yellow(`-------- 5. Check Format File ${station.name} --------`))
        let validateFileName = compareFormatFile(fileName, station.ftpFilename)
        if(!validateFileName){
          console.log('===> Sending Alert Structure')
          if(sendAlertWrongStructure(station, systemInfo)){
            let alertCount = station.numberOfAlertStructure + 1
            let stationAlertFields = {'numberOfAlertStructure' : alertCount}
            models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
              console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
              // console.log({result})
            })
          }
          resolve()
          return
        }
  
        dataInfo.monitoringContent = data
        // console.log({dataInfo})

        let insertedInfo = await models.MonitoringDataInfo.createMonitoringDataInfo(dataInfo)
        // console.log({insertedInfo})
        if(insertedInfo.id !== undefined){
          let finalData = splitData(data, insertedInfo.id)
          // console.log({finalData})
          await models.MonitoringData.createMonitoringData(finalData)

          console.log(chalk.yellow(`-------- 6. Check Threshold ${station.name} --------`))
          let resultCheckThreshold = checkOverThreshold(finalData, station, indicatorThreshold)
          // console.log({resultCheckThreshold})
          let filterResult = resultCheckThreshold.filter(item =>  {
            return item !== null
          })
          // console.log({filterResult})
          if(filterResult.length > 0){
            let countOverThreshold = station.numberOfThreshold + 1
            let stationFiles = {'numberOfThreshold' : countOverThreshold}
            models.Station.updateStationById(stationFiles, station.id).then((result) => {
              console.log(`Đã update số lần vượt ngưỡng của tram ${station.name} lên ${countOverThreshold}`)
              console.log({result})
            })
      
            if(sendAlertThreshold(station, filterResult , sentTime, systemInfo)){
              let alertCount = station.numberOfAlertThreshold + 1
              let stationAlertFields = {'numberOfAlertThreshold' : alertCount}
              models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
                console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
                console.log({result})
              })
            }
          } else {
            let stationAlertFields = {'numberOfThreshold' : 0, 'numberOfAlertThreshold': 0, 'numberOfAlertStructure': 0, 'numberOfDisconnection': 0}
            models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
              console.log(`Đã update các thông số của tram ${station.name} về 0`)
              console.log({result})
            })
          }
        }


        // resolve(finalData)
        //Kiem tra vuot nguong va gui canh bao
        // let thresholdResult = finalData.map(element => {
        //   let index = _.findIndex(indicatorThreshold, {symbol: element.symbol, id : station.monitoringGroupId})
        //   if(index < 0) return
  
        // })
      })
      // ftp.end()
    })
  })
}

function streamDataFtp(ftp, dirFile){
  return new Promise((resolve, reject) => {
    ftp.get(dirFile, (err, streamData) => {
      if(err) reject(err)
      if(stra){}
    })
  })
  ftp.get(dirFile, (err, streamData) => {
    if(err){
      console.log('=====> Error Here')
      console.log(chalk.red(err))
      reject(err)
    }
    console.log(chalk.yellow(`------- 4.1 Get Stream Data --------`))
    if(streamData === undefined){
      console.log(chalk.blue('Stream Data is undefined'))
      resolve()
      return
    }

    let data = ''
    streamData.on('data', chunk => {
      data += chunk
    }).on('end', async () => {
      fs.writeFile(`./server/ftp/${fileName}`, data, err => {
        if(err) {
          console.log({err})
          reject(err)
        }
      })

      if(data == undefined){
        console.log(chalk.red('Data is undifined'))
        resolve()
      }

      console.log(chalk.yellow(`-------- 5. Check Format File ${station.name} --------`))
      let validateFileName = compareFormatFile(fileName, station.ftpFilename)
      if(!validateFileName){
        console.log('===> Sending Alert Structure')
        if(sendAlertWrongStructure(station, systemInfo)){
          let alertCount = station.numberOfAlertStructure + 1
          let stationAlertFields = {'numberOfAlertStructure' : alertCount}
          models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
            console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
            // console.log({result})
          })
        }
        resolve()
        return
      }

      dataInfo.monitoringContent = data
      // console.log({dataInfo})

      let insertedInfo = await models.MonitoringDataInfo.createMonitoringDataInfo(dataInfo)
      // console.log({insertedInfo})
      if(insertedInfo.id !== undefined){
        let finalData = splitData(data, insertedInfo.id)
        // console.log({finalData})
        await models.MonitoringData.createMonitoringData(finalData)

        console.log(chalk.yellow(`-------- 6. Check Threshold ${station.name} --------`))
        let resultCheckThreshold = checkOverThreshold(finalData, station, indicatorThreshold)
        // console.log({resultCheckThreshold})
        let filterResult = resultCheckThreshold.filter(item =>  {
          return item !== null
        })
        // console.log({filterResult})
        if(filterResult.length > 0){
          let countOverThreshold = station.numberOfThreshold + 1
          let stationFiles = {'numberOfThreshold' : countOverThreshold}
          models.Station.updateStationById(stationFiles, station.id).then((result) => {
            console.log(`Đã update số lần vượt ngưỡng của tram ${station.name} lên ${countOverThreshold}`)
            console.log({result})
          })
    
          if(sendAlertThreshold(station, filterResult , sentTime, systemInfo)){
            let alertCount = station.numberOfAlertThreshold + 1
            let stationAlertFields = {'numberOfAlertThreshold' : alertCount}
            models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
              console.log(`Đã update số lần cảnh báo của tram ${station.name} lên ${alertCount}`)
              console.log({result})
            })
          }
        } else {
          let stationAlertFields = {'numberOfThreshold' : 0, 'numberOfAlertThreshold': 0, 'numberOfAlertStructure': 0, 'numberOfDisconnection': 0}
          models.Station.updateStationById(stationAlertFields, station.id).then((result) => {
            console.log(`Đã update các thông số của tram ${station.name} về 0`)
            console.log({result})
          })
        }
      }
    })
  })
}

//Check over threshold
function checkOverThreshold(stationData, station, indicatorThreshold){
  // console.log({indicatorThreshold})
  let checkResult = stationData.map(data => {
    let test = {indicatorName : data.indicator, monitoringGroupId : station.monitoringGroupId}
    // console.log({test})
    let index = _.findIndex(indicatorThreshold, {indicatorName : data.indicator, monitoringGroupId : station.monitoringGroupId})
    // console.log({index})
    if(index < 0) return null
    let monitoringValue = parseFloat(data.value)
    let upperLimit = parseFloat(indicatorThreshold[index].upperLimit)
    let lowerLimit = parseFloat(indicatorThreshold[index].lowerLimit)
    if(monitoringValue < lowerLimit || monitoringValue > upperLimit){
      return data.indicator
    } else {
      // console.log('this case')
      return null
    }   
  })
  return checkResult
}

//Send Alert Disconnection
function sendAlertDisconnection(station, systemInfo){
  let isSendAlert = false
  if(station.alertDisconnectionStatus === 1 && station.numberOfDisconnection < parseInt(func.getValueSystem(systemInfo, 'numberOfAlertEmail'))){
    if(func.getValueSystem(systemInfo, 'alertEmailStatus') === '1'){
      sendDisconnectionMail(station)
      if(func.getValueSystem(systemInfo, 'alertSmsStatus') === '1'){
        sms.sendSmsDisconnection(station)
      }
      isSendAlert = true
    }
  }
  return isSendAlert
}

//Send Alert Wrong Structure
function sendAlertWrongStructure(station, systemInfo){
  let isSendAlert = false
  if(station.alertStructureStatus === 1 && station.numberOfAlertStructure < parseInt(func.getValueSystem(systemInfo, 'numberOfAlertEmail'))){
    if(func.getValueSystem(systemInfo, 'alertEmailStatus') === '1'){
      sendStructureMail(station)
      if(func.getValueSystem(systemInfo, 'alertSmsStatus') === '1'){
        sms.sendSmsWrongStructure(station)
      }
      isSendAlert = true
    }
  }
  return isSendAlert
}

//Send Alert Wrong Structure
function sendAlertThreshold(station, sensors, sentTime, systemInfo){
  let isSendAlert = false
  sensors = sensors.join(', ')
  // console.log('status', station.alertThresholdStatus, station.numberOfThreshold, parseInt(func.getValueSystem(systemInfo, 'paramThresholdFirstlevel')), station.numberOfAlertThreshold, parseInt(func.getValueSystem(systemInfo, 'numberOfAlertEmail')))
  if(station.alertThresholdStatus === 1 && station.numberOfThreshold > parseInt(func.getValueSystem(systemInfo, 'paramThresholdFirstlevel')) && station.numberOfAlertThreshold < parseInt(func.getValueSystem(systemInfo, 'numberOfAlertEmail'))){
    if(func.getValueSystem(systemInfo, 'alertEmailStatus') === '1'){
      sendThresholdMail(station, sensors, sentTime)
      if(func.getValueSystem(systemInfo, 'alertSmsStatus') === '1'){
        sms.sendSmsThreshold(station, sensors, sentTime)
      }
      isSendAlert = true
    }
  }
  return isSendAlert
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
function convertArrayToObject(data, idData){
  return data.map(smalldata => {
    let newData = {}

    // Kiểm tra dữ liệu thuộc form cũ hay form mới
    if(smalldata.length > 4){
      newData.id = newId()
      newData.idData = idData
      newData.indicator = smalldata[0].replace('﻿','')
      newData.value = smalldata[1]
      newData.unit = smalldata[2]
      // newData.time = smalldata[3]
      newData.sensorStatus = smalldata[4].replace('\r','')
    } else {
      newData.id = newId()
      newData.idData = idData
      newData.indicator = smalldata[1].replace('﻿','')
      newData.value = smalldata[2]
      newData.unit = smalldata[3].replace('\r','')
      // newData.time = smalldata[0]
      newData.sensorStatus = '01'
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
function splitData (data, idData) {
  let dataArray = []
  data = _.split(data,'\n')

  //Cắt string data thành các mảng array 
  data.forEach((smallData) => {
    smallData = _.split(smallData,'\t')
    if(smallData.length >= 4){
      dataArray.push(smallData)
    }
  })

  //Chuyển array dữ liệu thành các object dữ liệu
  return convertArrayToObject(dataArray, idData)
}


/*
* Description: Hàm này để tách tên file ra thành tên file, thời gian gửi về, loại file
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} tenfile : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
*
* return {object} file gồm loại file, thời gian gửi về và tên file
*/
function analyzeFile (fileName) {
  var file = {}
  var formatFile = _.split(fileName,'.')
  var splittingFile = _.split(formatFile[0],'_')

  file.type = formatFile[1]
  if(splittingFile.length > 3){
    file.symbol = splittingFile[2]
    file.time = splittingFile[3]
    file.name = _.split(formatFile[0],file.time )[0]
  } else {
    file.symbol = splittingFile[0]
    file.time = splittingFile[1]
    file.name = formatFile[0].replace(file.time,'')
  }
  return file
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
function compareFormatFile (sentFileName, defaultFileName) {
  var sentFile = analyzeFile(sentFileName)
  var defaultFile = analyzeFile(defaultFileName)
  // console.log({sentFile,defaultFile})
  if(sentFile.type !== 'txt' || sentFile.name !== defaultFile.name || !validateTime(sentFile.time)){
    return false
  }
  return true
}

/*
* Description: Hàm này để validate thời gian gửi về có đúng không
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} thoigian : String thời gian ví dụ "20190912010203"
*
* return {boolean} true/false
*/
function validateTime (time) {
  if(!validator.isNumeric(time) || time.length !== 14){
    return false
  }
  var year = parseInt(time.substr(0,4))
  var month = parseInt(time.substr(4,2))
  var day = parseInt(time.substr(6,2))
  var hour = parseInt(time.substr(8,2))
  var min = parseInt(time.substr(10,2))
  var sec = parseInt(time.substr(12,2))
  if(year < 2019 || month > 12 || day > 31){
    return false
  }
  if(hour > 24 || min > 60 || sec > 60){
    return false
  }
  return true
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
function validate_noidungFile (noidung) {
  return noidung.every((dataChiso) => {
    if(!validator.isNumeric(dataChiso.ketqua) || !validateTime(dataChiso.thoigian) || _.indexOf(['00','01','02'],dataChiso.trangthaiSensor) < 0) {
      return false
    }
    return true
  })
}

function deleteFile (dir,file){
  return new Promise((resolve,reject) => {
    fs.unlink(path.join(dir,file), err => {
      if(err) reject(err)
      // console.log({file})
      resolve()
    })
  })
}

function testFile (){
  let dir = './FTP'
  fs.readdir(dir, async(err,files)=> {
    if(err) console.log('Lỗi trong ham Dir')
    await Promise.all(files.map((file) => deleteFile(dir,file))).then(() => {
      console.log('abc')
    }).catch((err) => {
      console.log(err)
    })

    // writeFile function with filename, content and callback function

    let arrayName = [Math.floor(Math.random() * 100),Math.floor(Math.random() * 100),Math.floor(Math.random() * 100)]
    arrayName.map((item) => {
      fs.writeFile(`./FTP/$${item}.txt`, 'Learn Node FS module', function (err) {
      if (err) throw err;
      console.log('File is created successfully.');
    })
  }); 
  })
}


function listFolder (ftp, folderDir, type){
  return new Promise((resolve,reject) => {
    ftp.list(folderDir,(err,result) => {
      if(err) reject(err)
      let listFiles = []
      result.forEach((folder) => {
        if(folder.type === type){
          listFiles.push(folder.name)
        }
      })
      resolve(listFiles)
    })
  })
}

function put_FileFTP (ftp, content, destDir) {
  return new Promise ((resolve,reject) => {
    ftp.put(content, destDir, err => {
      if(err) reject(err)
      resolve()
    })
  })
}

function mkdir_Ftp (ftp, dir) {
  return new Promise ((resolve,reject) => {
    ftp.mkdir(dir, err => {
      if(err) reject(err)
      console.log('Có vào function mkdir')
      resolve()
    })
  })
}

function find_arrayIndex (array,stringCondition){
  return _.findIndex(array,(element) => {
    return element === stringCondition
  })
}

function analyze_Thoigian (thoigian) {
  let timeReceive = {}
  timeReceive.year = `${thoigian.substr(0,4)}`
  timeReceive.thang = `Thang${thoigian.substr(4,2)}`
  timeReceive.ngay = `${thoigian.substr(6,2)}${thoigian.substr(4,2)}${thoigian.substr(0,4)}`
  return timeReceive
}