import { Router } from "express"
import _ from "lodash"
import app from "app"
import bodyParser from "body-parser"
import moment from "moment"
import { convertMonitoringData } from "app/utils"
import {fakeData} from 'utils/fake_data'

const router = Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/dulieu", router)

  router.post("/search", async (req, res, next) => {
    try {
      let data = {}
      // console.log(startAt, endAt)
      let { stationId, startAt, endAt } = req.body
      startAt = moment.utc(startAt).tz("Asia/Ho_Chi_Minh").format()
      endAt = moment.utc(endAt).tz("Asia/Ho_Chi_Minh").format()
      // console.log(startAt, endAt)
      let monitoringData = await app.MonitoringDataInfo.searchSpecificData(
        stationId,
        startAt,
        endAt
      )
      monitoringData = convertMonitoringData(monitoringData)
      // console.log(monitoringData[0])
      // const stationIndicator = await app.StationIndicators.getStationIndicators(stationId)
      data.monitoringData = monitoringData
      // data.stationIndicator = stationIndicator
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:managerId/:dataId", async (req, res, next) => {
    try {
      const { managerId, dataId } = req.params
      await app.Manager.checkManagerPermission(managerId, "upload_data")

      const data = req.body
      await app.MonitoringDataInfo.updateData(dataId, data)
      // const timeNow = moment().utc(7).format()
      // await app.ActivityLog.createActivityLog(managerId, 'UPDATE', 'DATA', timeNow, dataId)
      let newData = await app.MonitoringDataInfo.searchSpecificDataById(dataId)
      newData = convertMonitoringData(newData)
      res.send(newData)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:managerId/:dataId", async (req, res, next) => {
    try {
      const { managerId, dataId } = req.params
      await app.Manager.checkManagerPermission(managerId, "upload_data")

      await app.MonitoringDataInfo.deleteData(dataId)
      const timeNow = moment().utc(7).format()
      await app.ActivityLog.createActivityLog(
        managerId,
        "DELETE",
        "DATA",
        timeNow,
        dataId
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "upload_data")

      const data = req.body
      // console.log({data})
      const result = await app.MonitoringDataInfo.createOneData(data)
      const timeNow = moment().utc(7).format()
      await app.ActivityLog.createActivityLog(
        managerId,
        "CREATE",
        "DATA",
        timeNow,
        result.id
      )
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/approveData/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_data")

      const { dataId } = req.body
      await app.MonitoringDataInfo.approveData(dataId)
      await app.ActivityLog.logAporoveData(managerId, dataId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/cancelApproveData/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_data")

      const { dataId } = req.body
      await app.MonitoringDataInfo.cancelApproveData(dataId)
      await app.ActivityLog.logCancelAporoveData(managerId, dataId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/fakeData/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_data')
      
      const {stationId, startAt} = req.query
      const result = await fakeData(stationId, startAt)
      res.json(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
