import request from "request"
import Logger from "lib/logger"
import models from "models"
import { getValueSystem, deleteAccents } from "utils/functions"

class Sms {
  constructor() {}

  getSystemParams = () => {
    return models.System.findAll({ where: { idSystem: 1 }, attributes: ["name", "value"] })
  }

  handleIndicatorOverThreshold = async (station, recipient) => {
    const systemParams = await this.getSystemParams()

    station.name = deleteAccents(station.name)

    let smsInfo = {}

    smsInfo.smsServer = getValueSystem(systemParams, "smsServer")
    smsInfo.smsUsername = getValueSystem(systemParams, "smsUsername")
    smsInfo.smsPassword = getValueSystem(systemParams, "smsPassword")
    smsInfo.smsAlertThreshold = getValueSystem(systemParams, "smsAlertThreshold")

    smsInfo.smsAlertThreshold = smsInfo.smsAlertThreshold.split("$TENTRAM").join(station.name)
    smsInfo.message = smsInfo.smsAlertThreshold
    smsInfo.phoneNumber = recipient
    // this.sendSms(smsInfo, recipient)
  }

  handleStationDisconnect = async (station, recipient) => {
    const systemParams = await this.getSystemParams()

    station.name = deleteAccents(station.name)

    let smsInfo = {}

    smsInfo.smsServer = getValueSystem(systemParams, "smsServer")
    smsInfo.smsUsername = getValueSystem(systemParams, "smsUsername")
    smsInfo.smsPassword = getValueSystem(systemParams, "smsPassword")
    smsInfo.smsAlertDisconnection = getValueSystem(systemParams, "smsAlertDisconnection")

    smsInfo.smsAlertDisconnection = smsInfo.smsAlertDisconnection.split("$TENTRAM").join(station.name)
    smsInfo.message = smsInfo.smsAlertDisconnection
    smsInfo.phoneNumber = recipient
    // this.sendSms(smsInfo, recipient)
  }

  handleFtpFileStructureWrong = async (station, recipient) => {
    const systemParams = await this.getSystemParams()

    station.name = deleteAccents(station.name)

    let smsInfo = {}

    smsInfo.smsServer = getValueSystem(systemParams, "smsServer")
    smsInfo.smsUsername = getValueSystem(systemParams, "smsUsername")
    smsInfo.smsPassword = getValueSystem(systemParams, "smsPassword")
    smsInfo.smsAlertStructure = getValueSystem(systemParams, "smsAlertStructure")

    smsInfo.smsAlertStructure = smsInfo.smsAlertStructure.split("$TENTRAM").join(station.name)
    smsInfo.message = smsInfo.smsAlertStructure
    smsInfo.phoneNumber = recipient
    // this.sendSms(smsInfo, recipient)
  }

  sendSms = (smsInfo, recipient) => {
    // console.log('send sms')
    request(
      {
        method: "POST",
        url: smsInfo.smsServer,
        headers: {
          "Content-Type": "text/xml",
        },
        body: editXmlSms(smsInfo),
        json: false,
      },
      function (err, res, body) {
        if (err) {
          console.log(err)
        } else {
          var result = splitSmsResult(body)
          if(result.status === 'Success') console.log('Đã gửi tin nhắn thành công!')
        }
      }
    )
  }
}

function editXmlSms(smsInfo) {
  return `<?xml version="1.0" encoding="utf-8"?>
    <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
    <sendSMS xmlns="http://tempuri.org/">
    <userID>centic</userID>
    <password>oipd645xlcj7va5</password>
    <phoneNo>0968405800</phoneNo>
    <content>${smsInfo.message}</content>
    </sendSMS>
    </soap12:Body>
    </soap12:Envelope>`
}

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
export default Sms
