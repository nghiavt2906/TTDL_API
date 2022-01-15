import { Router } from "express"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import {reformatLatestData} from 'app/utils'

import {getFilterStation, getFilterStationByType, getFilterStationByGroup} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/dulieukiemduyet", router)

  router.get("/newest/showAll/:userId", async (req, res, next) => {
    let {userId} = req.params
    let filter = await getFilterStation(userId)
    let data = {}
    if(filter.station.length){
      data = await getLatestAppovedDataByType(filter)
    }
    res.send(data)
  })

  router.get("/newest/showByTypeId/:userId/:typeId", async (req, res, next) => {
    let {userId, typeId} = req.params
    let filter = await getFilterStationByType(userId, typeId)
    let data = {}
    if(filter.station.length){
      data = await getLatestAppovedDataByType(filter)
    }
    res.send(data)
  })

  router.get("/newest/showByGroupId/:userId/:groupId", async (req, res, next) => {
    
    let {userId, groupId} = req.params
    let filter = await getFilterStationByGroup(userId, groupId)
    let data = {}
    if(filter.station.length){
      data = await getLatestApprovedDataByGroup(filter)
    }
    // console.log({data})
    res.send(data)
  })

  router.get("/newest/showByStationId/:userId/:stationId", async (req, res, next) => {
    
    let {userId, stationId} = req.params
    let data = {}
    data = await getLatestApprovedDataByStation(stationId)
    // console.log({data})
    res.send(data)
  })
}


async function getLatestAppovedDataByType(filter) {
  let arrayStationId = []
  // console.log(filter)
  arrayStationId = filter.station.map(item => {return item.key})
  let data = await app.Station.getLatestApprovedData(arrayStationId)
  data = reformatLatestData(data)

  filter.monitoringGroup.unshift({key: 'ALL', value: 'Tất cả'})
  filter.station.unshift({key: 'ALL', value: 'Tất cả'})

  return {
    // filter: {
    //   monitoringType: filter.monitoringType,
    //   monitoringGroup: filter.monitoringGroup,
    //   station: filter.station,
    //   defaultMonitoringType: filter.defaultMonitoringType
    // },
    data: data
  }
}

async function getLatestApprovedDataByGroup(filter) {
  let arrayStationId = []
  // console.log(filter)
  arrayStationId = filter.station.map(item => {return item.key})
  let data = await app.Station.getLatestApprovedData(arrayStationId)
  data = reformatLatestData(data)

  filter.station.unshift({key: 'ALL', value: 'Tất cả'})

  return {
    // filter: {
    //   station: filter.station
    // },
    data: data
  }
}

async function getLatestApprovedDataByStation(stationId) {
  let data = await app.Station.getLatestApprovedData([stationId])
  data = reformatLatestData(data)

  return {
    data: data
  }
}
