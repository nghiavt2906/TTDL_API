import fs from "fs"
import { Router } from "express"
import { isIP, isNumeric, isEmpty } from "validator"
import _ from "lodash"
import models from "models"
import { newId } from "models/utils"
import * as func from "utils/functions"
import HttpStatus from "http-status-codes"
import app from "app"
import config from 'configs'

const router = Router()

export default expressRouter => {
  expressRouter.use("/theodoitram", router)
}

router.get("/:stationId", async (req, res, next) => {
  const camId = `1`
  fs.existsSync(`${config.streamDir}${camId}/s.m3u8`)

  res.json({
    result: [
      { id: 1, streamUrl: `http://localhost:5000/api/stream/${camId}/s.m3u8` }
    ]
  })
})

router.get("/", async (req, res, next) => {
  let data = {}
  let cameraInfo = []
  let stationInfo = []
  let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName('QTN')
  monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
  monitoringGroupData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})
  let stationNameData = await app.Station.findStationNameByMonitoringType('QTN')
  
  if(stationNameData.length > 0){
    let stationId = stationNameData[0].id
    // let stationId = '1WMKmxYkgNpbLzolqjiJ'
    stationInfo = await app.Station.findOneStationInfo({ id: stationId })
    cameraInfo = await app.Camera.getAllCamerasByIds([stationId])
    cameraInfo = func.eleminateNestedField(cameraInfo, ['Station'])

    stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
  }
  // let cameraInfo = await app.Camera.getAllCamerasFromDatabase()
  // cameraInfo = func.eleminateNestedField(cameraInfo, ['Station'])

  data.monitoringGroup = monitoringGroupData
  data.stationName = stationNameData
  data.stationInfo = stationInfo
  data.cameraInfo = cameraInfo
  res.send(data)
  // res.json(result)
})
