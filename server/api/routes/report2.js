import app from "app"
import models from "models"
import { Router } from "express"
import bodyParser from "body-parser"
import moment from "moment"
import {
  reformatIndicatorReport,
  convertToNormalDate,
  analyzeCondition,
  convertMonitoringData,
  reformatDataReport,
  convertStationMonitoringData
} from "app/utils"
import ExcelJs from "exceljs"
const router = Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/baocao2", router)

  router.post("/:managerId", async (req, res, next) => {
    try {
      let { stationId, startAt, endAt, page, limit } = req.body
      let data = []

      startAt = moment.utc(startAt).format()
      endAt = moment.utc(endAt).format()
      validateSpecificReport()
      data = await getMonitoringData(stationId, startAt, endAt, page, limit)

      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}

const validateSpecificReport = () => {
  return
}

const getMonitoringData = async (stationId, startAt, endAt, page, limit) => {
  try {
    console.log(startAt, endAt)
    let data = await app.MonitoringDataInfo.getStationMonitoringData(
      stationId,
      startAt,
      endAt,
      page * (limit - 1),
      limit
    )
    const stationInfo = await models.Station.findOne({
      where: { id: stationId },
      attributes: ["name", "symbol"],
      raw: true,
    })
    data = convertStationMonitoringData(stationInfo, data)
    return data
  } catch (err) {
    throw err
  }
}
