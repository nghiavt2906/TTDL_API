import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import {reformatStationRankingData} from 'app/utils'

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/xephang", router)

  router.get("/type/:typeId", async (req, res, next) => {
    let data = {}
    let {typeId} = req.params
    if(typeId === undefined){
      res.sendStatus(400)
    } else {
      const condition = analyzeCondition(typeId, 'ALL', 'ALL')
      const stationData = await app.Station.getPublicStationInfoByCondition(condition, 0, 300)
      const stationInfo = reformatStationRankingData(stationData)
      stationInfo.sort((a,b) => (a.envIndex > b.envIndex) ? -1 : ((b.envIndex > a.envIndex) ? 1 : 0))
      // console.log(stationInfo)
      data.stationInfo = stationInfo
      res.send(data)
    }
  })

  router.get("/getStation", async (req, res, next) => {
    let data = {}
    let {monitoringType, monitoringGroup, district} = req.query
    if(monitoringType === undefined || monitoringGroup === undefined || district === undefined){
      res.sendStatus(400)
    } else {
      const condition = analyzeCondition(monitoringType, monitoringGroup, district)
      const stationData = await app.Station.getPublicStationInfoByCondition(condition, 0, 300)
      const stationInfo = reformatStationRankingData(stationData)
      stationInfo.sort((a,b) => (a.envIndex > b.envIndex) ? -1 : ((b.envIndex > a.envIndex) ? 1 : 0))
      // console.log(stationInfo)
      data.stationInfo = stationInfo
      res.send(data)
    }
  })

}

async function getRankingByType (typeId) {
  let data = {}
  // let {typeId} = req.params
  let stationInfo = await app.Station.getStationRankingByTypeMobile(typeId)
  data.stationInfo = stationInfo
  return data
}

async function getRankingByGroup (groupId) {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationRankingByGroupMobile(groupId)
  data.stationInfo = stationInfo
  return data
}

async function getRankingByTypeDistrict (typeId, districtId) {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationRankingByDistrictMobile(typeId, districtId)
  data.stationInfo = stationInfo
  return data
}

async function getRankingByGroupDistrict (groupId, districtId) {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationRankingByDistrictGroupMobile(groupId, districtId)
  data.stationInfo = stationInfo
  return data
}

function analyzeCondition (monitoringType, monitoringGroup, district) {
  let condition = {}
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

  return condition
}