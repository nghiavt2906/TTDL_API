import _ from 'lodash'
import {newId} from 'models/utils'
import moment from 'moment'
import app from 'app'

export const changeBoleanToTinyInt = (boleanValue) => {
  if(boleanValue === true ){
    return 1
  } else {
    return 0
  }
}


export const renderStationIndicatorData = (idStation, arrayIndicators) => {
  let newData = []
  newData = arrayIndicators.map(indicator => {
    return {
      id : newId(),
      idStation : idStation,
      idIndicator : indicator.value,
      status : '00'
    }
  })
  return newData
}

export const convertToNormalDate = (dataDate) => {
  if(dataDate === null || dataDate === undefined) return ''

  let localDate = new Date(dataDate).toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})

  let dateTime = localDate.split(",");

  let time = dateTime[1].substr(1, 8);
  let date = dateTime[0];
  let month = date.split("/")[0];
  let day = date.split("/")[1];
  let year = date.split("/")[2];

  if (month.length === 1) month = "0" + month;
  if (day.length === 1) day = "0" + day;
  let newDate = `${day}/${month}/${year} ${time}`
  // console.log({newDate})
  return newDate;
}

export const addIndicatorValues = (monitoringDataInfo, monitoringData, arraySensor) => {
  // console.log({monitoringDataInfo, monitoringData, arraySensor})
  let newmonitoringDataInfo = []
  newmonitoringDataInfo = monitoringDataInfo.map(dataInfo=> {
    dataInfo.sentAt = exports.convertToNormalDate(dataInfo.sentAt)
    arraySensor.map(sensor => {
      let index = _.findIndex(monitoringData, {idData : dataInfo.idData, indicator: sensor.indicatorName})
      if(index > -1){
        dataInfo[sensor.indicatorName] = monitoringData[index].value
      } else {
        dataInfo[sensor.indicatorName] = 0
      }      
    })
    return dataInfo
  })
  return newmonitoringDataInfo
}

export const changeToArrayFilter =  (beginarray, nameKey, nameValue) => {
  let newArray = []
  newArray = beginarray.map(element => {
    var newElement = element.dataValues
    newElement.key = element[nameKey]
    newElement.value = element[nameValue]
    delete newElement[nameKey]
    delete newElement[nameValue]
    return newElement
  })
  return newArray
}

export const changeToArrayReactSelect =  (beginarray, nameValue, nameLabel) => {
  // console.log('It go to here')
  let newArray = []
  newArray = beginarray.map(element => {
    var newElement = element.dataValues
    newElement.value = element[nameValue]
    newElement.label = element[nameLabel]
    delete newElement[nameValue]
    delete newElement[nameLabel]
    return newElement
  })
  return newArray
}

export const getValueSystem = (arrayData, field) => {
  let index = _.findIndex(arrayData, {name : field})
  if(index > -1){
    return arrayData[index]['value']
  } else {
    return ''
  }
}

export const changeNestedField = (data, tableName, oldField, newField, status) => {
  let newData = []
  newData = data.map(element => {
    let newElement = {}
    if(status) {
      newElement = element.dataValues 
    } else {
      newElement = element 
    }
    newElement[newField] = newElement[tableName][oldField]
    delete(newElement[tableName])
    return newElement
  })
  return newData
}

export const eleminateNestedField = (data, fields) => {
  let newData = []
  newData = data.map(element => {    
    let newElement = element.dataValues 
    fields.forEach((field) => {
      newElement = {...newElement, ...newElement[field].dataValues}
      delete(newElement[field])
    })
    return newElement
  })
  return newData
}

export const getIdData = (datas) => {
  let arrayIdData = datas.map(data => {
    return data.idData
  })
  return arrayIdData
}


