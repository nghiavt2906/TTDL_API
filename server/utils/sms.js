const request = require('request')
const bodyParser = require('body-parser')
const parseString = require('xml2js').parseString
// const db = require('../Database/queryDatabase')
import models from 'models'
import {getValueSystem, deleteAccents} from 'utils/functions'

var xmlString = `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
<soap12:Body>
<sendSMS xmlns="http://tempuri.org/">
<userID>centic</userID>
<password>oipd645xlcj7va5</password>
<phoneNo>84773498693</phoneNo>
<content>Thong bao kiem tra he thong tin nhan</content>
</sendSMS>
</soap12:Body>
</soap12:Envelope>`


/*
* Description: Hàm này để trả về string XML để nhắn tin 
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} gatewayResult : string XML from gateway after sending SMS 
*
* return {object} Kết quả gửi SMS
*/
function splitSmsResult (gatewayResult)  {
  let smsResult = {}
  smsResult.index = gatewayResult.substring(
    gatewayResult.lastIndexOf("<result>") + 8, 
    gatewayResult.lastIndexOf("</result>")
  )
  smsResult.status = gatewayResult.substring(
    gatewayResult.lastIndexOf("<message>") + 9, 
    gatewayResult.lastIndexOf("</message>")
  )
  return smsResult
}

