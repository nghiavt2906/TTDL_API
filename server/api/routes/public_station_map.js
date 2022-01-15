import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"

import {getEnvIndexByType, getEnvIndexByGroup, getEnvIndexByTypeDistrict, getEnvIndexByGroupDistrict, getEnvIndexByStation, getEnvIndexByAll} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/bandotram", router)

  router.get("/", async (req, res, next) => {
    let data = {}
    // let stationInfo = await app.Station.getAllStationInfoMobile()
    // data.stationInfo = stationInfo
    let stationData = await app.Station.getPublicStationInfoByCondition({}, 0, 300)
    let stationInfo = func.reformatStationData(stationData)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/type/:typeId", async (req, res, next) => {
    let data = {}
    let {typeId} = req.params
    // let stationInfo = await app.Station.getStationInfoByTypeMobile(typeId)
    // data.stationInfo = stationInfo
    let stationData = await app.Station.getPublicStationInfoByCondition({monitoringtype: typeId}, 0, 300)
    let stationInfo = func.reformatStationData(stationData)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/group/:groupId", async (req, res, next) => {
    let data = {}
    let {groupId} = req.params
    // let stationInfo = await app.Station.getStationInfoByGroupMobile(groupId)
    // data.stationInfo = stationInfo
    let stationData = await app.Station.getPublicStationInfoByCondition({monitoringGroupId: groupId}, 0, 300)
    let stationInfo = func.reformatStationData(stationData)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/station/:stationId", async (req, res, next) => {
    
    let {stationId} = req.params
    let data = {}
    // data = await getLatestDataByStationMobile(stationId)
    // console.log({data})
    let stationData = await app.Station.getPublicStationInfoByCondition({id: stationId}, 0, 300)
    let stationInfo = func.reformatStationData(stationData)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/search", async (req, res, next) => {
    
    let {station} = req.query
    let data = {}
    data = await app.Station.getStationInfoByKeywordMobile(station)
    data = func.reformatStationData(data)
    res.send(data)
  })

  router.get("/getStation", async (req, res, next) => {
    let data = {}
    let {monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex, station} = req.query
    if(monitoringType === undefined || monitoringGroup === undefined || district === undefined || station === undefined ||startEnvIndex === undefined || endEnvIndex === undefined){
      res.sendStatus(400)
    } else {
      const condition = analyzeCondition(monitoringType, monitoringGroup, district, station)
      let stationData = await app.Station.getPublicStationInfoByCondition(condition, 0, 300)
      let stationInfo = func.reformatStationData(stationData)
      data.stationInfo = stationInfo
      res.send(data)
    }
  })
}

function analyzeCondition (monitoringType, monitoringGroup, district, station) {
  let condition = {}
  if(station !== 'ALL'){
    condition = {id : station}
  } else {
    if(monitoringGroup !== 'ALL'){
      if(district === 'ALL'){
        condition = {monitoringGroupId : monitoringGroup}
      } else {
        condition = {monitoringGroupId : monitoringGroup, districtId: district}
      }
    } else {
      if(district === 'ALL'){
        condition = {monitoringType: monitoringType}
      } else {
        condition = {monitoringType : monitoringType, districtId: district}
      }
    }
  }

  return condition
}