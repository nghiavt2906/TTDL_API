import fs from "fs"
import path from 'path'
import { Router } from "express"
import { isIP, isNumeric, isEmpty } from "validator"
import _ from "lodash"
import models from "models"
import { newId } from "models/utils"
import * as func from "utils/functions"
import HttpStatus from "http-status-codes"
import app from "app"
import { getIdDataByField } from "utils/functions"
import Logger from "lib/logger"
import bodyParser from 'body-parser'
import multer from 'multer'
import moment from 'moment'
import ExcelJs from 'exceljs'

const router = Router()
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'xlsx')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, newId() + '-' +file.originalname )
  }
})

var upload = multer({ storage: storage }).single('file')

export default expressRouter => {
  expressRouter.use("/dulieuthucong", router)

  router.post("/:managerId", async (req, res, next) => {
    try {
      // console.log(req)
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'upload_data')

      upload(req, res, async (err) => {
        try {
          if (err instanceof multer.MulterError) {
            console.log('err1', err)
              return res.status(500).json(err)
          } else if (err) {
            console.log('err2', err)
              return res.status(500).json(err)
          } 
          let data = {}
          const filePath = './xlsx/' + req.file.filename
          const result = await app.Excel.readFileExcel(filePath)
          let monitoringData = await app.MonitoringDataInfo.searchManualDataById(result.dataId)
          monitoringData = func.convertMonitoringData(monitoringData)
          const stationIndicator = result.indicators.map((item, index) => { return {id: index, symbol: item, unit : ''}})

          data.monitoringData = monitoringData
          data.stationIndicator = stationIndicator
          data.dataId = result.dataId
          // console.log(monitoringData)
          return res.send(data)
        } catch (error) {
          console.log('herre...', error)
          next(error)
        }
      })
    } catch (error) {
      console.log('herre...', error)
      next(error)
    }
  })

  router.get("/search/:stationId", async (req, res, next) => {
    try {
      let data = {}
      const {stationId} = req.params
      let {startTime, endTime} = req.query
      // console.log(moment.utc(startTime).tz('Asia/Ho_Chi_Minh').format())
      startTime = moment.utc(startTime).tz('Asia/Ho_Chi_Minh').format()
      endTime = moment.utc(endTime).tz('Asia/Ho_Chi_Minh').format()
      let monitoringData= await app.MonitoringDataInfo.searchManualData(stationId, startTime, endTime)
      monitoringData = func.convertMonitoringData(monitoringData)
      const stationIndicator = await app.StationIndicators.getStationIndicators(stationId)
      data.monitoringData = monitoringData
      data.stationIndicator = stationIndicator
      res.send(data)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/deleteAll/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'upload_data')

      const {dataId} = req.body
      // console.log(dataId)
      await app.MonitoringDataInfo.deleteDataById(dataId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // router.delete("/getResult", async (req, res, next) => {
  //   try {
  //     let data = {}
  //     const {dataId} = req.query
  //     let monitoringData = await app.MonitoringDataInfo.searchManualDataById(dataId)
  //     monitoringData = func.convertMonitoringData(monitoringData)
  //     const stationIndicator = result.indicators.map((item, index) => { return {id: index, symbol: item, unit : ''}})

  //     data.monitoringData = monitoringData
  //     data.stationIndicator = stationIndicator
  //     data.dataId = result.dataId
  //     // console.log(monitoringData)
  //     return res.send(data)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // })

  router.get("/filemau", async (req, res, next) => {
    try {
      // console.log(path.join(__dirname,'./xlsx/Filemau_Quantrac.xlsx'))
      // res.sendFile(path.join(__dirname,'./xlsx/Filemau_Quantrac.xlsx'))
      // const pathFile = path.join(__dirname,'./xlsx/Filemau_Quantrac.xlsx')
      const pathFile = './xlsx/Filemau_Quantrac.xlsx'
      const file = fs.createWriteStream(pathFile)
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=' + 'Filemau_Quantrac.xlsx');
      res.download('./xlsx/Filemau_Quantrac.xlsx')

      // let workbook = new ExcelJs.Workbook()

      // var parserWorkbook = await workbook.xlsx.readFile('./xlsx/Filemau_Quantrac.xlsx')
      
      // res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
      // parserWorkbook.xlsx.write(res)
      //   .then(function (data) {
      //     res.end();
      //     console.log('File write done........');
      //   });
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get('/createExcel', function (req, res, next) {
    var workbook = new ExcelJs.Workbook();
  
    workbook.creator = 'Trung tam Quan trac TPHCM';
    workbook.created = new Date();
  
    workbook.views = [
      {
        x: 0, y: 0, width: 10000, height: 20000,
        firstSheet: 0, activeTab: 1, visibility: 'visible'
      }
    ];
    var worksheet = workbook.addWorksheet('Solieu_Quantrac');
    worksheet.columns = [
      { header: 'MaDiem', key: 'stationCode', width: 20, bold : true },
      { header: 'Ngay', key: 'date', width: 20 },
      { header: 'Gio', key: 'hour', width: 10 },
      { header: 'Phut', key: 'min', width: 10 },
      { header: 'LoaiMau', key: 'sampleType', width: 20 },
      { header: 'Ghichu', key: 'note', width: 20 },
      { header: 'pH', key: 'stationCode', width: 10 },
      { header: 'NH4', key: 'date', width: 10 },
      { header: 'DO', key: 'hour', width: 10 },
      { header: 'COD', key: 'stationCode', width: 10 },
      { header: 'Cu', key: 'date', width: 10 },
      { header: 'Pb', key: 'hour', width: 10 },
      { header: 'Cd', key: 'stationCode', width: 10 },
      { header: 'As', key: 'date', width: 10 },
      { header: 'Hg', key: 'hour', width: 10 },
      { header: 'Oil', key: 'stationCode', width: 10 },
      { header: 'Coliform', key: 'date', width: 10 }
    ];
  
    worksheet.addRow(['','','','','','','','','mg/l','mg/l','','','ppd','','','mg/l','MPN/100 ml']);
    worksheet.addRow(['NNVINAMILKG3','16/04/2018','10','12','Nước biển','','7.6','0.02','4.1','1.2','0','0','0','0','0','0','200'])
    worksheet.addRow(['NNVINAMILKG3','16/04/2018','12','19','Nước biển','','7.9','0.1','5.0','1.5','0','0','0','0','0','0','140'])
  
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Filemau_Quantrac.xlsx");
    workbook.xlsx.write(res)
      .then(function (data) {
        res.end();
        // console.log('File write done........');
      });
  });
}