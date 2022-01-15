import * as func from "utils/functions"
import app from "app"
import _ from 'lodash'

export const getFilterStation = async (userId) => {
  // console.log('NO O DAY ++++++++++++++++++++++++++')
  let filter = {
    station: [],
    monitoringType : [],
    monitoringGroup: [],
    defaultMonitoringType : {}
  }
  let arrayStationId = []
  // const stationId = await app.UserStation.getStationIdByUserId(userId)
  const stationId = await app.ManagerStation.getStationIdByManagerId(userId)
  if(stationId.length > 0){
    arrayStationId = stationId.map(station => {
      return station.stationId
    })
  }
  const stationData = await app.Station.getFilterStation(arrayStationId)
  // console.log(stationData)
  // stationData.forEach(station => {
  //   if(_.findIndex(filter.monitoringType, {key: station.MonitoringType.id}) < 0){
  //     filter.monitoringType.push({key : station.MonitoringType.id, value: station.MonitoringType.name})
  //   }
  //   if(station.monitoringType === filter.monitoringType[0].key){
  //     filter.station.push({ key : station.id, value: station.name})
  //     if(_.findIndex(filter.monitoringGroup, {key: station.MonitoringGroup.id}) < 0){
  //       filter.monitoringGroup.push({key : station.MonitoringGroup.id, value: station.MonitoringGroup.name})
  //     }
  //   }
  // })

  stationData.forEach(station => {
    if(_.findIndex(filter.monitoringType, {key: station.MonitoringType.id}) < 0){
      filter.monitoringType.push({key : station.MonitoringType.id, value: station.MonitoringType.name})
    }
  })
  // console.log(filter.monitoringType)
  if(filter.monitoringType.length === 0){
    return filter
  } 
  const index = _.findIndex(filter.monitoringType, item => {return item.key === 'QTN'})
  const defautMonitoringType = (index < 0) ? filter.monitoringType[0] : filter.monitoringType[index]
  // console.log(defautMonitoringType)
  filter.defaultMonitoringType = defautMonitoringType
  stationData.forEach(station => {
    if(station.monitoringType === defautMonitoringType.key){
      filter.station.push({ key : station.id, value: station.name})
      if(_.findIndex(filter.monitoringGroup, {key: station.MonitoringGroup.id}) < 0){
        filter.monitoringGroup.push({key : station.MonitoringGroup.id, value: station.MonitoringGroup.name})
      }
    }
  })
  return filter
}

export const getFilterStationByType = async (userId, type) => {
  let filter = {
    station: [],
    monitoringGroup: []
  }
  let arrayStationId = []
  // const stationId = await app.UserStation.getStationIdByUserId(userId)
  const stationId = await app.ManagerStation.getStationIdByManagerId(userId)
  if(stationId.length){
    arrayStationId = stationId.map(station => {
      return station.stationId
    })
  }
  const stationData = await app.Station.getFilterStationByType(type, arrayStationId)
  stationData.forEach(station => {
    filter.station.push({ key : station.id, value: station.name})
    if(_.findIndex(filter.monitoringGroup, {key: station.MonitoringGroup.id}) < 0){
      filter.monitoringGroup.push({key : station.MonitoringGroup.id, value: station.MonitoringGroup.name})
    }
  })
  return filter
}

export const getFilterStationByGroup = async (userId, groupId) => {
  let filter = {
    station: []
  }
  let arrayStationId = []
  const stationId = await app.ManagerStation.getStationIdByManagerId(userId)
  if(stationId.length){
    arrayStationId = stationId.map(station => {
      return station.stationId
    })
  }
  const stationData = await app.Station.getFilterStationByGroup(groupId, arrayStationId)
  stationData.forEach(station => {
    filter.station.push({ key : station.id, value: station.name})
  })
  return filter
}

// public 

export const getEnvIndexByType = async (typeId, startEnvIndex, endEnvIndex) => {
  let data = {}
  // let {typeId} = req.params
  let stationData = await app.Station.getStationInfoByTypeIndexMobile(typeId, startEnvIndex, endEnvIndex)
  let stationInfo = func.reformatStationData(stationData)
  data.stationInfo = stationInfo
  return data
}

export const getEnvIndexByGroup = async (groupId, startEnvIndex, endEnvIndex) => {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationInfoByGroupIndexMobile(groupId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

export const getEnvIndexByTypeDistrict = async (typeId, districtId, startEnvIndex, endEnvIndex) => {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationInfoByTypeDistrictIndexMobile(typeId, districtId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

export const getEnvIndexByGroupDistrict = async (groupId, districtId, startEnvIndex, endEnvIndex) => {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationInfoByGroupDistrictIndexMobile(groupId, districtId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

export const getEnvIndexByStation = async (stationId, startEnvIndex, endEnvIndex) => {
  let data = {}
  // let {groupId} = req.params
  let stationInfo = await app.Station.getStationInfoByStationIndexMobile(stationId, startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

export const getEnvIndexByAll = async (startEnvIndex, endEnvIndex) => {
  let data = {}
  let stationInfo = await app.Station.getStationInfoByAllIndexMobile(startEnvIndex, endEnvIndex)
  data.stationInfo = stationInfo
  return data
}

