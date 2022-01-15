import { Router } from "express"
import models from "models"
import { analyzeFilter } from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import app from "app"
import { reportType } from "constant/filter"
import { getStationIndicators } from "app/utils"
import _ from "lodash"
import config from "configs"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

const STATUS_FILTER = [
  {
    id: "NORMAL",
    name: "Hoạt động bình thường",
  },
  {
    id: "OVER_THRESHOLD",
    name: "Vượt ngưỡng",
  },
  {
    id: "DISCONNECT",
    name: "Mất kết nối",
  },
  {
    id: "BROKEN_DEVICE",
    name: "Thiết bị hỏng",
  },
]

export default (expressRouter) => {
  expressRouter.use("/filter", router)

  router.get("/type/:typeId", async (req, res, next) => {
    try {
      let data = {}
      let { typeId } = req.params
      let monitoringType = await app.MonitoringType.getMonitoringType()
      let monitoringGroup = await app.MonitoringGroup.getMonitoringGroupName(
        typeId
      )
      let stationNameData = await models.Station.findAll({
        where: { monitoringType: typeId, publicStatus: 1 },
        attributes: ["id", "name"],
      })
      let district = await app.District.getDistrictName()
      data.monitoringType = monitoringType
      data.monitoringGroup = monitoringGroup
      data.station = stationNameData
      data.district = district
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getGroupByType/:typeId", async (req, res, next) => {
    try {
      let data = {}
      let { typeId } = req.params
      let monitoringGroup = await app.MonitoringGroup.getMonitoringGroupName(
        typeId
      )
      let stationNameData = await models.Station.findAll({
        where: { monitoringType: typeId, publicStatus: 1 },
        attributes: ["id", "name"],
      })
      data.monitoringGroup = monitoringGroup
      data.station = stationNameData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/district", async (req, res, next) => {
    try {
      let data = {}
      let district = await app.District.getDistrictName()
      data.district = district
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStationByGroup/:groupId", async (req, res, next) => {
    try {
      let data = {}
      let { groupId } = req.params
      let stationNameData = await models.Station.findAll({
        where: { monitoringGroupId: groupId, publicStatus: 1 },
        attributes: ["id", "name"],
      })
      data.station = stationNameData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStationByDistrict/:districtId", async (req, res, next) => {
    try {
      let data = {}
      let { districtId } = req.params
      let stationNameData = await models.Station.findAll({
        where: { districtId: districtId, publicStatus: 1 },
        attributes: ["id", "name"],
      })
      data.station = stationNameData
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get(
    "/getStationByGroupDistrict/:groupId/:districtId",
    async (req, res, next) => {
      try {
        let data = {}
        let { groupId, districtId } = req.params
        let stationNameData = await models.Station.findAll({
          where: {
            monitoringGroupId: groupId,
            districtId: districtId,
            publicStatus: 1,
          },
          attributes: ["id", "name"],
        })
        data.station = stationNameData
        res.send(data)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get("/getStation", async (req, res, next) => {
    try {
      let data = {}
      let stationNameData = []
      let { monitoringType, monitoringGroup, district } = req.query
      if (
        monitoringType === undefined ||
        monitoringGroup === undefined ||
        district === undefined
      ) {
        res.sendStatus(400)
      } else {
        if (monitoringGroup === "ALL") {
          if (district === "ALL") {
            stationNameData = await models.Station.findAll({
              where: { monitoringType: monitoringType, publicStatus: 1 },
              attributes: ["id", "name"],
            })
          } else {
            stationNameData = await models.Station.findAll({
              where: {
                monitoringType: monitoringType,
                districtId: district,
                publicStatus: 1,
              },
              attributes: ["id", "name"],
            })
          }
        } else {
          if (district === "ALL") {
            stationNameData = await models.Station.findAll({
              where: { monitoringGroupId: monitoringGroup, publicStatus: 1 },
              attributes: ["id", "name"],
            })
          } else {
            stationNameData = await models.Station.findAll({
              where: {
                monitoringGroupId: monitoringGroup,
                districtId: district,
                publicStatus: 1,
              },
              attributes: ["id", "name"],
            })
          }
        }
        data.station = stationNameData
        res.send(data)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // Admin
  router.get("/typeByManagerId/:typeId/:managerId", async (req, res, next) => {
    try {
      let data = {}
      let { typeId, managerId } = req.params
      let monitoringType = await app.MonitoringType.getMonitoringType()
      let monitoringGroup = await app.MonitoringGroup.getMonitoringGroupName(
        typeId
      )
      let stationNameData = await app.ManagerStation.getListStationByManagerId(
        managerId,
        { monitoringType: typeId }
      )
      let district = await app.District.getDistrictName()
      data.monitoringType = monitoringType
      data.monitoringGroup = monitoringGroup
      data.station = stationNameData
      data.district = district
      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStationByManagerId/:managerId", async (req, res, next) => {
    try {
      let data = {}
      let stationNameData = []
      const { managerId } = req.params
      let { monitoringType, monitoringGroup, district } = req.query
      if (
        monitoringType === undefined ||
        monitoringGroup === undefined ||
        district === undefined
      ) {
        res.sendStatus(400)
      } else {
        if (monitoringGroup === "ALL") {
          if (district === "ALL") {
            stationNameData =
              await app.ManagerStation.getListStationByManagerId(managerId, {
                monitoringType: monitoringType,
              })
          } else {
            stationNameData =
              await app.ManagerStation.getListStationByManagerId(managerId, {
                monitoringType: monitoringType,
                districtId: district,
              })
          }
        } else {
          if (district === "ALL") {
            stationNameData =
              await app.ManagerStation.getListStationByManagerId(managerId, {
                monitoringGroupId: monitoringGroup,
              })
          } else {
            stationNameData =
              await app.ManagerStation.getListStationByManagerId(managerId, {
                monitoringGroupId: monitoringGroup,
                districtId: district,
              })
          }
        }
        data.station = stationNameData
        res.send(data)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/report/type/:typeId", async (req, res, next) => {
    try {
      let data = {}
      let { typeId } = req.params
      let selectedIndicator = []
      let monitoringType = await app.MonitoringType.getMonitoringType()
      let monitoringGroup = await app.MonitoringGroup.getMonitoringGroupName(
        typeId
      )
      let stationNameData = await models.Station.findAll({
        where: { monitoringType: typeId },
        attributes: ["id", "name"],
        order: [['name', 'ASC']]
      })
      let district = await app.District.getDistrictName()
      let indicator = await app.Indicator.getIndicatorByCondition(
        { monitoringType: typeId },
        ["id", ["symbol", "name"], "unit"]
      )
      if (stationNameData.length > 0) {
        let stationId = [stationNameData[0].id]
        // selectedIndicator = await app.StationIndicators.findIndicator(stationId)
        // let stationId = stationNameData.map(item => {return item.id})
        selectedIndicator = await app.StationIndicators.findIndicator(stationId)
        selectedIndicator = getStationIndicators(selectedIndicator)
      }
      data.reportType = reportType
      data.monitoringType = monitoringType
      data.monitoringGroup = monitoringGroup
      data.station = stationNameData
      data.district = district
      data.indicator = indicator
      data.selectedIndicator = selectedIndicator
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/report/getIndicator/:stationId", async (req, res, next) => {
    try {
      let data = {}
      let { stationId } = req.params
      let selectedIndicator = []
      selectedIndicator = await app.StationIndicators.findIndicator(stationId)
      data.selectedIndicator = selectedIndicator
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get(
    "/report/getStationByManagerId/:managerId",
    async (req, res, next) => {
      try {
        let data = {}
        let stationNameData = []
        let selectedIndicator = []
        const { managerId } = req.params
        let { monitoringType, monitoringGroup, district } = req.query
        if (
          monitoringType === undefined ||
          monitoringGroup === undefined ||
          district === undefined
        ) {
          res.sendStatus(400)
        } else {
          if (monitoringGroup === "ALL") {
            if (district === "ALL") {
              stationNameData =
                await app.ManagerStation.getListStationByManagerId(managerId, {
                  monitoringType: monitoringType,
                })
            } else {
              stationNameData =
                await app.ManagerStation.getListStationByManagerId(managerId, {
                  monitoringType: monitoringType,
                  districtId: district,
                })
            }
          } else {
            if (district === "ALL") {
              stationNameData =
                await app.ManagerStation.getListStationByManagerId(managerId, {
                  monitoringGroupId: monitoringGroup,
                })
            } else {
              stationNameData =
                await app.ManagerStation.getListStationByManagerId(managerId, {
                  monitoringGroupId: monitoringGroup,
                  districtId: district,
                })
            }
          }

          if (stationNameData.length > 0) {
            // let stationId = stationNameData[0].id
            // selectedIndicator = await app.StationIndicators.findIndicator(stationId)
            let stationId = stationNameData.map((item) => {
              return item.id
            })
            selectedIndicator = await app.StationIndicators.findIndicator(
              stationId
            )
            selectedIndicator = getStationIndicators(selectedIndicator)
          }
          data.station = stationNameData
          data.selectedIndicator = selectedIndicator
          res.send(data)
        }
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get("/getAll/:managerId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      const monitoringType = await app.ManagerStation.getListMonitoringType(managerId)
      const checkExistQtn = _.findIndex(monitoringType, (item) => item.id === "QTN")
      const selectedMonitoringType = checkExistQtn > -1 ? monitoringType[checkExistQtn] : monitoringType[0]
      const typeId = selectedMonitoringType.id
      const monitoringGroup = await app.MonitoringGroup.getMonitoringGroupByType(typeId)
      const district = await app.District.getDistrictName()
      const station = await app.ManagerStation.getListStation(managerId, { monitoringType: typeId })
      res.send({
        monitoringType,
        monitoringGroup,
        district,
        station,
        status: STATUS_FILTER,
        selectedMonitoringType,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      const { monitoringType, monitoringGroup, district, status } = req.query
      const data = await getFilterByCondition(
        managerId,
        monitoringType,
        monitoringGroup,
        district,
        status
      )

      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getByType/:managerId/:typeId", async (req, res, next) => {
    try {
      let { managerId } = req.params
      const monitoringGroup =
        await app.MonitoringGroup.getMonitoringGroupByType(typeId)
      const district = await app.District.getDistrictName()
      const station = await app.ManagerStation.getListStation(managerId, {
        monitoringType: typeId,
      })

      res.send({
        monitoringGroup,
        district,
        station,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getByGroup/:managerId/:groupId", async (req, res, next) => {
    try {
      let { managerId, groupId } = req.params
      const station = await app.ManagerStation.getListStation(managerId, {
        monitoringGroupId: groupId,
      })
      res.send({
        station,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get(
    "/getByDistrict/:managerId/:districtId",
    async (req, res, next) => {
      try {
        let { managerId, districtId } = req.params
        const station = await app.ManagerStation.getListStation(managerId, {
          districtId,
        })
        res.send({
          station,
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get(
    "/getByGroupDistrict/:managerId/:groupId/:districtId",
    async (req, res, next) => {
      try {
        let { managerId, groupId, districtId } = req.params
        const station = await app.ManagerStation.getListStation(managerId, {
          monitoringGroupId: groupId,
          districtId,
        })
        res.send({
          station,
        })
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )
}

const getFilterByCondition = async (
  managerId,
  typeId,
  groupId,
  districtId,
  statusId
) => {
  if (groupId != "ALL") {
    if (districtId === "ALL") {
      // GetByGroup
      const statusCondition = getStatusCondition(statusId)
      const station = await app.ManagerStation.getStationListByCondition(
        managerId,
        {
          monitoringGroupId: groupId,
        },
        statusCondition
      )
      return { station }
    } else {
      //GetByGroupDistrict
      const statusCondition = getStatusCondition(statusId)
      const station = await app.ManagerStation.getStationListByCondition(
        managerId,
        {
          monitoringGroupId: groupId,
          districtId,
        },
        statusCondition
      )
      return { station }
    }
  } else {
    if (districtId !== "ALL") {
      // GetByDistrict
      const statusCondition = getStatusCondition(statusId)
      const station = await app.ManagerStation.getStationListByCondition(
        managerId,
        {
          districtId,
        },
        statusCondition
      )
      return { station }
    } else {
      // GetByType
      const statusCondition = getStatusCondition(statusId)
      const monitoringGroup =
        await app.MonitoringGroup.getMonitoringGroupByType(typeId)
      const district = await app.District.getDistrictName()
      const station = await app.ManagerStation.getStationListByCondition(
        managerId,
        {
          monitoringType: typeId,
        },
        statusCondition
      )
      console.log(station)
      return { monitoringGroup, district, station, status: STATUS_FILTER }
    }
  }
}

const getStatusCondition = (statusId) => {
  switch (statusId) {
    case "ALL":
      return null
    case "OVER_THRESHOLD":
      return { isOverThreshold: 1 }
    case "NORMAL":
      return { isDisconnect: 0 }
    case "DISCONNECT":
      return { isDisconnect: 1 }
    case "BROKEN_DEVICE":
      return { isBrokenDevice: 1 }
    default:
      return null
  }
}
