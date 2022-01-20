import { Router } from "express"
import models from 'models'
import { newId } from "models/utils"
import app from 'app'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import { getFilterStation, getFilterStationByType, getFilterStationByGroup } from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/thongtintram", router)

  router.get("/", async (req, res, next) => {
    // console.log(req.query)
    const { monitoringType } = req.query
    let stationData = {}
    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
    monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
    monitoringGroupData.unshift({ id: 'ALL', key: 'ALL', value: 'Tất cả' })
    let stationNameData = await app.Station.findStationNameByMonitoringType(monitoringType)
    stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
    stationNameData.unshift({ id: 'ALL', key: 'ALL', value: 'Tất cả' })
    let stationInfoData = await app.Station.findStationInfoByMonitoringType(monitoringType)

    stationData.monitoringType = monitoringTypeData
    stationData.monitoringGroup = monitoringGroupData
    stationData.stationName = stationNameData
    stationData.stationInfo = stationInfoData
    res.send(stationData)
  })

  router.get("/chuacoapikeynhandulieu", async (req, res, next) => {
    const stations = await app.Station.getAllStationsWithoutReceptionApi()
    res.json(stations)
  })

  router.get("/group", async (req, res, next) => {
    // console.log(req.query)
    const { monitoringGroup } = req.query
    let stationData = {}
    let stationNameData = await app.Station.findStationNameByMonitoringGroup(monitoringGroup)
    stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
    stationNameData.unshift({ id: 'ALL', key: 'ALL', value: 'Tất cả' })
    let stationInfoData = await app.Station.findStationInfoByMonitoringGroup(monitoringGroup)

    stationData.stationName = stationNameData
    stationData.stationInfo = stationInfoData
    res.send(stationData)
  })

  router.get("/station", async (req, res, next) => {
    // console.log(req.query)
    const { stationName } = req.query
    let stationData = {}
    let stationInfoData = await app.Station.findStationInfoByStationId(stationName)

    stationData.stationInfo = stationInfoData
    res.send(stationData)
  })

  router.get("/test/:userId", async (req, res, next) => {
    let { userId } = req.params
    let filter = await getFilterStation(userId)
    let data = {}
    if (filter.station.length) {
      data = await getStationInfoByType(filter.defaultMonitoringType.key, filter)
    }
    res.send(data)
  })
  router.get("/type/:userId/:typeId", async (req, res, next) => {
    let { userId, typeId } = req.params
    let filter = await getFilterStationByType(userId, typeId)
    let data = {}
    if (filter.station.length) {
      data = await getStationInfoByType(typeId, filter)
    }
    res.send(data)
  })

  router.get("/group/:userId/:groupId", async (req, res, next) => {

    let { userId, groupId } = req.params
    let filter = await getFilterStationByGroup(userId, groupId)
    let data = {}
    if (filter.station.length) {
      data = await getStationInfoByGroup(groupId, filter)
    }
    // console.log({data})
    res.send(data)
  })

  router.get("/station/:stationId", async (req, res, next) => {

    let { userId, stationId } = req.params
    let data = {}
    data = await getStationInfoByStation(stationId)
    // console.log({data})
    res.send(data)
  })
}
async function getStationInfoByType(type, filter) {
  let data = {}
  let monitoringType = type

  let stationInfoData = await app.Station.getStationInfoById(filter.station)
  filter.monitoringGroup.unshift({ key: 'ALL', value: 'Tất cả' })
  filter.station.unshift({ key: 'ALL', value: 'Tất cả' })

  data.monitoringType = filter.monitoringType
  data.monitoringGroup = filter.monitoringGroup
  data.stationName = filter.station
  data.stationInfo = stationInfoData
  data.defaultMonitoringType = filter.defaultMonitoringType
  return data
}

async function getStationInfoByGroup(groupId, filter) {
  let data = {}

  let stationInfoData = await app.Station.getStationInfoById(filter.station)
  filter.station.unshift({ key: 'ALL', value: 'Tất cả' })

  data.stationName = filter.station
  data.stationInfo = stationInfoData
  return data
}

async function getStationInfoByStation(stationId) {
  let data = {}
  let stationInfoData = await app.Station.getStationInfoById([{ key: stationId }])

  data.stationInfo = stationInfoData
  return data
}