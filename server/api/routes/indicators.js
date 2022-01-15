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
  expressRouter.use("/quanlychiso", router)


  router.get("/", async (req, res, next) => {
    try {
      const {monitoringType} = req.query 
      let data = {}
      let monitoringTypeData = await app.MonitoringType.getMonitoringType()
      monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
      let indicatorData = await app.Indicator.getIndicatorInfo(monitoringType)

      data.monitoringType = monitoringTypeData
      data.indicatorInfo = indicatorData
      res.send(data)
    }catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'delete_indicator')
      const {idIndicator} = req.query 
      app.Indicator.deleteIndicator(idIndicator).then(result => {
        res.sendStatus('200')
      })
    }catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_indicator')
      const {idIndicator,infoIndicator} = req.body 
      // console.log({idIndicator,infoIndicator})
      app.Indicator.updateIndicator(idIndicator, infoIndicator).then(result => {
        res.sendStatus('200')
      })
    }catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'insert_indicator')
      let id = newId()
      // console.log(id, req.body)
      await app.Indicator.createIndicator(id, req.body)
      res.send(id)
    }catch (error) {
      console.log(error)
      next(error)
    }
  })
}
