import { Router } from "express"
import models from "models"
import * as func from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import { newId } from "models/utils"
import app from "app"
import { reformatSystemInfo } from "app/utils"

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/thongsohethong", router)

  router.get("/", async (req, res, next) => {
    const systemFields = [
      "smsServer",
      "smsUsername",
      "smsPassword",
      "alertSmsStatus",
      "mailServer",
      "mailPassword",
      "mailServername",
      "emailAlertStatus",
      "safetyThresholdColor",
      "warningThresholdColor",
      "unknownThresholdColor",
      "brokenDeviceColor",
      "dirReceiveFtp",
      "dirSaveFtp",
      "dirWrongFtp",
    ]

    let systemInfo = await app.System.findSystemInfo("1", systemFields)
    systemInfo = reformatSystemInfo(systemInfo)
    systemInfo.alertSmsStatus = systemInfo.alertSmsStatus === "0" ? false : true
    systemInfo.emailAlertStatus =
      systemInfo.emailAlertStatus === "0" ? false : true

    for (const key of systemFields)
      systemInfo[key] = systemInfo[key] === undefined ? '' : systemInfo[key]

    res.send(systemInfo)
  })

  router.put("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_system_config")

      let {
        smsServer,
        smsUsername,
        smsPassword,
        alertSmsStatus,
        mailServer,
        mailPassword,
        mailServername,
        emailAlertStatus,
        safetyThresholdColor,
        warningThresholdColor,
        unknownThresholdColor,
        brokenDeviceColor,
        dirReceiveFtp,
        dirSaveFtp,
        dirWrongFtp,
      } = req.body
      let updateInfo = {
        smsServer,
        smsUsername,
        smsPassword,
        alertSmsStatus: func.changeBoleanToTinyInt(alertSmsStatus),
        mailServer,
        mailPassword,
        mailServername,
        alertEmailStatus: func.changeBoleanToTinyInt(emailAlertStatus),
        safetyThresholdColor,
        warningThresholdColor,
        unknownThresholdColor,
        brokenDeviceColor,
        dirReceiveFtp,
        dirSaveFtp,
        dirWrongFtp,
      }
      await Promise.all(
        Object.keys(updateInfo).map(async (key, index) => {
          await app.System.updateSystem(key, updateInfo[key])
        })
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getinfo", async (rep, res, next) => {
    let systemData = await app.System.findSystemInfo("1", [
      "smsAlertThreshold",
      "emailAlertStructure",
    ])
    // console.log(systemData)
    res.send(systemData)
  })

  router.put("/emailsms/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_system_config")

      // console.log(req.body)
      let {
        smsServer,
        smsUsername,
        smsPassword,
        alertSmsStatus,
        mailAccessToken,
        mailClientId,
        mailClientSecret,
        mailPassword,
        mailRefreshToken,
        mailServer,
        mailServername,
        alertEmailStatus,
      } = req.body
      let updateInfo = {
        smsServer,
        smsUsername,
        smsPassword,
        alertSmsStatus: func.changeBoleanToTinyInt(alertSmsStatus),
        mailAccessToken,
        mailClientId,
        mailClientSecret,
        mailPassword,
        mailRefreshToken,
        mailServer,
        mailServername,
        alertEmailStatus: func.changeBoleanToTinyInt(alertEmailStatus),
      }
      await Promise.all(
        Object.keys(updateInfo).map(async (key, index) => {
          await app.System.updateSystem(key, updateInfo[key])
        })
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/ftp/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_system_config")

      // console.log(req.body)
      let {
        ftpserverStnmt,
        ftpusernameStnmt,
        ftpportStnmt,
        ftppasswordStnmt,
        ftpserverBtnmt,
        ftppasswordBtnmt,
        ftpusernameBtnmt,
        ftpportBtnmt,
        dirReceiveFtp,
        dirSaveFtp,
        dirWrongFtp,
      } = req.body
      let updateInfo = {
        ftpserverStnmt,
        ftpusernameStnmt,
        ftpportStnmt,
        ftppasswordStnmt,
        ftpserverBtnmt,
        ftppasswordBtnmt,
        ftpusernameBtnmt,
        ftpportBtnmt,
        dirReceiveFtp,
        dirSaveFtp,
        dirWrongFtp,
      }
      await Promise.all(
        Object.keys(updateInfo).map(async (key, index) => {
          await app.System.updateSystem(key, updateInfo[key])
        })
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/general/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_system_config")

      // console.log(req.body)
      let {
        upperThresholdColor,
        warningThresholdColor,
        lowerThresholdColor,
        safetyThresholdColor,
        numberOfAlertEmail,
        numberOfAlertSms,
        paramDisconnectionFirstlevel,
        paramDisconnectionSecondlevel,
        paramThresholdFirstlevel,
        paramThresholdSecondlevel,
      } = req.body
      let updateInfo = {
        upperThresholdColor,
        warningThresholdColor,
        lowerThresholdColor,
        safetyThresholdColor,
        numberOfAlertEmail,
        numberOfAlertSms,
        paramDisconnectionFirstlevel,
        paramDisconnectionSecondlevel,
        paramThresholdFirstlevel,
        paramThresholdSecondlevel,
      }
      await Promise.all(
        Object.keys(updateInfo).map(async (key, index) => {
          await app.System.updateSystem(key, updateInfo[key])
        })
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
