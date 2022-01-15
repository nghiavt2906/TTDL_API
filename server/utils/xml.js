const express = require('express')
const router = express.Router()
// const db = require('../Database/database')
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const parseString = require('xml2js').parseString
const chalk = require('chalk')
const moment = require('moment')
const _ = require('lodash')
import * as func from 'utils/functions'
// const db = require('../Database/queryDatabase')
// const mail = require('../Utils/sendEmail')
// const sms = require('../Utils/sendSms')
import models from 'models'
import {newId} from 'models/utils'

// var nodemailer =  require('nodemailer'); // khai báo sử dụng module nodemailer
// var xoauth2 =  require('xoauth2'); // khai báo sử dụng module nodemailer
// const {kiemtra_Dulieuden,testFile} = require('../Utils/ftp')


export const handleXmlData = async (stringXml) => {
  let idStation = ''
  let rawData = ''
  
  // parse string to xml
  // console.log(stringXml, typeof stringXml)

  // parse xml to object
  let xmlObject = func.converXmlToObject(stringXml,'kqd')
  console.log({xmlObject})
  if(xmlObject.dev === undefined || xmlObject.dev === null || xmlObject.id === undefined || xmlObject.id === null || xmlObject.time === undefined || xmlObject.time === null){
    return {statusCode : 400, message: 'WRONG FORMAT XML'}
  }
  //Tim so dien thoai tram gui len co trong database khong
  let phoneStation = xmlObject.id
  let stationAttributes = ['id']
  let stationCondition = {'phone' : phoneStation}
  let stationInfo = await models.Station.findStationInfoByCondition(stationCondition, stationAttributes)
  console.log({stationInfo})
  if(stationInfo.length === 0){
    // console.log('Khong co so dien thoai')
    return {statusCode : 400, message: 'PHONE NUMBER IS NOT DEFINED'}
  }
  console.log('=====> Here')
  idStation = stationInfo[0]['id']
  // console.log({idStation})
  let sentTime = func.convertToISODateFormat(xmlObject['time'])
  sentTime = moment(sentTime).format('YYYY-MM-DD HH:mm:ss')

  rawData = JSON.stringify(xmlObject)

  let checkData = await models.MonitoringDataInfo.findMonitoringDataInfo(idStation, rawData, sentTime)
  // console.log({checkData})
  if(checkData.length > 0){
    if(checkData[0].monitoringContent === JSON.stringify(xmlObject)){
      console.log('Du liệu đã tồn tại')
      return {statusCode : 400, message: 'DATA EXISTS'}
    } else {
      console.log('Update dữ liệu')
      updateDataInfo(xmlObject, checkData[0].id)
      return {statusCode : 200, message: 'DATA IS UPDATED'}
    }
    // console.log('Dữ liệu đã tồn tại')
    // console.log(checkData[0].id)
  } else {
    console.log('Thêm mới dữ liệu')
    insertDataInfo (xmlObject, idStation)
    return {statusCode : 200, message: 'SUCCESS'}
  }

}

async function updateDataInfo (xmlObject, id) {
  // return new Promise ((resolve, reject) => {
    let dataInfo = {}
    let dataIndicator = {}

    dataIndicator = func.eleminateElementFromObject(xmlObject, ['dev','id','time','pin','axis'])
    dataInfo.monitoringContent = JSON.stringify(xmlObject)
    dataInfo.battery = _.has(xmlObject,'pin') ? xmlObject['pin'] : null
    dataInfo.location = _.has(xmlObject,'axis') ? xmlObject['axis'] : null

    // console.log({dataIndicator})
    let updateInfo = await models.MonitoringDataInfo.updateMonitoringDataInfo(dataInfo, id)
    if(updateInfo.length > 0){
      let deleteData = await models.MonitoringData.deleteMonitoringData(id)
      // console.log({deleteData})
      if(deleteData > 0){
        let arrayIndicatorData = convertObjectToArrayData (dataIndicator, id)
        await models.MonitoringData.createMonitoringData(arrayIndicatorData)
      }
    }
    // models.MonitoringData.deleteMonitoringData(id).then((result) => {
    //   models.MonitoringDataInfo.updateMonitoringDataInfo(dataInfo, id)
    // })
  // })
}

async function insertDataInfo (xmlObject, id){
  let dataInfo = {}
  let dataIndicator = {}

  dataIndicator = func.eleminateElementFromObject(xmlObject, ['dev','id','time','pin','axis'])
  dataInfo.id = newId()
  dataInfo.stationId = id
  dataInfo.monitoringContent = JSON.stringify(xmlObject)
  dataInfo.battery = _.has(xmlObject,'pin') ? xmlObject['pin'] : null
  dataInfo.location = _.has(xmlObject,'axis') ? xmlObject['axis'] : null
  dataInfo.isFtpdata = 0

  let datetime = func.convertToISODateFormat(xmlObject['time'])
  dataInfo.sentAt = moment(datetime).format('YYYY-MM-DD HH:mm:ss')

  // dataIndicator = convertObjectToArrayData()
  let insertedInfo = await models.MonitoringDataInfo.createMonitoringDataInfo(dataInfo)
  // console.log({insertedInfo})
  if(insertedInfo.id !== undefined){
    let arrayIndicatorData = convertObjectToArrayData (dataIndicator, insertedInfo.id)
    await models.MonitoringData.createMonitoringData(arrayIndicatorData)
  }
}



function parseStringToXml (stringXml) {
  return new Promise((resolve, reject) => {
    parseString(stringXml, function (err, result) {
      if(err) reject(err)
      else resolve(result) 
    });
  })
}
function convertObjectToArrayData (objectData, idData){
  let arrayData = []
  for(var key in objectData){
    let element = {}
    let data = objectData[key].split(' ')
    if(data.length === 1){
      data.push('')
    }
    element.id = newId()
    element.idData = idData
    element.indicator = key.toUpperCase()
    element.value = data[0]
    element.unit = data[1]
    element.sensorStatus = '00'
    arrayData.push(element)
  }
  return arrayData
}