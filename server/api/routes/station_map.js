import { Router } from "express"
import models from "models"
import * as func from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import app from "app"
import {
  getFilterStation,
  getFilterStationByType,
  getFilterStationByGroup,
} from "api/routes/utils"
import {
  reformatStationInfo,
  getStationId,
  reformatLatestData,
} from "app/utils"

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/bando", router)

  router.get("/", async (req, res, next) => {
    // console.log(req.query)
    const { monitoringType } = req.query
    let data = {}
    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    monitoringTypeData = func.changeToArrayFilter(
      monitoringTypeData,
      "id",
      "name"
    )
    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(
      monitoringType
    )
    monitoringGroupData = func.changeToArrayFilter(
      monitoringGroupData,
      "id",
      "name"
    )
    monitoringGroupData.unshift({ id: "ALL", key: "ALL", value: "Tất cả" })
    let stationNameData = await app.Station.findStationNameByMonitoringType(
      monitoringType
    )
    stationNameData = func.changeToArrayFilter(stationNameData, "id", "name")
    stationNameData.unshift({ id: "ALL", key: "ALL", value: "Tất cả" })

    let stationInfoData = await app.Station.getStationInfobyRawQuery(
      "MONITORING_TYPE",
      monitoringType
    )
    let arrayIdData = func.getIdData(stationInfoData)
    let monitoringData = await app.MonitoringData.findMonitoringData(
      arrayIdData
    )

    let systemInfoData = await app.System.findSystemInfo("1", [
      "safetyThresholdColor",
      "lowerThresholdColor",
      "upperThresholdColor",
    ])
    let thresholdInfoData =
      await app.IndicatorThreshold.findThresholdByCondition({
        monitoringType: monitoringType,
      })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])

    data.monitoringType = monitoringTypeData
    data.monitoringGroup = monitoringGroupData
    data.stationName = stationNameData
    data.stationInfo = stationInfoData
    data.monitoringData = monitoringData
    data.systemInfo = systemInfoData
    data.thresholdInfo = thresholdInfoData
    res.send(data)
  })

  router.get("/group", async (req, res, next) => {
    // console.log('------------------> Here')
    // console.log(req.query)
    const { monitoringGroup } = req.query
    let data = {}
    let stationNameData = await app.Station.findStationNameByMonitoringGroup(
      monitoringGroup
    )
    stationNameData = func.changeToArrayFilter(stationNameData, "id", "name")
    stationNameData.unshift({ id: "ALL", key: "ALL", value: "Tất cả" })

    let stationInfoData = await app.Station.getStationInfobyRawQuery(
      "MONITORING_GROUP",
      monitoringGroup
    )

    let arrayIdData = func.getIdData(stationInfoData)
    // console.log({arrayIdData})
    let monitoringData = await app.MonitoringData.findMonitoringData(
      arrayIdData
    )

    let thresholdInfoData =
      await app.IndicatorThreshold.findThresholdByCondition({
        monitoringGroupId: monitoringGroup,
      })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])

    data.stationName = stationNameData
    data.stationInfo = stationInfoData
    data.monitoringData = monitoringData
    data.thresholdInfo = thresholdInfoData
    res.send(data)
  })

  router.get("/station", async (req, res, next) => {
    // console.log(req.query)
    const { stationName } = req.query
    let data = {}
    let stationInfoData = await app.Station.getStationInfobyRawQuery(
      "STATION",
      stationName
    )

    let arrayIdData = func.getIdData(stationInfoData)
    // console.log({arrayIdData})
    let monitoringData = await app.MonitoringData.findMonitoringData(
      arrayIdData
    )

    data.stationInfo = stationInfoData
    data.monitoringData = monitoringData
    res.send(data)
  })

  router.get("/test/:userId", async (req, res, next) => {
    let { userId } = req.params
    let filter = await getFilterStation(userId)
    let data = {}
    if (filter.station.length) {
      data = await getStationMapByType(filter.defaultMonitoringType.key, filter)
    }
    res.send(data)
  })
  router.get("/type/:userId/:typeId", async (req, res, next) => {
    let { userId, typeId } = req.params
    let filter = await getFilterStationByType(userId, typeId)
    let data = {}
    if (filter.station.length) {
      data = await getStationMapByType(typeId, filter)
    }
    res.send(data)
  })

  router.get("/group/:userId/:groupId", async (req, res, next) => {
    let { userId, groupId } = req.params
    let filter = await getFilterStationByGroup(userId, groupId)
    let data = {}
    if (filter.station.length) {
      data = await getStationMapByGroup(groupId, filter)
    }
    // console.log({data})
    res.send(data)
  })

  router.get("/station/:stationId", async (req, res, next) => {
    let { userId, stationId } = req.params
    let data = {}
    data = await getStationMapByStation(stationId)
    // console.log({data})
    res.send(data)
  })

  router.get("/type/:typeId", async (req, res, next) => {
    // console.log('==============>', req.params.typeId)
    const monitoringType = req.params.typeId
    let data = {}
    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    // monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(
      monitoringType
    )
    // monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
    // monitoringGroupData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})
    let stationNameData = await app.Station.findStationNameByMonitoringType(
      monitoringType
    )
    // stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
    // stationNameData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})

    let stationInfoData = await app.Station.getStationInfobyRawQuery(
      "MONITORING_TYPE",
      monitoringType
    )
    let arrayIdData = func.getIdData(stationInfoData)
    let monitoringData = await app.MonitoringData.findMonitoringData(
      arrayIdData
    )

    let systemInfoData = await app.System.findSystemInfo("1", [
      "safetyThresholdColor",
      "lowerThresholdColor",
      "upperThresholdColor",
    ])
    let thresholdInfoData =
      await app.IndicatorThreshold.findThresholdByCondition({
        monitoringType: monitoringType,
      })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])

    data.monitoringType = monitoringTypeData
    data.monitoringGroup = monitoringGroupData
    data.stationName = stationNameData
    data.stationInfo = stationInfoData
    data.monitoringData = monitoringData
    data.systemInfo = systemInfoData
    data.thresholdInfo = thresholdInfoData
    res.send(data)
  })

  router.post("/:managerId", async (req, res, next) => {
    let { managerId } = req.params
    const { stationId } = req.body
    // console.log(req.body)
    let data = await app.Station.getLatestStationData(stationId)
    data = reformatLatestData(data)
    res.send(data)
  })
}

