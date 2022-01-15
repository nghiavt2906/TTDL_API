import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import {getOrderStationData} from 'app/utils'

import {getEnvIndexByType, getEnvIndexByGroup, getEnvIndexByTypeDistrict, getEnvIndexByGroupDistrict, getEnvIndexByStation} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/dulieumoitruong", router)

  router.get("/type/:typeId", async (req, res, next) => {
    let data = {}
    let {typeId} = req.params
    let stationData = await app.Station.getStationInfoByTypeMobile(typeId)
    // console.log(stationData[0])
    const stationInfo = func.reformatStationData(stationData)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/group/:groupId", async (req, res, next) => {
    let data = {}
    let {groupId} = req.params
    let stationInfo = await app.Station.getStationInfoByGroupMobile(groupId)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/station/:stationId", async (req, res, next) => {
    
    let {stationId} = req.params
    let data = {}
    data = await getLatestDataByStationMobile(stationId)
    // console.log({data})
    res.send(data)
  })

  router.get("/group/:groupId", async (req, res, next) => {
    let data = {}
    let {groupId} = req.params
    let stationInfo = await app.Station.getStationInfoByGroupMobile(groupId)
    data.stationInfo = stationInfo
    res.send(data)
  })

  router.get("/getStation", async (req, res, next) => {
    let data = {}
    let {monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex, station} = req.query
    // console.log({monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex})
    if(monitoringType === undefined || monitoringGroup === undefined || district === undefined || station === undefined ||startEnvIndex === undefined || endEnvIndex === undefined){
      res.sendStatus(400)
    } else {
      const condition = analyzeCondition(monitoringType, monitoringGroup, district, station)
      let stationData = await app.Station.getPublicStationInfoByCondition(condition, 0, 300)
      let stationInfo = func.reformatStationData(stationData)
      data.stationInfo = stationInfo
      // if(station !== 'ALL'){
      //   data = await getEnvIndexByStation(station, startEnvIndex, endEnvIndex)
      // } else{
      //   if(monitoringGroup === 'ALL'){
      //     if(district === 'ALL'){
      //       data = await getEnvIndexByType(monitoringType, startEnvIndex, endEnvIndex)
      //     } else {
      //       data = await getEnvIndexByTypeDistrict(monitoringType, district, startEnvIndex, endEnvIndex)
      //     }
      //   } else {
      //     if(district === 'ALL'){
      //       data = await getEnvIndexByGroup(monitoringGroup, startEnvIndex, endEnvIndex)
      //     } else {
      //       data = await getEnvIndexByGroupDistrict(monitoringGroup, district, startEnvIndex, endEnvIndex)
      //     }
      //   }
      // }
      res.send(data)
    }
  })

  router.get("/filter/type/:typeId", async (req, res, next) => {
    let data = {}
    let {typeId} = req.params
    let monitoringType = await app.MonitoringType.getMonitoringType()
    let monitoringGroup = await app.MonitoringGroup.getMonitoringGroupName(typeId)
    let district = await app.District.getDistrictName()
    data.monitoringType = monitoringType
    data.monitoringGroup = monitoringGroup
    data.district = district
    res.send(data)
  })

  router.get("/typeByCitizenId/:citizenId/:typeId", async (req, res, next) => {
    // let data = {}
    // let {typeId, citizenId} = req.params
    // let stationInfo = await app.Station.getStationInfoByTypeMobile(typeId)
    // data.stationInfo = stationInfo
    // res.send(data)

    try {
      const {token} = req.headers
      const {citizenId, typeId} = req.params
      // await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      // let stationInfo = await app.CitizenStation.getStationByCitizenId(citizenId, typeId)
      let stationData = await app.CitizenStation.getPublicStation(citizenId, {monitoringType: typeId}, 0, 300)
      // console.log(stationData)
      let stationInfo = await app.Station.getPublicStationInfoByArray(stationData)
      stationInfo = func.reformatStationData(stationInfo)
      // console.log(stationData)
      stationInfo = getOrderStationData(stationData, stationInfo)
      res.json({ stationInfo })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStationByCitizenId/:citizenId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId} = req.params
      // await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      let data = {}
      let {monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex, station} = req.query
      // console.log({monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex})
      if(monitoringType === undefined || monitoringGroup === undefined || district === undefined || startEnvIndex === undefined || endEnvIndex === undefined){
        res.sendStatus(400)
      } else {
        const condition = analyzeCondition(monitoringType, monitoringGroup, district, station)
        // console.log(condition)
        let stationData = await app.CitizenStation.getPublicStation(citizenId, condition, 0, 300)
        let stationInfo = await app.Station.getPublicStationInfoByArray(stationData)
        stationInfo = func.reformatStationData(stationInfo)
        stationInfo = getOrderStationData(stationData, stationInfo)
        data.stationInfo = stationInfo
        // if(monitoringGroup === 'ALL'){
        //   if(district === 'ALL'){
        //     data = await getEnvIndexByTypeCitizenId(citizenId, monitoringType, startEnvIndex, endEnvIndex)
        //   } else {
        //     data = await getEnvIndexByTypeDistrictCitizenId(citizenId, monitoringType, district, startEnvIndex, endEnvIndex)
        //   }
        // } else {
        //   if(district === 'ALL'){
        //     data = await getEnvIndexByGroupCitizenId(citizenId, monitoringGroup, startEnvIndex, endEnvIndex)
        //   } else {
        //     data = await getEnvIndexByGroupDistrictCitizenId(citizenId, monitoringGroup, district, startEnvIndex, endEnvIndex)
        //   }
        // }
        res.send(data)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }

    // let data = {}
    // let {monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex} = req.query
    // console.log({monitoringType, monitoringGroup, district, startEnvIndex, endEnvIndex})
    // if(monitoringType === undefined || monitoringGroup === undefined || district === undefined || startEnvIndex === undefined || endEnvIndex === undefined){
    //   res.sendStatus(400)
    // } else {
    //   if(monitoringGroup === 'ALL'){
    //     if(district === 'ALL'){
    //       data = await getEnvIndexByType(monitoringType, startEnvIndex, endEnvIndex)
    //     } else {
    //       data = await getEnvIndexByTypeDistrict(monitoringType, district, startEnvIndex, endEnvIndex)
    //     }
    //   } else {
    //     if(district === 'ALL'){
    //       data = await getEnvIndexByGroup(monitoringGroup, startEnvIndex, endEnvIndex)
    //     } else {
    //       data = await getEnvIndexByGroupDistrict(monitoringGroup, district, startEnvIndex, endEnvIndex)
    //     }
    //   }
    //   res.send(data)
    // }

  })
}

async function getEnvIndexByTypeCitizenId (citizenId, typeId, startEnvIndex, endEnvIndex){
  let data = {}
  // let {typeId} = req.params
  let stationInfo = await app.CitizenStation.getPublicStationByTypeIndex (citizenId, typeId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

async function getEnvIndexByGroupCitizenId (citizenId, groupId, startEnvIndex, endEnvIndex){
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.CitizenStation.getPublicStationByGroupIndex (citizenId, groupId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

async function getEnvIndexByTypeDistrictCitizenId (citizenId, typeId, districtId, startEnvIndex, endEnvIndex){
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.CitizenStation.getPublicStationByTypeDistrictIndex(citizenId, typeId, districtId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

async function getEnvIndexByGroupDistrictCitizenId (citizenId, groupId, districtId, startEnvIndex, endEnvIndex){
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.CitizenStation.getPublicStationByGroupDistrictIndex(citizenId, groupId, districtId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
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