// Convert Xml (after parse-body xml) to normal object
export const converXmlToObject = (xml,parentKey) => {
  let xmlObject = {}
  for(var key in xml[parentKey]){
    xmlObject[key] = xml[parentKey][key][0]
  }
  return xmlObject
}
// Eleminate Attributes having the same keys in array eleminateKeys in targetObject and return newObject
export const eleminateElementFromObject = (targetObject,eleminateKeys) => {
  let newObject = {} 
  for (var key in targetObject){
    if (!eleminateKeys.includes(key)){
      newObject[key] = targetObject[key]
    }
  }
  return newObject
}
// search and check in targetObject have the same keys in checkKeys array and return newObject
export const checkElementInObject = (targetObject,checkKeys) => {
  let newObject = {} 
  for (var key in targetObject){
    if (checkKeys.includes(key)){
      newObject[key] = targetObject[key]
    }
  }
  return newObject
}
export const convert_StringToDateTime = (string) => { //'20170929130707' => '13:07:07 29-09-2017'
  year = string.substring(0,4)
  month = string.substring(4,6)
  day = string.substring(6,8)
  hour = string.substring(8,10)
  min = string.substring(10,12)
  second = string.substring(12,14)

  return `${hour}:${min}:${second} ${day}-${month}-${year}`
}
export const convertToISODateFormat = (stringNomalDate) => { //13:07:07 29-09-2017 => 13:07:07 09-29-2017
  var stringDate = stringNomalDate
  stringDate = stringDate.split(' ')
  stringDate[1] = stringDate[1].split('/')
  stringDate[1] = `${stringDate[1][1]}-${stringDate[1][0]}-${stringDate[1][2]}`
  stringDate = stringDate.join(' ')
  return new Date(stringDate)
}
export const convertTimeToISOFormat = (stringNomalDate) => { // 20170929130811 => 13:08:11 09-29-2017
  let newDate = `${stringNomalDate.substr(8,2)}:${stringNomalDate.substr(10,2)}:${stringNomalDate.substr(12,2)} ${stringNomalDate.substr(4,2)}-${stringNomalDate.substr(6,2)}-${stringNomalDate.substr(0,4)}`
  // return new Date(newDate).toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})
  return new Date(newDate)
}
export const convertObjectToArrayQuery = (objectData, tableName, id_solieu) => {
  let arrayQuery = []
  for(var key in objectData){
    let giatriQT = objectData[key].split(' ')
    if(giatriQT.length === 1){
      giatriQT.push('')
    }
    // console.log(giatriQT)
    let ketqua = parseFloat(giatriQT[0])
    arrayQuery.push(`insert into ${tableName} set id_solieu = ${id_solieu}, chiso = '${key}', giatri_quantrac = ${ketqua}, donvi = '${giatriQT[1]}', trangthai = '00' `)
  }
  return arrayQuery
}
export const convertObjectToArrayUpdateQuery = (objectData, tableName, id_solieu) => {
  let arrayQuery = []
  for(var key in objectData){
    arrayQuery.push(`update ${tableName} set ten_chiso = '${key}', giatri_quantrac = ${objectData[key]} where id_solieu = ${id_solieu}`)
  }
  return arrayQuery
}

export const analyze_FolderName = (string) => {
  let tramInfo = {}
  string = string.split('_')
  tramInfo.loaiquantrac = string[0]
  tramInfo.tentram = string[1]
  return tramInfo
}
/*
* Description: Hàm này để chuyển các giá trị QT trong array of arrays thành array of objects
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {array} data : Array của các array data VD: data = [ ['﻿PH', '7.657', '', '20190929130707', '00\r' ],..]
*
* return {array} array of objects data 
* VD: [{tenchiso: "PH" ,
* ketqua: "7.657" ,
* donvi: "" ,
* thoigian: "20190929130707" ,
* trangthaiSensor: "00},...]
*/
export const convert_ArrayToObject = (data) => {
  return data.map(smalldata => {
      let newData = {}
      newData.tenchiso = smalldata[0]
      newData.ketqua = smalldata[1]
      newData.donvi = smalldata[2]
      newData.thoigian = smalldata[3]
      newData.trangthaiSensor = smalldata[4].substr(0,2)
      return newData
    })
}


/*
* Description: Hàm này để so sánh file gửi về và file mặc định trong DB có giống không
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} tenFileGuive : String tên file ví dụ "DNa_CENT_NUOHDX_20170929121212.txt"
* @param {string} tenFileMacdinh : String tên file ví dụ "DNa_CENT_NUOHDX_yyyyMMddhhmmss.txt"
*
* return {bolean} true nếu file gửi về giống với mặc định
*/
export const compare_Cautrucfile = (tenFileGuive, tenFileMacdinh) => {
  var fileGuive = analyze_TenFile(tenFileGuive)
  var fileMacdinh = analyze_TenFile(tenFileMacdinh)
  // console.log(fileGuive,fileMacdinh)
  if(fileGuive.loaiFile !== 'txt' || fileGuive.ten !== fileMacdinh.ten || !validate_Thoigian(fileGuive.thoigian)){
    return false
  }
  return true
}

/*
* Description: Hàm này để validate thời gian gửi về có đúng không
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {string} thoigian : String thời gian ví dụ "20190912010203"
*
* return {boolean} true/false
*/
export const validate_Thoigian = (thoigian) => {
  if(!validator.isNumeric(thoigian) || thoigian.length !== 14){
    return false
  }
  var year = parseInt(thoigian.substr(0,4))
  var month = parseInt(thoigian.substr(4,2))
  var day = parseInt(thoigian.substr(6,2))
  var hour = parseInt(thoigian.substr(8,2))
  var min = parseInt(thoigian.substr(10,2))
  var sec = parseInt(thoigian.substr(12,2))
  if(year < 2019 || month > 12 || day > 31){
    return false
  }
  if(hour > 24 || min > 60 || sec > 60){
    return false
  }
  return true
}

