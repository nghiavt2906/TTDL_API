import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import { newId } from 'models/utils'
import app from 'app'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/quanlynguongchiso", router)


  router.get("/", async (req, res, next) => {
    try {
      const { monitoringType } = req.query
      let data = {}
      let monitoringTypeData = await app.MonitoringType.getMonitoringType()
      monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
      let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
      monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
      monitoringGroupData.unshift({ id: 'ALL', key: 'ALL', value: 'Tất cả' })
      let thresholdData = await app.IndicatorThreshold.getThresholdByMonitoringType(monitoringType)
      thresholdData = func.changeNestedField(thresholdData, 'Indicator', 'symbol', 'indicatorName', true)
      thresholdData = func.changeNestedField(thresholdData, 'MonitoringGroup', 'name', 'groupName', false)
      let indicatorData = await app.Indicator.getIndicatorByCondition({ monitoringType: monitoringType }, ['id', 'name', 'symbol'])
      indicatorData = func.changeToArrayFilter(indicatorData, 'id', 'symbol')

      data.monitoringType = monitoringTypeData
      data.monitoringGroup = monitoringGroupData
      data.thresholdInfo = thresholdData
      data.indicatorsName = indicatorData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })


  router.get("/getinfo", async (req, res, next) => {
    try {
      const { monitoringType } = req.query
      let data = {}
      let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
      monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
      let indicatorData = await app.Indicator.getIndicatorByType(monitoringType)
      indicatorData = func.changeToArrayFilter(indicatorData, 'id', 'name')

      data.monitoringGroup = monitoringGroupData
      data.indicatorData = indicatorData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/group", async (req, res, next) => {
    try {
      const { monitoringGroup } = req.query
      let data = {}

      let thresholdData = await app.IndicatorThreshold.getThresholdByMonitoringGroup(monitoringGroup)
      thresholdData = func.changeNestedField(thresholdData, 'Indicator', 'symbol', 'indicatorName', true)
      thresholdData = func.changeNestedField(thresholdData, 'MonitoringGroup', 'name', 'groupName', false)

      data.thresholdInfo = thresholdData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'delete_indicator_threshold')
      const { idThreshold } = req.query
      app.IndicatorThreshold.deleteThreshold(idThreshold).then(result => {
        res.sendStatus('200')
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_indicator_threshold')
      const { idThreshold, infoThreshold } = req.body
      app.IndicatorThreshold.updateThreshold(idThreshold, infoThreshold).then(result => {
        res.sendStatus('200')
      })
    } catch (error) {
      console.log(error)
      next(error)
    }

  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'insert_indicator_threshold')
      let id = newId()
      await app.IndicatorThreshold.createThreshold(id, req.body)
      res.send(id)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/:groupId", async (req, res, next) => {
    try {
      const { groupId } = req.params
      const result = await app.IndicatorThreshold.getIndicatorThresholdByGroupId(groupId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
