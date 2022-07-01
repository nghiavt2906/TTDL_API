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
import moment from "moment"
import _ from "lodash"

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/dulieubieudo", router)

  router.get("/", async (req, res, next) => {
    const { monitoringType, startTime, endTime } = req.query
    let data = {}
    let thresholdInfoData = []
    let stationIndicatorsData = []
    let stationInfo = []
    let monitoringData = {}

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

    if (stationNameData.length > 0) {
      let stationId = stationNameData[0].id
      stationInfo = await app.Station.findBasicStationInfo({ id: stationId })
      let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
      // console.log('ahihi', latestSentAt)
      stationInfo[0].latestSentAt = latestSentAt
      // console.log(stationInfo)

      thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition(
        { monitoringGroupId: stationInfo[0].monitoringGroupId }
      )
      thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
        "Indicator",
        "MonitoringGroup",
      ])

      stationIndicatorsData =
        await app.StationIndicators.findIndicatorByIdStation(stationId)
      stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
        "Indicator",
      ])

      if (stationIndicatorsData.length) {
        await Promise.all(
          stationIndicatorsData.map(async (indicator) => {
            monitoringData[indicator.indicatorName] =
              await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
                stationId,
                indicator.indicatorName,
                startTime,
                endTime
              )

            monitoringData[indicator.indicatorName] = monitoringData[
              indicator.indicatorName
            ].map((data) => {
              return {
                name: func.convertToNormalDate(data.name),
                value: data.value,
                indicator: data.indicator,
              }
            })
            // console.log(monitoringData[indicator.indicatorName] )
          })
        )
      }

      stationNameData = func.changeToArrayFilter(stationNameData, "id", "name")
    }

    data.indicatorThresholds = thresholdInfoData
    data.monitoringType = monitoringTypeData
    data.monitoringGroup = monitoringGroupData
    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    // console.log(monitoringData)
    data.indicatorData = monitoringData
    // console.log({monitoringData})
    res.send(data)
  })

  router.get("/group", async (req, res, next) => {
    let data = {}
    let monitoringData = {}
    let thresholdInfoData = []
    let stationNameData = []
    let stationInfo = []
    let stationIndicatorsData = []

    let { monitoringGroup, startTime, endTime } = req.query
    stationNameData = await app.Station.findStationNameByMonitoringGroup(
      monitoringGroup
    )

    if (stationNameData.length > 0) {
      let stationId = stationNameData[0].id
      stationInfo = await app.Station.findBasicStationInfo({ id: stationId })
      let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
      // console.log('ahihi', latestSentAt)
      stationInfo[0].latestSentAt = latestSentAt
      // console.log(stationInfo)

      thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition(
        { monitoringGroupId: stationInfo[0].monitoringGroupId }
      )
      thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
        "Indicator",
        "MonitoringGroup",
      ])

      stationIndicatorsData =
        await app.StationIndicators.findIndicatorByIdStation(stationId)
      stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
        "Indicator",
      ])

      if (stationIndicatorsData.length) {
        await Promise.all(
          stationIndicatorsData.map(async (indicator) => {
            monitoringData[indicator.indicatorName] =
              await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
                stationId,
                indicator.indicatorName,
                startTime,
                endTime
              )
            monitoringData[indicator.indicatorName] = monitoringData[
              indicator.indicatorName
            ].map((data) => {
              return {
                name: func.convertToNormalDate(data.name),
                value: data.value,
                indicator: data.indicator,
              }
            })
          })
        )
      }

      stationNameData = func.changeToArrayFilter(stationNameData, "id", "name")
    }
    data.indicatorThresholds = thresholdInfoData
    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorData = monitoringData
    res.send(data)
  })

  router.get("/station", async (req, res, next) => {
    let data = {}
    let monitoringData = {}
    let { stationId, startTime, endTime } = req.query
    // console.log(req.query)
    let stationInfo = await app.Station.findStationInfoByCondition(
      { id: stationId },
      ["id", "latestSentAt"]
    )
    let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
    stationInfo[0].latestSentAt = latestSentAt
    // console.log(stationInfo)

    // let monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(stationId,'2019-12-18 00:00:22', '2019-12-19 00:00:22')
    // monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

    let stationIndicatorsData =
      await app.StationIndicators.findIndicatorByIdStation(stationId)
    stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
      "Indicator",
    ])

    await Promise.all(
      stationIndicatorsData.map(async (indicator) => {
        // monitoringData[indicator.indicatorName] = await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(stationId, indicator.indicatorName, '2019-12-18 00:00:22', '2019-12-21 00:00:22')
        monitoringData[indicator.indicatorName] =
          await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
            stationId,
            indicator.indicatorName,
            startTime,
            endTime
          )
        monitoringData[indicator.indicatorName] = monitoringData[
          indicator.indicatorName
        ].map((data) => {
          return {
            name: func.convertToNormalDate(data.name),
            value: data.value,
            indicator: data.indicator,
          }
        })
      })
    )

    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorData = monitoringData
    res.send(data)
  })

  router.get("/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      const { startTime, endTime } = req.query

      let accessToken = req.headers.authorization
      if (accessToken === undefined) return res.sendStatus(400)
      await app.Authentication.fetchUserInfoByAccessToken(accessToken)

      let filter = await getFilterStation(managerId)
      let data = {}
      if (filter.station.length > 0) {
        data = await getChartData(filter, startTime, endTime)
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/type/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      const { monitoringType, startTime, endTime } = req.query
      let filter = await getFilterStationByType(managerId, monitoringType)
      let data = {}
      if (filter.station.length > 0) {
        data = await getChartData(filter, startTime, endTime)
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/group/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      const { monitoringGroup, startTime, endTime } = req.query
      let filter = await getFilterStationByGroup(managerId, monitoringGroup)
      let data = {}
      if (filter.station.length > 0) {
        data = await getChartDataByGroup(filter, startTime, endTime)
      }
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/station/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      let { stationId, startTime, endTime } = req.query
      startTime = moment(startTime).utc(7).format()
      endTime = moment(endTime).utc(7).format()
      // console.log({stationId, startTime, endTime })
      let data = {}
      data = await getChartDataByStation(stationId, startTime, endTime)
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getData/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      let { stationId, startTime, endTime, limit, page } = req.query
      startTime = moment(startTime).utc(7).format()
      endTime = moment(endTime).utc(7).format()
      let data = {}
      data = await getData(
        stationId,
        startTime,
        endTime,
        parseInt(limit),
        parseInt(page)
      )
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getChartData/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      let { stationId, startTime, endTime, page, limit } = req.query
      startTime = moment(startTime).utc(7).format()
      endTime = moment(endTime).utc(7).format()
      let data = {}
      data = await getIndicatorData(stationId, startTime, endTime, page, limit)
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}

const getChartData = async (filter, startTime, endTime) => {
  let thresholdInfoData = []
  let stationIndicatorsData = []
  let stationInfo = []
  let monitoringData = {}

  if (filter.station.length > 0) {
    let stationId = filter.station[0].key
    stationInfo = await app.Station.findBasicStationInfo({ id: stationId })
    let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
    // console.log('ahihi', latestSentAt)
    stationInfo[0].latestSentAt = latestSentAt
    // console.log(stationInfo)

    thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({
      monitoringGroupId: stationInfo[0].monitoringGroupId,
    })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])

    stationIndicatorsData =
      await app.StationIndicators.findIndicatorByIdStation(stationId)
    stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
      "Indicator",
    ])

    if (stationIndicatorsData.length) {
      await Promise.all(
        stationIndicatorsData.map(async (indicator) => {
          monitoringData[indicator.indicatorName] =
            await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
              stationId,
              indicator.indicatorName,
              startTime,
              endTime
            )

          monitoringData[indicator.indicatorName] = monitoringData[
            indicator.indicatorName
          ].map((data) => {
            return {
              name: func.convertToNormalDate(data.name),
              value: data.value,
              indicator: data.indicator,
            }
          })
          // console.log(monitoringData[indicator.indicatorName] )
        })
      )
    }
  }
  filter.monitoringGroup.unshift({ key: "ALL", value: "Tất cả" })
  return {
    indicatorThresholds: thresholdInfoData,
    monitoringType: filter.monitoringType,
    defaultMonitoringType: filter.defaultMonitoringType,
    monitoringGroup: filter.monitoringGroup,
    stationName: filter.station,
    stationInfo: stationInfo,
    stationIndicators: stationIndicatorsData,
    indicatorData: monitoringData,
  }
}

