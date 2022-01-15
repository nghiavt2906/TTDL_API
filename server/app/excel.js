import HttpStatus from "http-status-codes"
import Logger from 'lib/logger'
import models from "models"
import ExcelJs from 'exceljs'
import _ from 'lodash'
import app from 'app'
import { newId } from "models/utils"
import {isNumber} from 'utils/functions'
import moment from 'moment'
import { nextTick } from "async"


const xlsxProperties = {
  headers : {
    stationCodeTitle: 'MaDiem',
    sampleTypeTitle: 'LoaiMau',
    dateTitle : 'Ngay',
    hourTitle : 'Gio',
    minTitle: 'Phut',
    noteTitle: 'GhiChu',
  }
}

class Excel {
  constructor() {}

  readFileExcel = async (filePath) => {
    try{
      let result = ''
      let workbook = new ExcelJs.Workbook()
      let parseWorkbook = await workbook.xlsx.readFile(filePath)
      let workSheet = parseWorkbook.worksheets[0]
      let headers = this.getXlsxHeader(parseWorkbook.worksheets[0])
      let rowUnit = workSheet.getRow(2)
      // console.log({headers})
      let stationSymbolCol = this.getHeaderCol(headers, xlsxProperties.headers.stationCodeTitle)
      let dateCol = this.getHeaderCol(headers, xlsxProperties.headers.dateTitle)
      let hourCol = this.getHeaderCol(headers, xlsxProperties.headers.hourTitle)
      let minCol = this.getHeaderCol(headers, xlsxProperties.headers.minTitle)
      let noteCol = this.getHeaderCol(headers, xlsxProperties.headers.noteTitle)
      let sampleTypeCol = this.getHeaderCol(headers, xlsxProperties.headers.sampleTypeTitle)
      let indicators = []
      let dataId = []
      let newId1 = ''
      let stations = this.getStationSymbol(workSheet.getColumn(stationSymbolCol))
      // console.log({stations})
      let infoStation = await this.getInfoStation(stations)
      // console.log(infoStation)
      let data = []

      for(let colData = noteCol; colData <= workSheet.actualColumnCount; colData ++ ){
        // console.log('ahihi', headers[colData])
        if(headers[colData] !== undefined) {
          indicators.push(headers[colData].title)
        }
      }
      workSheet.eachRow({includeEmpty: true}, (row, rowNum) => {
        let indicatorData = []
        // if(rowNum < 4 ){
        //   console.log(row.values[stationSymbolCol], row.values[dateCol], row.values[hourCol], row.values[minCol])
  
        // }
        let index = _.findIndex(infoStation, (station) => {
          return station.symbol === row.values[stationSymbolCol]
        })
        if(index > -1 && this.formatTime(row.values[dateCol], row.values[hourCol], row.values[minCol]) !== undefined){
          // console.log(`${row.values[stationSymbolCol]} ${row.values[dateCol]} ${row.values[hourCol]}:${row.values[minCol]}:00`, infoStation[index].id)
          for(let colData = noteCol; colData <= workSheet.actualColumnCount; colData ++ ){
            // if(!isNaN(parseFloat(row.values[colData]))){ //validate indicator value is float or not
            if(isNumber(row.values[colData])){ //validate indicator value is float or not
              indicatorData.push({
                id : newId(),
                indicator: headers[colData -1].title,
                value: row.values[colData],
                unit: rowUnit.values[colData] || null,
                sensorStatus: '01'
              })
            }
          }
          // console.log(indicatorData)
          newId1 = newId()
          dataId.push(newId1)
          data.push({
            // id : newId(),
            id : newId1,
            stationId : infoStation[index].id,
            sampleType : row.values[sampleTypeCol],
            location: null,
            battery: null,
            monitoringContent : null,
            sentAt : this.formatTime(row.values[dateCol], row.values[hourCol], row.values[minCol]),
            isFtpdata : 2,
            MonitoringData : indicatorData
          })
        }
  
      })
      // console.log(dataId)
      await app.MonitoringDataInfo.createManualData(data)
      // infoStation.map((item, index) => {
      //   result = (index === 0) ? `${result}${item.dataValues.name} (${item.dataValues.symbol})` : `${result}, ${item.dataValues.name} (${item.dataValues.symbol})`
      // })
      // console.log('=====>', `Những trạm ${result} đã được đồng bộ thành công. Những trạm khác có mã trạm bị sai!`)
      return {dataId, indicators}      
    } catch (error) {
      console.log(error)
      // throw(error)
      throw { status: HttpStatus.BAD_REQUEST, id: "api.manualdata.file_fomart.invalid", messages: "File gửi lên không đúng cấu trúc" }
    }

  }

  getXlsxHeader = (workSheet) => {
    let headers = []
    let headerRow = workSheet.getRow(1)
    headerRow.eachCell((cell, col) => {
      // console.log(cell.value)
      if(typeof cell.value === 'string'){
        headers.push({
          title: cell.value,
          col : col
        })
      } else {
        throw { status: HttpStatus.BAD_REQUEST, id: "api.manualdata.file_fomart.invalid", messages: `Header của cột ${col} sai format!` }
      }
      
    })
    return headers    
  }

  getStationSymbol = (stationCol) => {
    let stations = []
    stationCol.eachCell((cell, rowNum) => {
      // console.log(cell.value, stations.indexOf(cell.value))
      if(cell.value !== null && rowNum > 1 && stations.indexOf(cell.value) === -1){
        stations.push(cell.value)
      }
    })
    return stations
  }
  
  getInfoStation = async (arrayStationSymbol) => {
    return app.Station.getStationsBySymbol(arrayStationSymbol)
  }
  
  getHeaderCol = (headers, title) => {
    let index = _.findIndex(headers, (header) => {
      return header.title === title
    })
    if(index < 0) {    
      throw { status: HttpStatus.BAD_REQUEST, id: "api.manualdata.file_fomart.invalid", messages: "File gửi lên không đúng cấu trúc" }
    }
    return headers[index].col
  }
  
  formatTime  = (dateInput, hourInput, minInput) => {
    const date = (typeof dateInput === 'object') ? moment.utc(dateInput).tz('Asia/Ho_Chi_Minh').format('MM/DD/YYYY') : dateInput
    const hour = (hourInput === undefined || hourInput === null) ? '00' : ("0" + hourInput).slice(-2)
    const min = (minInput === undefined || minInput === null) ? '00' : ("0" + minInput).slice(-2)
    // console.log(date, hour, min)

    let splitDate = date.split('/')
    const day = ("0" + splitDate[1]).slice(-2)
    const month = ("0" + splitDate[0]).slice(-2)
    const year = splitDate[2]
    if(parseInt(day) < 1 || parseInt(day) > 31 || parseInt(month) < 1 || parseInt(month) > 12 || parseInt(year) <1000 || parseInt(hour) < 0 || parseInt(hour) > 59 || parseInt(min) < 0 || parseInt(min) > 59){
      return undefined
    }
    // console.log(`${month}/${day}/${year} ${hour}:${min}:00` )
    // const sentAt = `${month}/${day}/${year} ${hour}:${min}:00` 
    const sentAt = `${year}-${month}-${day}T${hour}:${min}:00Z` 
    return moment.utc(sentAt).format()
  }  
}

export default Excel