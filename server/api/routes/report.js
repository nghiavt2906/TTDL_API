import app from "app"
import {
  analyzeCondition,
  convertMonitoringData,
  reformatMonitoringData,
  convertToNormalDate,
  reformatDataReport,
  reformatIndicatorReport,
} from "app/utils"
import bodyParser from "body-parser"
import ExcelJs from "exceljs"
import { Router } from "express"
import moment from "moment"
import * as fs from 'fs';
import { TemplateHandler } from 'easy-template-x';

const router = Router()
import HttpStatus from "http-status-codes"


export default (expressRouter) => {
  expressRouter.use("/baocao", router)

  router.post("/", async (req, res, next) => {
    try {
      const { stationId, startAt, endAt, page, limit } = req.body
      const data = await getPaginationSpecificData(
        stationId,
        startAt,
        endAt,
        page,
        limit
      )
      // const diffTime = Math.abs(new Date(endAt) - new Date(startAt))
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      // if (diffDays > 31){
      //   throw { status: HttpStatus.BAD_REQUEST, id: "api.report", messages: "Chỉ tìm kiếm được trong khoảng thời gian nhỏ hơn 31 ngày. Vui lòng chọn lại khoảng thời gian!" }
      // }
      const totalData = await app.MonitoringDataInfo.getTotalData(
        stationId,
        startAt,
        endAt
      )
      res.json({
        data,
        totalData,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getData", async (req, res, next) => {
    try {
      // console.log(req.query)
      let {
        reportType,
        monitoringType,
        monitoringGroup,
        district,
        station,
        startAt,
        endAt,
      } = req.query

      const condition = analyzeCondition(
        monitoringType,
        monitoringGroup,
        district,
        station
      )
      startAt = moment.utc(startAt).tz("Asia/Ho_Chi_Minh").format()
      endAt = moment.utc(endAt).tz("Asia/Ho_Chi_Minh").format()
      // const timeSubtract = Math.abs(endAt - startAt)
      const timeSubtract = moment(endAt).diff(moment(startAt), "minutes")

      const stationCount = await app.Station.getCountData(
        condition,
        startAt,
        endAt
      )
      const stationDuration = await app.Station.getDataDuration(condition)
      const data = reformatDataReport(
        stationCount,
        stationDuration,
        timeSubtract
      )

      res.json(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/exportDocx/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "export_report")

      let data = []
      let { stationId, startAt, endAt } = req.body

      const startAtStr = moment(startAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss")
      const endAtStr = moment(endAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss")
      let indicatorList = await app.StationIndicators.findIndicator(stationId)

      var reA = /[^a-zA-Z]/g;
      var reN = /[^0-9]/g;
      function sortColAlphaNum(a, b) {
        var aA = a.name.replace(reA, "");
        var bA = b.name.replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a.name.replace(reN, ""), 10);
          var bN = parseInt(b.name.replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      }
      indicatorList = indicatorList.sort(sortColAlphaNum)

      data = await getSpecificData(stationId, startAt, endAt)

      let monitoringDataRows = indicatorList.map(indicator => ({
        SENSOR: indicator.name,
        MAX: data[0].MonitoringData[indicator.name.toUpperCase()],
        MIN: data[0].MonitoringData[indicator.name.toUpperCase()],
        LIMIT: `${indicator.lowerLimit} to ${indicator.upperLimit}`,
        UPPERLIMIT: indicator.upperLimit,
        LOWERLIMIT: indicator.lowerLimit,
        ALARM: '',
        TIMEMAX: moment(data[0].sentAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss"),
        TIMEMIN: moment(data[0].sentAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss")
      }))

      let recordCount = 0
      for (const record of data) {
        recordCount++
        for (const row of monitoringDataRows) {
          const indicatorRecordValue = record.MonitoringData[row.SENSOR.toUpperCase()]
          if (indicatorRecordValue > row.MAX || row.MAX === undefined) {
            row.MAX = indicatorRecordValue.toFixed(3)
            row.TIMEMAX = moment(record.sentAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss")
          }
          if (indicatorRecordValue < row.MIN || row.MIN === undefined) {
            row.MIN = indicatorRecordValue.toFixed(3)
            row.TIMEMIN = moment(record.sentAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss")
          }

          if (recordCount === data.length) {
            if (row.MAX < row.LOWERLIMIT ||
              row.MAX > row.UPPERLIMIT ||
              row.MIN > row.UPPERLIMIT ||
              row.MIN < row.LOWERLIMIT
            )
              row.ALARM = 'Canh bao'
            else
              row.ALARM = 'Binh thuong'
          }
        }
      }

      const templateFile = fs.readFileSync(`${process.cwd()}/docs/report-template.docx`)
      const outputData = {
        exportTime: moment().utcOffset(7).format("DD/MM/YYYY HH:mm:ss"),
        fromTime: startAtStr,
        toTime: endAtStr,
        data: monitoringDataRows
      }

      const handler = new TemplateHandler();
      const doc = await handler.process(templateFile, outputData);

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
      res.setHeader(
        "Content-Disposition",
        `Baocao ${startAtStr} den ${endAtStr}.docx`
      )
      res.write(doc)
      res.end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/export/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "export_report")

      let workbook = new ExcelJs.Workbook()
      let data = []
      let { stationId, startAt, endAt } = req.body

      const startAtStr = moment(startAt).utc().format("DDMMYYYYHHmmss")
      const endAtStr = moment(endAt).utc().format("DDMMYYYYHHmmss")
      let indicatorList = await app.StationIndicators.findIndicator(stationId)
      indicatorList = indicatorList.map((item) => {
        return item.name
      })

      var reA = /[^a-zA-Z]/g;
      var reN = /[^0-9]/g;
      function sortColAlphaNum(a, b) {
        var aA = a.replace(reA, "");
        var bA = b.replace(reA, "");
        if (aA === bA) {
          var aN = parseInt(a.replace(reN, ""), 10);
          var bN = parseInt(b.replace(reN, ""), 10);
          return aN === bN ? 0 : aN > bN ? 1 : -1;
        } else {
          return aA > bA ? 1 : -1;
        }
      }

      indicatorList = indicatorList.sort(sortColAlphaNum)

      data = await getSpecificData(stationId, startAt, endAt)
      let excelData = data.map((item, index) => {
        let row = []
        row.push(index + 1)
        row.push(item.name)
        row.push(moment(item.sentAt).utcOffset(0).format("DD/MM/YYYY HH:mm:ss"))
        indicatorList.map((element) => {
          row.push(item.MonitoringData[element.toUpperCase()])
        })
        return row
      })
      workbook.creator = "Trung tam Quan trac Da Nang"
      workbook.created = new Date()

      workbook.views = [
        {
          x: 0,
          y: 0,
          width: 10000,
          height: 20000,
          firstSheet: 0,
          activeTab: 1,
          visibility: "visible",
        },
      ]
      var worksheet = workbook.addWorksheet("Báo cáo chi tiết")
      let headerRow = [
        { header: "STT", key: "stt", width: 8, bold: true },
        { header: "Tên trạm", key: "stationName", width: 20 },
        { header: "Thời gian", key: "sentAt", width: 20 },
      ]
      indicatorList.forEach((item) => {
        headerRow.push({
          header: item,
          key: "indicatorCode",
          width: 10,
          bold: true,
        })
      })
      worksheet.columns = headerRow

      excelData.forEach((item) => {
        worksheet.addRow(item)
      })

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      res.setHeader(
        "Content-Disposition",
        `Baocaochitiet_${startAtStr}_${endAtStr}.xlsx`
      )
      workbook.xlsx.write(res).then(function (data) {
        res.end()
        console.log("File write done........", Date.now())
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}

const getData = async (
  monitoringType,
  monitoringGroup,
  district,
  station,
  stationId,
  startAt,
  endAt
) => {
  try {
    const condition = analyzeCondition(
      monitoringType,
      monitoringGroup,
      district,
      station
    )
    // startAt = moment.utc(startAt).tz('Asia/Ho_Chi_Minh').format()
    // endAt = moment.utc(endAt).tz('Asia/Ho_Chi_Minh').format()
    startAt = moment(startAt).utcOffset(-420).format()
    endAt = moment(endAt).utcOffset(-420).format()
    // console.log(startAt, endAt)
    // const timeSubtract = Math.abs(endAt - startAt)

    const stationCount = await app.Station.getCountData(
      { id: stationId },
      startAt,
      endAt
    )
    const stationDuration = await app.Station.getDataDuration({ id: stationId })
    const data = reformatDataReport(
      stationCount,
      stationDuration,
      startAt,
      endAt
    )
    return data
  } catch (err) {
    throw err
  }
}

const getGeneralData = async (
  monitoringType,
  monitoringGroup,
  district,
  station,
  stationId,
  startAt,
  endAt,
  indicator
) => {
  try {
    const arrIndicator = indicator.map((item) => {
      // return JSON.parse(item).name
      return item.name
    })
    // const condition = analyzeCondition(monitoringType, monitoringGroup, district, station)
    const stations = await app.Station.getBasicStationInfo(stationId)
    // console.log(startAt, endAt)
    // startAt = moment.utc(startAt).format()
    // endAt = moment.utc(endAt).format()
    startAt = moment.utc(startAt).tz("Asia/Ho_Chi_Minh").format()
    endAt = moment.utc(endAt).tz("Asia/Ho_Chi_Minh").format()
    // console.log('====================', startAt, endAt)
    // startAt = moment(startAt).utcOffset(-420).format()
    // endAt = moment(endAt).utcOffset(-420).format()
    let data = await Promise.all(
      stations.map(async (item) => {
        let data = await app.MonitoringDataInfo.searchDataGeneral(
          item.id,
          arrIndicator,
          startAt,
          endAt
        )
        let newData = reformatIndicatorReport(arrIndicator, data)
        return {
          id: item.id,
          name: item.name,
          symbol: item.symbol,
          startAt: convertToNormalDate(startAt),
          endAt: convertToNormalDate(endAt),
          // startAt: startAt,
          // endAt: endAt,
          data: newData,
        }
      })
    )
    return data
  } catch (err) {
    throw err
  }
}

const getPaginationSpecificData = async (
  stationId,
  startAt,
  endAt,
  page,
  limit
) => {
  try {
    startAt = moment.utc(startAt).format()
    endAt = moment.utc(endAt).format()
    // startAt = moment(startAt).utcOffset(-420).format()
    // endAt = moment(endAt).utcOffset(-420).format()
    let data = await app.MonitoringDataInfo.searchPaginationSpecificData(
      stationId,
      startAt,
      endAt,
      page,
      limit
    )
    const stationInfo = await app.Station.getBasicStationInfo(stationId)
    data = reformatMonitoringData(data, stationInfo[0])
    // console.log(data)
    return data
  } catch (err) {
    throw err
  }
}

const getSpecificData = async (stationId, startAt, endAt) => {
  try {
    startAt = moment.utc(startAt).format()
    endAt = moment.utc(endAt).format()
    // startAt = moment(startAt).utcOffset(-420).format()
    // endAt = moment(endAt).utcOffset(-420).format()
    let data = await app.MonitoringDataInfo.searchSpecificData(
      stationId,
      startAt,
      endAt
    )
    data = convertMonitoringData(data)
    // console.log(data)
    return data
  } catch (err) {
    throw err
  }
}