function editXmlSms (smsInfo) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
    <sendSMS xmlns="http://tempuri.org/">
    <userID>centic</userID>
    <password>oipd645xlcj7va5</password>
    <phoneNo>${smsInfo.phoneNumber}</phoneNo>
    <content>${smsInfo.message}</content>
    </sendSMS>
    </soap12:Body>
    </soap12:Envelope>`
}

function sendSms(smsInfo){
  request(
    {
      method: 'POST',
      uri: smsInfo.smsServer,
      headers: {
        'Content-Type' : 'text/xml'
      },
      body: editXmlSms(smsInfo),
      json: false
    },
    function (err, res, body){
      if(err) {
        console.log(err)
      } else {
        var result = splitSmsResult(body)
        if(result.status === 'Success') console.log('Đã gửi tin nhắn thành công!')
      }
    }
  )
}

export const sendSmsWrongStructure = async (smsData) => {
  let smsAtributes = ['smsAlertThreshold', 'smsAlertStructure', 'smsAlertDisconnection', 'smsAlertBattery', 'smsServer', 'smsUsername', 'smsPassword', 'alertSmsStatus']
  let smsParams = await models.System.findSystemInfo('1', smsAtributes)
  let smsInfo = {} 

  smsData.name = deleteAccents(smsData.name)
  smsData.phoneNumber = '84773498693'

  smsInfo.smsServer = getValueSystem(smsParams, 'smsServer')
  smsInfo.smsUsername = getValueSystem(smsParams, 'smsUsername')
  smsInfo.smsPassword = getValueSystem(smsParams, 'smsPassword')
  smsInfo.smsAlertStructure = getValueSystem(smsParams, 'smsAlertStructure')

  smsInfo.smsAlertStructure = smsInfo.smsAlertStructure.split('$TENTRAM').join(smsData.name)
  smsInfo.message = smsInfo.smsAlertStructure
  smsInfo.phoneNumber = smsData.phoneNumber

  sendSms(smsInfo)
}

export const sendSmsDisconnection = async smsData => {
  let smsAtributes = ['smsAlertThreshold', 'smsAlertStructure', 'smsAlertDisconnection', 'smsAlertBattery', 'smsServer', 'smsUsername', 'smsPassword', 'alertSmsStatus']
  let smsParams = await models.System.findSystemInfo('1', smsAtributes)
  let smsInfo = {} 

  smsData.name = deleteAccents(smsData.name)
  smsData.phoneNumber = '84773498693'

  smsInfo.smsServer = getValueSystem(smsParams, 'smsServer')
  smsInfo.smsUsername = getValueSystem(smsParams, 'smsUsername')
  smsInfo.smsPassword = getValueSystem(smsParams, 'smsPassword')
  smsInfo.smsAlertDisconnection = getValueSystem(smsParams, 'smsAlertDisconnection')

  smsInfo.smsAlertDisconnection = smsInfo.smsAlertDisconnection.split('$TENTRAM').join(smsData.name)
  smsInfo.message = smsInfo.smsAlertDisconnection
  smsInfo.phoneNumber = smsData.phoneNumber

  sendSms(smsInfo)
}

export const sendSmsThreshold = async (smsData, sensors , sentTime) => {
  let smsAtributes = ['smsAlertThreshold', 'smsAlertStructure', 'smsAlertDisconnection', 'smsAlertBattery', 'smsServer', 'smsUsername', 'smsPassword', 'alertSmsStatus']
  let smsParams = await models.System.findSystemInfo('1', smsAtributes)
  let smsInfo = {} 

  smsData.name = deleteAccents(smsData.name)
  smsData.phoneNumber = '84773498693'

  smsInfo.smsServer = getValueSystem(smsParams, 'smsServer')
  smsInfo.smsUsername = getValueSystem(smsParams, 'smsUsername')
  smsInfo.smsPassword = getValueSystem(smsParams, 'smsPassword')
  smsInfo.smsAlertThreshold = getValueSystem(smsParams, 'smsAlertThreshold')

  smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split('$TENTRAM').join(smsData.name)
  smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split('$SENSORS').join(sensors)
  // smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split('$NGUONGDUOI').join(indicatorThreshold.lowerThreshold)
  // smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split('$NGUONGTREN').join(indicatorThreshold.upperThreshold)
  // smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split('$DONVI').join(monitoringValues.unit)

  smsInfo.message = smsInfo.smsAlertThreshold
  smsInfo.phoneNumber = smsData.phoneNumber

  sendSms(smsInfo)
}

// module.exports = {
//   sendSmsWrongStructure : (smsData) => {


//     let querySmsSaiCautruc = db.get_smsSaiCautruc()
//     smsData.tenTram = func.deleteAccents(smsData.tenTram)
//     smsData.phoneNumber = '84773498693'
//     querySmsSaiCautruc.then((result) => {
//       let smsInfo = result[0][0]
//       console.log({smsData})
//       smsInfo.sms_khongdungcautruc = smsInfo.sms_khongdungcautruc.split('$TENTRAM').join(smsData.tenTram)
//       smsInfo.message = smsInfo.sms_khongdungcautruc
//       smsInfo.phoneNumber = smsData.phoneNumber
//       sendSms(smsInfo)
//     })
//   },
//   sendSmsDisconnection : (smsData) => {
//     let querySmsKhongtruyenDulieu = db.get_smskhongtruyendulieu()
//     smsData.tenTram = func.deleteAccents(smsData.tenTram)
//     smsData.phoneNumber = '84773498693'
//     querySmsKhongtruyenDulieu.then((result) => {
//       let smsInfo = result[0][0]
//       console.log({smsData})
//       smsInfo.sms_khongtruyendulieu = smsInfo.sms_khongtruyendulieu.split('$TENTRAM').join(smsData.tenTram)
//       smsInfo.message = smsInfo.sms_khongtruyendulieu
//       smsInfo.phoneNumber = smsData.phoneNumber
//       sendSms(smsInfo)
//     })
//   },
//   sendSmsThreshold : (smsData,giatriQuantrac,nguongChiso) => {
//     let querySmsVuotnguong = db.get_smsVuotnguong()
//     smsData.tenTram = func.deleteAccents(smsData.tenTram)
//     smsData.phoneNumber = '84773498693'
//     querySmsVuotnguong.then((result) => {
//       let smsInfo = result[0][0]
//       console.log({smsData})
//       smsInfo.sms_vuotnguong = smsInfo.sms_vuotnguong.split('$TENTRAM').join(smsData.tenTram)
//       smsInfo.sms_vuotnguong = smsInfo.sms_vuotnguong.split('$CHISO').join(giatriQuantrac.tenchiso)
//       smsInfo.sms_vuotnguong = smsInfo.sms_vuotnguong.split('$NGUONGDUOI').join(nguongChiso.chiso_duoi)
//       smsInfo.sms_vuotnguong = smsInfo.sms_vuotnguong.split('$NGUONGTREN').join(nguongChiso.chiso_tren)
//       smsInfo.sms_vuotnguong = smsInfo.sms_vuotnguong.split('$DONVI').join(giatriQuantrac.donvi)
//       smsInfo.message = smsInfo.sms_vuotnguong
//       smsInfo.phoneNumber = smsData.phoneNumber
//       sendSms(smsInfo)
//     })
//   },
//   sendSms : (smsInfo) => {
//     request(
//       {
//         method: 'POST',
//         uri: 'http://49.156.52.24:5993/SmsService.asmx',
//         headers: {
//           'Content-Type' : 'text/xml'
//         },
//         body: editXmlSms(smsInfo),
//         json: false
//       },
//       function (err, res, body){
//         if(err) {
//           console.log(err)
//         } else {
//           var result = splitSmsResult(body)
//           if(result.status === 'Success') console.log('Đã gửi tin nhắn thành công!')
//         }
//       }
//     )
//   },
//   // sendSmsVuotnguong ()
// }