const getChartDataByGroup = async (filter, startTime, endTime) => {
  let monitoringData = {}
  let thresholdInfoData = []
  let stationInfo = []
  let stationIndicatorsData = []

  if (filter.station.length > 0) {
    let stationId = filter.station[0].key
    stationInfo = await app.Station.findBasicStationInfo({ id: stationId })
    let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
    // console.log('ahihi', latestSentAt)
    stationInfo[0].latestSentAt = latestSentAt
    // console.log(stationInfo)

    thresholdInfoData = await app.IndicatorThreshold.findThresholdByCondition({
      monitoringGroupId: stationInfo[0].monitoringGroupId,
    })
    thresholdInfoData = func.eleminateNestedField(thresholdInfoData, [
      "Indicator",
      "MonitoringGroup",
    ])

    stationIndicatorsData =
      await app.StationIndicators.findIndicatorByIdStation(stationId)
    stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
      "Indicator",
    ])

    if (stationIndicatorsData.length) {
      await Promise.all(
        stationIndicatorsData.map(async (indicator) => {
          monitoringData[indicator.indicatorName] =
            await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
              stationId,
              indicator.indicatorName,
              startTime,
              endTime
            )
          monitoringData[indicator.indicatorName] = monitoringData[
            indicator.indicatorName
          ].map((data) => {
            return {
              name: func.convertToNormalDate(data.name),
              value: data.value,
              indicator: data.indicator,
            }
          })
        })
      )
    }
  }
  return {
    stationName: filter.station,
    stationInfo: stationInfo,
    stationIndicators: stationIndicatorsData,
    indicatorThresholds: thresholdInfoData,
    indicatorData: monitoringData,
  }
}

