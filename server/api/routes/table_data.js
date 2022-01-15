import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from 'app'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/dulieudangbang", router)


  router.get("/", async (req, res, next) => {
    const {monitoringType, startTime, endTime} = req.query 
    let data = {}
    let stationIndicatorsData = []
    let stationInfo = []
    let monitoringData = []
    let monitoringDataInfo = []
    let finalData = []

    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')

    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
    monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
    monitoringGroupData.unshift({id: 'ALL', key: 'ALL', value: 'Tất cả'})

    let stationNameData = await app.Station.findStationNameByMonitoringType(monitoringType)
    if(stationNameData.length > 0){
      stationInfo = await app.Station.findOneStationInfo({id : stationNameData[0].id})
      stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
    }
    
    // let monitoringGroupId = monitoringGroupData[1].key 
    // let stationInfo = await app.Station.findOneStationInfo({monitoringGroupId : monitoringGroupId}) 

    if(stationInfo.length > 0){
      let stationId = stationInfo[0]['id']
      let latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      stationInfo[0].latestSentAt = latestSentAt 
      stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationId)
      stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, ['Indicator'])

      monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByTime(stationId, startTime, endTime)
      monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

      if(monitoringDataInfo.length > 0){
        let arrayIdData = func.getIdData(monitoringDataInfo)
        monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

        finalData = func.addIndicatorValues(monitoringDataInfo,monitoringData, stationIndicatorsData )
      }
    }

    data.monitoringType = monitoringTypeData
    data.monitoringGroup = monitoringGroupData
    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorData = finalData
    res.send(data)
  })

  router.get("/group", async (req, res, next) => {
    let data = {}
    let stationIndicatorsData = []
    let stationInfo = []
    let monitoringData = []
    let monitoringDataInfo = []
    let finalData = []

    let {monitoringGroup, startTime, endTime} = req.query
    let stationNameData = await app.Station.findStationNameByMonitoringGroup(monitoringGroup)
    stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')

    stationInfo = await app.Station.findOneStationInfo({monitoringGroupId : monitoringGroup})
    
    if(stationInfo.length > 0){
      let stationId = stationInfo[0]['id']
      let latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      stationInfo[0].latestSentAt = latestSentAt 
      stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationId)
      stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, ['Indicator'])

      monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByTime(stationId, startTime, endTime)
      monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

      if(monitoringDataInfo.length > 0){
        let arrayIdData = func.getIdData(monitoringDataInfo)
        monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

        finalData = func.addIndicatorValues(monitoringDataInfo,monitoringData, stationIndicatorsData )
      }
    }   


    // console.log('stationId',stationInfo[0]['id'] )
    // let stationId = stationInfo[0]['id']

    // let monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByTime(stationId, startTime, endTime)
    // monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

    // let stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationId)
    // stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, ['Indicator'])

    // let arrayIdData = func.getIdData(monitoringDataInfo)
    // let monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

    // let finalData = func.addIndicatorValues(monitoringDataInfo,monitoringData, stationIndicatorsData )

    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorData = finalData
    res.send(data)
  })

  router.get("/station", async (req, res, next) => {
    let data = {}
    let {stationId, startTime, endTime} = req.query
    let stationInfo = await app.Station.findStationInfoByCondition({id : stationId},['id',"latestSentAt"]) 
    let latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
    stationInfo[0].latestSentAt = latestSentAt 
    let monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByTime(stationId, startTime, endTime)
    monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

    let stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationId)
    stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, ['Indicator'])

    let arrayIdData = func.getIdData(monitoringDataInfo)
    let monitoringData = await app.MonitoringData.findMonitoringData(arrayIdData)

    let finalData = func.addIndicatorValues(monitoringDataInfo,monitoringData, stationIndicatorsData )
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorData = finalData
    res.send(data)
  })
}
