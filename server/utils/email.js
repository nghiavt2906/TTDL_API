var nodemailer =  require('nodemailer'); // khai báo sử dụng module nodemailer
import {convertTimeToISOFormat} from 'utils/functions'
// const db = require('../Database/queryDatabase')
import models from 'models'
import {getValueSystem} from 'utils/functions'

function sendWarningEmail (mailInfo) {
  var transporter =  nodemailer.createTransport({ // config mail server
    service: "gmail",
    auth: {
        type: 'OAuth2',
        user: mailInfo.mailServer,
        clientId: mailInfo.mailClientId,
        clientSecret: mailInfo.mailClientSecret,
        refreshToken: mailInfo.mailRefreshToken,
        accessToken: mailInfo.mailAccessToken
    }
  });
  var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
      from: `${mailInfo.mailServername} <${mailInfo.mailServer}>`,
      to: 'huutinece2502@gmail.com; tindh@centic.vn',
      subject: mailInfo.title,
      html: mailInfo.content
  }
  transporter.sendMail(mainOptions, function(err, info){
      if (err) {
          console.log(err);
      } else {
          console.log('Message sent: ' +  info.response);
          // res.send("Send Email Success")
      }
  });
}

module.exports = {
  sendThresholdMail : async (mailData, sensors , sentTime) => {
    let mailAtributes = ['emailAlertBattery', 'emailAlertDisconnection', 'emailAlertStucture', 'emailAlertThreshold', 'titleEmailAlertBattery', 'titleEmailAlertDisconnection', 'titleEmailAlertStructure', 'titleEmailAlertThreshold', 'mailAccessToken', 'mailClientId', 'mailClientSecret', 'mailPassword', 'mailRefreshToken', 'mailServer', 'mailServername', 'alertEmailStatus']
    let mailParams = await models.System.findSystemInfo('1', mailAtributes)

    let mailInfo = {} 

    mailInfo.title = getValueSystem(mailParams, 'titleEmailAlertThreshold')
    mailInfo.mailServer = getValueSystem(mailParams, 'mailServer')
    mailInfo.mailServername = getValueSystem(mailParams, 'mailServername')
    mailInfo.mailPassword = getValueSystem(mailParams, 'mailPassword')
    mailInfo.mailClientSecret = getValueSystem(mailParams, 'mailClientSecret')
    mailInfo.mailClientId = getValueSystem(mailParams, 'mailClientId')
    mailInfo.mailRefreshToken = getValueSystem(mailParams, 'mailRefreshToken')
    mailInfo.mailAccessToken = getValueSystem(mailParams, 'mailAccessToken')
    mailInfo.emailAlertThreshold = getValueSystem(mailParams, 'emailAlertThreshold')

    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$TENTRAM').join(mailData.name)
    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$TRUNGTAM').join(mailInfo.mailServername)
    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$KYHIEUTRAM').join(mailData.symbol)
    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$NHOMQUANTRAC').join(mailData.monitoringType)
    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$SENSORS').join(sensors)
    // mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$KETQUA').join(monitoringValues.value)
    // mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$DONVI').join(monitoringValues.unit)
    // mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$NGUONGDUOI').join(indicatorThreshold.lowerThreshold)
    // mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$NGUONGTREN').join(indicatorThreshold.upperThreshold)
    mailInfo.emailAlertThreshold = mailInfo.emailAlertThreshold.split('$THOIGIANDO').join(sentTime)
    mailInfo.content = mailInfo.emailAlertThreshold

    
    sendWarningEmail(mailInfo)
  },
  sendStructureMail : async (mailData) => {
    let mailAtributes = ['emailAlertBattery', 'emailAlertDisconnection', 'emailAlertStructure', 'emailAlertThreshold', 'titleEmailAlertBattery', 'titleEmailAlertDisconnection', 'titleEmailAlertStructure', 'titleEmailAlertThreshold', 'mailAccessToken', 'mailClientId', 'mailClientSecret', 'mailPassword', 'mailRefreshToken', 'mailServer', 'mailServername', 'alertEmailStatus']
    let mailParams = await models.System.findSystemInfo('1', mailAtributes)

    let mailInfo = {} 

    mailInfo.title = getValueSystem(mailParams, 'titleEmailAlertStructure')
    mailInfo.mailServer = getValueSystem(mailParams, 'mailServer')
    mailInfo.mailServername = getValueSystem(mailParams, 'mailServername')
    mailInfo.mailPassword = getValueSystem(mailParams, 'mailPassword')
    mailInfo.mailClientSecret = getValueSystem(mailParams, 'mailClientSecret')
    mailInfo.mailClientId = getValueSystem(mailParams, 'mailClientId')
    mailInfo.mailRefreshToken = getValueSystem(mailParams, 'mailRefreshToken')
    mailInfo.mailAccessToken = getValueSystem(mailParams, 'mailAccessToken')
    mailInfo.emailAlertStructure = getValueSystem(mailParams, 'emailAlertStructure')

    mailInfo.emailAlertStructure = mailInfo.emailAlertStructure.split('$TENTRAM').join(mailData.name)
    mailInfo.emailAlertStructure = mailInfo.emailAlertStructure.split('$TRUNGTAM').join(mailInfo.mailServername)
    mailInfo.emailAlertStructure = mailInfo.emailAlertStructure.split('$KYHIEUTRAM').join(mailData.symbol)
    mailInfo.emailAlertStructure = mailInfo.emailAlertStructure.split('$NHOMQUANTRAC').join(mailData.monitoringGroup)
    mailInfo.content = mailInfo.emailAlertStructure

    // console.log({mailInfo})
    sendWarningEmail(mailInfo)
  },
  sendDisconnectionMail : async (mailData) => {
    let mailAtributes = ['emailAlertBattery', 'emailAlertDisconnection', 'emailAlertStucture', 'emailAlertThreshold', 'titleEmailAlertBattery', 'titleEmailAlertDisconnection', 'titleEmailAlertStructure', 'titleEmailAlertThreshold', 'mailAccessToken', 'mailClientId', 'mailClientSecret', 'mailPassword', 'mailRefreshToken', 'mailServer', 'mailServername', 'alertEmailStatus']
    let mailParams = await models.System.findSystemInfo('1', mailAtributes)

    let mailInfo = {} 

    mailInfo.title = getValueSystem(mailParams, 'titleEmailAlertDisconnection')
    mailInfo.mailServer = getValueSystem(mailParams, 'mailServer')
    mailInfo.mailServername = getValueSystem(mailParams, 'mailServername')
    mailInfo.mailPassword = getValueSystem(mailParams, 'mailPassword')
    mailInfo.mailClientSecret = getValueSystem(mailParams, 'mailClientSecret')
    mailInfo.mailClientId = getValueSystem(mailParams, 'mailClientId')
    mailInfo.mailRefreshToken = getValueSystem(mailParams, 'mailRefreshToken')
    mailInfo.mailAccessToken = getValueSystem(mailParams, 'mailAccessToken')
    mailInfo.emailAlertDisconnection = getValueSystem(mailParams, 'emailAlertDisconnection')

    mailInfo.emailAlertDisconnection = mailInfo.emailAlertDisconnection.split('$TENTRAM').join(mailData.name)
    mailInfo.emailAlertDisconnection = mailInfo.emailAlertDisconnection.split('$TRUNGTAM').join(mailInfo.mailServername)
    mailInfo.emailAlertDisconnection = mailInfo.emailAlertDisconnection.split('$KYHIEUTRAM').join(mailData.symbol)
    mailInfo.emailAlertDisconnection = mailInfo.emailAlertDisconnection.split('$NHOMQUANTRAC').join(mailData.monitoringGroup)
    mailInfo.content = mailInfo.emailAlertDisconnection

    sendWarningEmail(mailInfo)    
  }

}