async function getStationMapByType(type, filter) {
  // let data = {}
  // let monitoringType = type
  // // let monitoringTypeData = await app.MonitoringType.getMonitoringType()
  // // monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')
  // // let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
  // // monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
  // // monitoringGroupData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})
  // // let stationNameData = await app.Station.findStationNameByMonitoringType(monitoringType)
  // // stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
  // // stationNameData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})

  // let stationInfoData = await app.Station.findStationInfobyRawQuery(filter.station)
  // let arrayIdData = func.getIdData(stationInfoData)
  // let monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)
  // let systemInfoData = await app.System.findSystemInfo('1', ['safetyThresholdColor','lowerThresholdColor','upperThresholdColor'])
  // let thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({monitoringType : monitoringType})
  // thresholdInfoData = func.eleminateNestedField(thresholdInfoData, ['Indicator', 'MonitoringGroup'])
  // filter.monitoringGroup.unshift({key: 'ALL', value: 'Tất cả'})
  // filter.station.unshift({key: 'ALL', value: 'Tất cả'})

  // data.monitoringType = filter.monitoringType
  // data.monitoringGroup = filter.monitoringGroup
  // data.stationName = filter.station
  // data.stationInfo = stationInfoData
  // data.monitoringData = monitoringData
  // data.systemInfo = systemInfoData
  // data.thresholdInfo = thresholdInfoData
  // return data

  let data = {}
  let monitoringType = type
  let monitoringData = []
  let systemInfoData = []
  let thresholdInfoData = []
  let arrayStationId = []
  arrayStationId = getStationId(filter)
  let stationInfoData = await app.Station.getStationInfoByCondition(
    arrayStationId
  )
  stationInfoData = reformatStationInfo(stationInfoData)
  let arrayIdData = func.getIdData(stationInfoData)
  if (arrayIdData.length > 0) {
    monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)
    systemInfoData = await app.System.findSystemInfo("1", [
      "safetyThresholdColor",
      "lowerThresholdColor",
      "upperThresholdColor",
    ])
    thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({
      monitoringType: monitoringType,
    })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])
  }
  filter.monitoringGroup.unshift({ key: "ALL", value: "Tất cả" })
  filter.station.unshift({ key: "ALL", value: "Tất cả" })

  data.monitoringType = filter.monitoringType
  data.monitoringGroup = filter.monitoringGroup
  data.stationName = filter.station
  data.stationInfo = stationInfoData
  data.monitoringData = monitoringData
  data.systemInfo = systemInfoData
  data.thresholdInfo = thresholdInfoData
  data.defaultMonitoringType = filter.defaultMonitoringType
  return data
}

async function getStationMapByGroup(groupId, filter) {
  // let monitoringGroup = groupId
  // let data = {}
  // let stationInfoData = await app.Station.findStationInfobyRawQuery(filter.station)

  // let arrayIdData = func.getIdData(stationInfoData)
  // let monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

  // let thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({monitoringGroupId : monitoringGroup})
  // thresholdInfoData = func.eleminateNestedField(thresholdInfoData, ['Indicator', 'MonitoringGroup'])
  // filter.station.unshift({key: 'ALL', value: 'Tất cả'})

  // data.stationName = filter.station
  // data.stationInfo = stationInfoData
  // data.monitoringData = monitoringData
  // data.thresholdInfo = thresholdInfoData
  // return data

  let monitoringGroup = groupId
  let data = {}
  let monitoringData = []
  let thresholdInfoData = []
  let arrayStationId = []
  arrayStationId = getStationId(filter)
  // let stationInfoData = await app.Station.findStationInfobyRawQuery(filter.station)
  let stationInfoData = await app.Station.getStationInfoByCondition(
    arrayStationId
  )
  stationInfoData = reformatStationInfo(stationInfoData)

  let arrayIdData = func.getIdData(stationInfoData)
  if (arrayIdData.length > 0) {
    monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)
    thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({
      monitoringGroupId: monitoringGroup,
    })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])
  }

  filter.station.unshift({ key: "ALL", value: "Tất cả" })

  data.stationName = filter.station
  data.stationInfo = stationInfoData
  data.monitoringData = monitoringData
  data.thresholdInfo = thresholdInfoData
  return data
}

async function getStationMapByStation(stationId) {
  // let data = {}
  // let stationInfoData = await app.Station.findStationInfobyRawQuery([{key: stationId}])

  // let arrayIdData = func.getIdData(stationInfoData)
  // let monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

  // data.stationInfo = stationInfoData
  // data.monitoringData = monitoringData
  // return data

  let data = {}
  let monitoringData = []
  // let stationInfoData = await app.Station.findStationInfobyRawQuery([{key: stationId}])
  let stationInfoData = await app.Station.getStationInfoByCondition([stationId])
  stationInfoData = reformatStationInfo(stationInfoData)
  let arrayIdData = func.getIdData(stationInfoData)
  if (arrayIdData.length > 0) {
    monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)
  }

  data.stationInfo = stationInfoData
  data.monitoringData = monitoringData
  return data
}