const getChartDataByStation = async (stationId, startTime, endTime) => {
  let monitoringData = {}
  let stationInfo = await app.Station.findStationInfoByCondition(
    { id: stationId },
    ["id", "latestSentAt"]
  )
  let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
  stationInfo[0].latestSentAt = latestSentAt
  // console.log(stationInfo)

  // let monitoringDataInfo = await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(stationId,'2019-12-18 00:00:22', '2019-12-19 00:00:22')
  // monitoringDataInfo = func.eleminateNestedField(monitoringDataInfo, ['Station'])

  let stationIndicatorsData =
    await app.StationIndicators.findIndicatorByIdStation(stationId)
  stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, [
    "Indicator",
  ])

  await Promise.all(
    stationIndicatorsData.map(async (indicator) => {
      // monitoringData[indicator.indicatorName] = await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(stationId, indicator.indicatorName, '2019-12-18 00:00:22', '2019-12-21 00:00:22')
      monitoringData[indicator.indicatorName] =
        await app.MonitoringDataInfo.findMonitoringDataInfoByRawQuery(
          stationId,
          indicator.indicatorName,
          startTime,
          endTime
        )
      monitoringData[indicator.indicatorName] = monitoringData[
        indicator.indicatorName
      ].map((data) => {
        return {
          name: func.convertToNormalDate(data.name),
          value: data.value,
          indicator: data.indicator,
        }
      })
    })
  )

  return {
    stationInfo: stationInfo,
    stationIndicators: stationIndicatorsData,
    indicatorData: monitoringData,
  }
}

const getData = async (stationId, startTime, endTime, limit, page) => {
  let monitoringData = {}
  const indicators = await app.StationIndicators.findIndicator(stationId)
  const arrSymbolIndicators = indicators.map((item) => item.name)
  const arrIndicatorIds = indicators.map((item) => item.id)
  const stationInfo = await app.Station.getStationAttributes(stationId, [
    "id",
    "name",
    "monitoringGroupId",
  ])
  const latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
  const thresholds = await app.IndicatorThreshold.getStationThreshold(
    stationInfo?.monitoringGroupId,
    arrIndicatorIds
  )
  const totalData = await app.MonitoringDataInfo.getTotalData(
    stationId,
    startTime,
    endTime
  )
  await Promise.all(
    arrSymbolIndicators.map(async (indicator) => {
      const data = await app.MonitoringDataInfo.getIndicatorData(
        stationId,
        indicator,
        startTime,
        endTime,
        limit,
        page
      )
      monitoringData[indicator] = checkOverThreshold(
        indicator,
        data,
        thresholds
      )
    })
  )
  return {
    ...stationInfo,
    latestSentAt,
    indicators,
    totalData,
    indicatorData: monitoringData,
  }
}

const getIndicatorData = async (stationId, startTime, endTime, page, limit) => {
  let monitoringData = {}
  const indicators = await app.StationIndicators.findIndicator(stationId)
  const arrSymbolIndicators = indicators.map((item) => item.name)
  const arrIndicatorIds = indicators.map((item) => item.id)
  const stationInfo = await app.Station.getStationAttributes(stationId, [
    "id",
    "name",
    "monitoringGroupId",
  ])
  const latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)
  const thresholds = await app.IndicatorThreshold.getStationThreshold(
    stationInfo?.monitoringGroupId,
    arrIndicatorIds
  )
  // let monitoringData = await app.MonitoringDataInfo.getMonitoringData(stationId, startAt, endAt)
  await Promise.all(
    arrSymbolIndicators.map(async (indicator) => {
      const data = await app.MonitoringDataInfo.getIndicatorData(
        stationId,
        indicator,
        startTime,
        endTime
      )
      monitoringData[indicator] = checkOverThreshold(
        indicator,
        data,
        thresholds
      )
    })
  )
  return {
    ...stationInfo,
    latestSentAt,
    indicators,
    data: monitoringData,
  }
}

const checkOverThreshold = (indicator, data, thresholds) => {
  let newData = data.map((item) => {
    let index = _.findIndex(
      thresholds,
      (threshold) => threshold.symbol === indicator
    )
    if (index > -1) {
      const lowerLimit = thresholds[index].lowerLimit
      const upperLimit = thresholds[index].upperLimit
      if (item.value < lowerLimit || item.value > upperLimit) {
        // if over threshold
        return {
          ...item,
          isOverThreshold: true,
          color: "red",
        }
      } else {
        // if not over threshold
        return {
          ...item,
          isOverThreshold: false,
          color: "green",
        }
      }
    } else {
      // if cannot find threshold
      return {
        ...item,
        isOverThreshold: false,
        color: "blue",
      }
    }
  })

  return newData
}
