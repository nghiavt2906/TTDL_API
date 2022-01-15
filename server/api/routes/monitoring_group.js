import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import {newId} from 'models/utils'
import app from 'app'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/quanlynhomquantrac", router)


  router.get("/", async (req, res, next) => {
    const {monitoringType} = req.query 
    let data = {}
    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupInfo(monitoringType)

    data.monitoringType = monitoringTypeData
    data.monitoringGroupInfo = monitoringGroupData
    res.send(data)
  })

  router.delete("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'delete_monitoring_group')
      const {idMonitoringGroup} = req.query 
      app.MonitoringGroup.deleteMonitoringGroup(idMonitoringGroup).then(result => {
        res.sendStatus('200')
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
    

  })

  router.put("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_monitoring_group')
      const {idMonitoringGroup,infoMonitoringGroup} = req.body 
      // console.log({idMonitoringGroup,infoMonitoringGroup})
      app.MonitoringGroup.updateMonitoringGroup(idMonitoringGroup, infoMonitoringGroup).then(result => {
        res.sendStatus('200')
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
    
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'insert_monitoring_group')
      let id = newId()
      await app.MonitoringGroup.createMonitoringGroup(id, req.body)
      res.send(id)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
