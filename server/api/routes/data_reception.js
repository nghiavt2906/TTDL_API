import { Router } from "express"
import models from "models"
import * as func from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import xmlparser from "express-xml-bodyparser"
import { newId } from "models/utils"
import { checkFtpFolder } from "utils/ftp_nhap"
import { testFTP } from "utils/ftp_v2"
import { handleXmlData } from "utils/xml"
import { handleJsonData } from 'utils/json'
import {
  getManagerRoutes,
  reformatLatestData,
  getStationIndicators,
} from "app/utils"
import app from "app"
import config from "configs"
import { testXacxuat } from "app/utils"
import moment from "moment"
import FFmpeg from "lib/ffmpeg"
import Client from "ftp"
import Basic from "lib/basic"
import CameraService from "services/camera"
import http from "http"
import fs from "fs"
import configs from "configs"
import HttpStatus from "http-status-codes"
import ApiTypes from 'constant/api_type'

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
// router.use(bodyParser.raw({ inflate: true, limit: '100kb', type: 'text/xml' }));
router.use(xmlparser())

export default (expressRouter) => {
  expressRouter.use("/tiepnhandulieu", router)

  router.get("/", async (req, res, next) => {
    let result = await app.ServiceCall.callFtpService()
    // console.log('===>', result)
    res.send("ok")
  })

  router.get("/testRoute", async (req, res, next) => {
    const config = {
      // host: "192.168.1.29",
      // host: "10.17.19.8",
      host: "49.156.54.202",
      user: "centic_test",
      password: "123345567789",
      port: 21,
    }

    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        const path = "/BackupArriveFiles/NNCOCACOLAG1/2020_03_18"
        ftp.rmdir(path, [true], (err) => {
          if (err) {
            console.log(`Delete ${path} error`, err)
          }
          console.log("Delete file ftp success", path)
        })
      } catch (err) {
        console.log(chalk.red(err))
        throw err
      }
    })
    ftp.connect(config)
  })

  router.get("/syncFtp", async (req, res, next) => {
    app.FtpSyncData.testFtpServer()
    res.send("ok")
  })

  router.get("/test1", async (req, res, next) => {
    // let data = await app.MonitoringDataInfo.searchDataGeneral('0SyZXkuztHo42wLwBKNu', '2017-12-15 00:30:00', '2020-12-15 00:30:00' )
    app.EnviromentIndex.calculateWqiStation()
    res.sendStatus(200)
  })

  router.get("/testAuto", async (req, res, next) => {
    // checkFtpFolder()
    try {
      await app.Character.syncCharacterRoute()
      // const result = await app.ManagerStation.addNewStationManager('5t6BZYGA4LWgkladcoU5', 'FsXDerg1pEsZnsHQhDlT')
      // const receiverList = await app.Email.getReceiverByPermission(
      //   "get_system_error_alert"
      // )
      // let emailStatus = await app.System.findSystemInfo("1", [
      //   "emailAlertStatus",
      // ])
      // emailStatus = emailStatus[0].value
      // if (receiverList !== null && emailStatus === "1") {
      //   app.Email.sendMail({
      //     subject: "Mất connect đến server FTP",
      //     content: `<p>Kính gửi: anh/chị phụ trách theo dõi hệ thống Quan trắc môi trường Đà Nẵng</p>\
      //                </br>\
      //                <p>Hiện tại, Server App (IP: ${configs.server.host}) mất kết nối đến Server FTP (IP: ${configs.ftpServer.host}). Xin anh/chị hãy kiểm tra hệ thống!</p>\
      //                </br>\
      //                <p>Trân trọng,</p>\
      //                <p>Trung tâm Quan trắc môi trường Đà Nẵng.</p>`,
      //     receiver: receiverList,
      //   })
      // }
      // const result = await app.Character.getNewCharacterInfo()
      // await app.Character.syncCharacterPermission()
      // const receiverList = await app.Email.getReceiverByPermission("get_system_error_alert")
      // if(receiverList !== null){
      //   await app.Email.sendMail({
      //     subject: "Mất connect đến server FTP",
      //     content: `<p>Kính gửi: Anh/chị phụ trách theo dõi hệ thống Quan trắc môi trường Đà Nẵng</p>\
      //               </br>\
      //               <p>Hiện nay, hệ thống Server App đang mất kết nối hệ thống với hệt thống Camera.\
      //               Kính mong anh/chị kiểm tra lại hệ thống</p>\
      //               </br>\
      //               <p>Trân trọng,</p>
      //               <p>Trung tâm Quan trắc môi trường Đà Nẵng.</p>`,
      //     receiver: receiverList,
      //   })
      // }
      // const result = await app.Character.getCharacterListByPermission(
      //   "get_system_error_alert"
      // )
      // const idList = result.map((item) => item.id)
      // const managerList = await app.Manager.getManagerByCharacterId(idList)
      // // const managerList = await app.Manager.getManagerByPermission('get_system_error_alert')
      // if(managerList.length > 0){
      //   let emailList = ''
      //   for(let item of managerList){
      //     emailList = item.email + '; ' + emailList
      //   }
      //   console.log({emailList})
      //   await app.Email.sendMail({
      //     subject: "Mất connect đến server FTP",
      //     content: `Test email`,
      //     receiver: emailList,
      //   })
      // }
      // console.log(managerList)
      res.send(result)
    } catch (error) {
      console.log(error)
      throw error
    }
  })

  router.get("/testToken", async (req, res, next) => {
    // checkFtpFolder()
    try {
      await app.Firebase.sendMessage(
        [
          "diInolflRbq0HSRlDqm2s7:APA91bHDZVIqleK3R5vja91Hy2Q1vsRSlTiU0np2fhr0PtKcB9Muedzvm46jZaYKbVA_Aq1FiVWMYBvOBCAQoGCNNHbGFHdxvko2FCkdcPjSPGwq4rkl8UjwCE2aL4qBqgjIks8wFHDC",
        ],
        "Trạm Hồ Bầu tràm vượt ngưỡng quan trắc thời thời điểm 12/12/2020 12:12:12"
      )
      res.send("OK")
    } catch (error) {
      console.log(error)
    }
  })

  router.put("/", async (req, res, next) => {
    const { idIndicator, infoIndicator } = req.body
    // console.log({idIndicator,infoIndicator})
    models.Indicator.updateIndicator(idIndicator, infoIndicator).then(
      (result) => {
        res.sendStatus("200")
      }
    )
  })

  router.post("/", async (req, res, next) => {
    console.log(req.body)
    const { apiKey } = req.body

    try {
      const apiKeyInDb = await app.ApiKey.validateApiSecretKey(apiKey, ApiTypes.DATA_RECEPTION)
      if (apiKeyInDb.dataValues.receivedStationId !== req.body.idStation)
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.api_key.invalid_station_id",
          messages: "Id của trạm không hợp lệ!",
        }
    } catch (error) {
      console.log(error)
      return next(error)
    }

    let result = req.query.format === 'json' ? await handleJsonData(req.body) : await handleXmlData(req.body)
    res.status(result.statusCode).send(result.message)
  })

  router.get("/test_disconnection", async (req, res, next) => {
    // console.log(req.body)
    // let result = await app.ManagerStation.getManagerByStationId('owyiJTM1Nb9aCt9brV4T')
    // await app.FtpSyncData.checkDisconnection("28VQdb8xD6qDgYtRTQB5")
    const managerId = "3mAJCbLmGIgY3h1D5l0l"
    const startAt = moment().subtract(30, "d").utc().format()
    const endAt = moment().utc().format()
    await app.ManagerNotifications.updateSeenNotification(
      managerId,
      startAt,
      endAt
    )
    res.send("ok")
  })

  router.get("/test_overthreshold", async (req, res, next) => {
    const data = [
      {
        id: "LLkKsjfwiBCxOh13RNyz",
        indicator: "pH",
        value: "7.36",
        unit: "",
        sensorStatus: "00",
      },
      {
        id: "NgI9HN3X1AQEYtdd714Q",
        indicator: "COD",
        value: "295.89",
        unit: "mg/L",
        sensorStatus: "00",
      },
      {
        id: "RdTSD71XL92xAvK8UgNl",
        indicator: "TSS",
        value: "29.22",
        unit: "mg/L",
        sensorStatus: "01",
      },
      {
        id: "oLkAWM0swzYd9Yb2zcQH",
        indicator: "Temp",
        value: "29.50",
        unit: "oC",
        sensorStatus: "01",
      },
      {
        id: "6gfb7m0L6YrtlDKjNjZr",
        indicator: "Flow",
        value: "9.75",
        unit: "m3/h",
        sensorStatus: "01",
      },
      {
        id: "XehBx6rlTTvdfOzr7bsZ",
        indicator: "FLOW_DAUVA@B-B�W�@\x02m3/h",
        value: "43.31",
        unit: "m3/h",
        sensorStatus: "01",
      },
    ]
    // console.log(req.body)
    // let result = await app.ManagerStation.getManagerByStationId('owyiJTM1Nb9aCt9brV4T')
    await app.FtpSyncData.checkOverThreshold("TQyrEfK0emPKskdgIxDT", data, new Date())
    res.send("ok")
  })

  router.get("/test_wrongstructure", async (req, res, next) => {
    // console.log(req.body)
    // let result = await app.ManagerStation.getManagerByStationId('owyiJTM1Nb9aCt9brV4T')
    // 28VQdb8xD6qDgYtRTQB5 Mssql
    // 0TuGDJ87N1rSLKnwJeY6 Mysql
    await app.FtpSyncData.checkWrongStructure(
      "28VQdb8xD6qDgYtRTQB5",
      "LTC_NOC_1029019201(1)"
    )
    res.send("ok")
  })

  router.get("/syncData", async (req, res, next) => {
    await models.sequelize
      .sync({ force: true })
      .then(() => console.log(`--------- sync models to database ok --------`))
      .catch((err) => console.log(err))
    res.sendStatus(OK)
  })
}
