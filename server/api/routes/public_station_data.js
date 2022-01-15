import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import _ from 'lodash'
import moment from 'moment'
import {reformatLatestStationData} from 'app/utils'

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/dulieutram", router)
  
  router.get("/:stationId", async (req, res, next) => {
    try {
      const {stationId} = req.params
      let result = await app.Station.getLatestStation(stationId)
      // console.log(result[0].dataValues.MonitoringDataInfos)
      // let result = await app.Station.getPublicStationInfoByCondition({id: stationId}, 0, 300)
      let newResult = reformatLatestStationData(result)
      result[0].envIndex = newResult[0].envIndex
      result[0].latestSentAt = newResult[0].latestSentAt
      // console.log(result[0])
      res.json({ data: result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getDataByHour/:stationId", async (req, res, next) => {
    try {
      const {stationId} = req.params
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['monitoringGroupId']})
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      let stationIndicatorsData = await app.StationIndicators.getIndicators(stationId)
      let monitoringData = await app.MonitoringDataInfo.getDataIndicatorByHour(stationId, stationIndicatorsData[0].name, startTime, endTime)
      let thresholdInfoData = await app.IndicatorThreshold.getIndicatorThreshold(station[0].monitoringGroupId, stationIndicatorsData[0].id)

      data.stationIndicators = stationIndicatorsData
      data.monitoringData[stationIndicatorsData[0].name] = monitoringData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getDataByHour/indicator/:stationId/:indicatorId", async (req, res, next) => {
    try {
      const {stationId, indicatorId} = req.params
      let indicator = await models.Indicator.findOne({attributes: ['symbol'], where: {id: indicatorId}})
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['monitoringGroupId']})
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      // console.log('AAAAAAAAA', latestSentAt)
      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      let monitoringData = await app.MonitoringDataInfo.getDataIndicatorByHour(stationId, indicator.symbol, startTime, endTime)
      let thresholdInfoData = await app.IndicatorThreshold.getIndicatorThreshold(station[0].monitoringGroupId, indicatorId)

      data.monitoringData[indicator.symbol] = monitoringData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getDataByDay/indicator/:stationId/:indicatorId", async (req, res, next) => {
    try {
      const {stationId, indicatorId} = req.params
      let indicator = await models.Indicator.findOne({attributes: ['symbol'], where: {id: indicatorId}})
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['latestSentAt','monitoringGroupId']})
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      // console.log('AAAAAAAAA', latestSentAt)
      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      let monitoringData = await app.MonitoringDataInfo.getDataIndicatorByWeek(stationId, indicator.symbol, startTime, endTime)
      let thresholdInfoData = await app.IndicatorThreshold.getIndicatorThreshold(station[0].monitoringGroupId, indicatorId)

      data.monitoringData[indicator.symbol] = monitoringData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  //Web portal
  router.get("/getIndicatorDataByHour/:stationId", async (req, res, next) => {
    try {
      const {stationId} = req.params
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['monitoringGroupId']})
      // const endTime = moment(station[0].latestSentAt).format("YYYY-MM-DD HH:mm:ss")
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      // console.log('AAAAAAAAA', latestSentAt)
      // const endTime = moment(latestSentAt).format("YYYY-MM-DD HH:mm:ss")
      // const startTime = moment(endTime).subtract(2, 'days').format("YYYY-MM-DD HH:mm:ss")

      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()

      // startAt = moment.utc(startAt).tz('Asia/Ho_Chi_Minh').format()
      // endAt = moment.utc(endAt).tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      let stationIndicatorsData = await app.StationIndicators.getIndicators(stationId)
      await Promise.all(stationIndicatorsData.map(async indicator => {
        data.monitoringData[indicator.name] = await app.MonitoringDataInfo.getDataIndicatorByHour(stationId, indicator.name, startTime, endTime)
      }))
      let thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({ monitoringGroupId: station[0].monitoringGroupId })

      // data.stationIndicators = stationIndicatorsData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getDataByDay/:stationId", async (req, res, next) => {
    try {
      const {stationId} = req.params
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['monitoringGroupId']})
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      // console.log('AAAAAAAAA', latestSentAt)
      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      let stationIndicatorsData = await app.StationIndicators.getIndicators(stationId)
      let monitoringData = await app.MonitoringDataInfo.getDataIndicatorByWeek(stationId, stationIndicatorsData[0].name, startTime, endTime)
      let thresholdInfoData = await app.IndicatorThreshold.getIndicatorThreshold(station[0].monitoringGroupId, stationIndicatorsData[0].id)

      data.stationIndicators = stationIndicatorsData
      data.monitoringData[stationIndicatorsData[0].name] = monitoringData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getIndicatorDataByDay/:stationId", async (req, res, next) => {
    try {
      const {stationId} = req.params
      const station = await models.Station.findAll({where: {id: stationId}, attributes : ['monitoringGroupId']})
      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAtPublic(stationId)
      // console.log('AAAAAAAAA', latestSentAt)
      const endTime = moment(latestSentAt).tz('Asia/Ho_Chi_Minh').format()
      const startTime = moment(endTime).subtract(2, 'days').tz('Asia/Ho_Chi_Minh').format()
      
      let data = {}
      data.monitoringData = {}
      // let monitoringData = await app.MonitoringDataInfo.getDataIndicatorByWeek(stationId, indicator.symbol, startTime, endTime)
      // let thresholdInfoData = await app.IndicatorThreshold.getIndicatorThreshold(station[0].monitoringGroupId, indicatorId)
      let stationIndicatorsData = await app.StationIndicators.getIndicators(stationId)
      await Promise.all(stationIndicatorsData.map(async indicator => {
        data.monitoringData[indicator.name] = await app.MonitoringDataInfo.getDataIndicatorByWeek(stationId, indicator.name, startTime, endTime)
      }))
      let thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({ monitoringGroupId: station[0].monitoringGroupId })

      // data.stationIndicators = stationIndicatorsData
      // data.monitoringData[indicator.symbol] = monitoringData
      data.thresholdInfoData = thresholdInfoData
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}