/*
* Description: Hàm này để validate nội dung của file ftp gửi về có đúng cấu trúc không.
* Writer: Đỗ Hữu Tín (06/09/2019)
*
* @param {array} noidung : Array dữ liệu quan trắc
*
* Kết quả trả về false nếu:
* - Kết quả quan trắc không phải là số
* - Thời gian gửi về không hợp lệ
* - Trạng thái của sensor bị sai quy định
* Kết quả gửi về true nếu validate thành công
*/
export const validate_noidungFile = (noidung) => {
  return noidung.every((dataChiso) => {
    if(!validator.isNumeric(dataChiso.ketqua) || !validate_Thoigian(dataChiso.thoigian) || _.indexOf(['00','01','02'],dataChiso.trangthaiSensor) < 0) {
      return false
    }
    return true
  })
}

export const deleteAccents = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}
export const convert_toNomalDate = (date, time) => {
  // console.log({date})
  date = date.split('/')
  return `${date[1]}-${date[0]}-${date[2]} ${time}`
}



export const analyzeFilter = (filter) => {
  let monitoringType = []
  let monitoringGroup = []
  let district = []
  let station = []

  filter.forEach(item => {
    station.push({id : item.id, name: item.name})
    if(_.findIndex(monitoringType, element => {return  element.id === item.MonitoringType.id}) < 0){
      monitoringType.push({id : item.MonitoringType.id, name: item.MonitoringType.name})
    }
    if(_.findIndex(monitoringGroup, element => {return  element.id === item.MonitoringGroup.id}) < 0){
      monitoringGroup.push({id : item.MonitoringGroup.id, name: item.MonitoringGroup.name})
    }
    if(_.findIndex(district, element => {return  element.id === item.District.id}) < 0){
      district.push({id : item.District.id, name: item.District.name})
    }
  })

  return {monitoringType, monitoringGroup, district, station}
}

export const analyzeManagerFilter = (filter) => {
  let monitoringType = []
  let monitoringGroup = []
  let district = []
  let station = []
  // console.log(filter)
  filter.forEach(item => {
    station.push({id : item.stationId, name: item.stationName})
    if(_.findIndex(monitoringType, element => {return  element.id === item.typeId}) < 0){
      monitoringType.push({id : item.typeId, name: item.typeName})
    }
    if(_.findIndex(monitoringGroup, element => {return  element.id === item.groupId}) < 0){
      monitoringGroup.push({id : item.groupId, name: item.groupName})
    }
    if(_.findIndex(district, element => {return  element.id === item.districtId}) < 0){
      district.push({id : item.districtId, name: item.districtName})
    }
  })
  monitoringType.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  monitoringGroup.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  district.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  station.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
  return {monitoringType, monitoringGroup, district, station}
}

export const convertMonitoringData = (monitoringDataInfo) => {
  let newData = monitoringDataInfo.map((dataInfo) => {
    // console.log(dataInfo.dataValues)
    let newMonitoringData = {}
    // const newTime = moment.utc(dataInfo.dataValues.sentAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:MM:SS')
  // console.log(dataInfo.dataValues.sentAt)
    dataInfo.dataValues.MonitoringData.forEach(data => {
      newMonitoringData[data.indicator] = data.value
    })
    return {...dataInfo.dataValues, MonitoringData : newMonitoringData}
  })

  return newData
}

export const isEmpty =(value) => {
  return  value === undefined ||
          value === null ||
          (typeof value === "object" && Object.keys(value).length === 0) ||
          (typeof value === "string" && value.trim().length === 0)
}

export const reformatStationData = (inputArray) => {
  let newArray = []
  inputArray.forEach(item => {
    if(item.MonitoringDataInfos.length >0){
      let newIndicators = []
      let newData = []
      let sentAt = ''
      if(item.StationIndicators.length > 0){
        newIndicators = item.StationIndicators.map(element => {
          return {
            id: element.Indicator.id,
            name: element.Indicator.name,
            unit: element.Indicator.unit,
            upperLimit: element.upperLimit,
            lowerLimit: element.lowerLimit,
            wqiIndicator: element.Indicator.wqiIndicator
          }
        })
      }
      sentAt = item.MonitoringDataInfos[0].sentAt
      newData = item.MonitoringDataInfos[0].MonitoringData
      
      // app.EnviromentIndex.calculateWqiStation(newData, newIndicators)
      newArray.push({
        id : item.id,
        monitoringType: item.monitoringType,
        name: item.name,
        address: item.address,
        rootLocation : item.rootLocation,
        // envIndex : item.envIndex,
        envIndex : app.EnviromentIndex.calculateWqiStation(newData, newIndicators),
        latestSentAt: sentAt,
        monitoringData : newData,
        threshold: newIndicators   
      })
    }
  })
  return newArray
}

export const getLastFolder = (dateFolders) => {
  let lastFolder = ''
  let lastNumber = 0
  dateFolders.forEach(item => {
    let dateFolderInNuber = parseInt(item.replace(/_/g, ''))
    // console.log(dateFolderInNuber)
    if(dateFolderInNuber > lastNumber){
      lastFolder = item
    }
  })
  return lastFolder
}

export const isNumber = (str) => {
  return /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(str);
}
