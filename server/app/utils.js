import _ from "lodash"
import moment from "moment"
import app from "app"
import models from "models"

export const reformatStationInfo = (arrayInput) => {
  let data = []
  arrayInput.forEach((item) => {
    if (item.MonitoringDataInfos.length > 0) {
      data.push({
        stationId: item.id,
        name: item.name,
        symbol: item.symbol,
        monitoringGroupId: item.monitoringGroupId,
        address: item.address,
        rootLocation: item.rootLocation,
        idData: item.MonitoringDataInfos[0].dataValues.idData,
        sentAt: item.MonitoringDataInfos[0].dataValues.sentAt,
      })
    }
  })
  return data
}

export const reformatManagerInfo = (arrayInput) => {
  let data = []
  data = arrayInput.map((item) => {
    let stations = []
    if (item.ManagerStations.length > 0) {
      stations = item.ManagerStations.map((element) => {
        return {
          id: element.stationId,
          name: element.Station.name,
        }
      })
    }
    return {
      id: item.id,
      name: item.name,
      characterId: item.characterId,
      characterName: item.Character.name,
      email: item.email,
      phoneNumber: item.phoneNumber,
      address: item.address,
      workplace: item.workplace,
      isActive: item.isActive,
      isDefault: item.isDefault,
      stations: stations,
    }
  })
  return data
}

export const reformatSystemInfo = (arraySystem) => {
  let systemInfo = {}
  if (arraySystem.length > 0) {
    arraySystem.forEach((item) => {
      systemInfo[item.name] = item.value
    })
  }
  return systemInfo
}

export const reformatIndicatorReport = (arrIndicator, dataIndicator) => {
  let newData = {}
  arrIndicator.forEach((item) => {
    const index = _.findIndex(dataIndicator, (element) => {
      return element.indicator === item
    })
    if (index >= 0) {
      newData[item] = {
        max: dataIndicator[index].max,
        min: dataIndicator[index].min,
        avg: dataIndicator[index].avg,
      }
    } else {
      newData[item] = {
        max: "",
        min: "",
        avg: "",
      }
    }
  })
  return newData
}

export const convertToNormalDate = (dataDate) => {
  if (dataDate === null || dataDate === undefined) return ""
  return moment(dataDate).utcOffset(420).format("DD/MM/YYYY HH:mm:ss")
  // let localDate = new Date(dataDate).toLocaleString("en-US", {timeZone: "Asia/Ho_Chi_Minh"})

  // let dateTime = localDate.split(",");

  // let time = dateTime[1].substr(1, 8);
  // let date = dateTime[0];
  // let month = date.split("/")[0];
  // let day = date.split("/")[1];
  // let year = date.split("/")[2];

  // if (month.length === 1) month = "0" + month;
  // if (day.length === 1) day = "0" + day;
  // let newDate = `${day}/${month}/${year} ${time}`
  // // console.log({newDate})
  // return newDate;
}

export const analyzeCondition = (
  monitoringType,
  monitoringGroup,
  district,
  station
) => {
  let condition = {}
  if (station !== "ALL") {
    condition = { id: station }
  } else {
    if (monitoringGroup !== "ALL") {
      if (district === "ALL") {
        condition = { monitoringGroupId: monitoringGroup }
      } else {
        condition = { monitoringGroupId: monitoringGroup, districtId: district }
      }
    } else {
      if (district === "ALL") {
        condition = { monitoringType: monitoringType }
      } else {
        condition = { monitoringType: monitoringType, districtId: district }
      }
    }
  }

  return condition
}

export const reformatMonitoringData = (monitoringDataInfo, stationInfo) => {
  let newData = monitoringDataInfo.map((dataInfo) => {
    let newMonitoringData = {}
    // const newTime = moment.utc(dataInfo.dataValues.sentAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:MM:SS')
    dataInfo.dataValues.MonitoringData.forEach((data) => {
      newMonitoringData[data.indicator] = data.value
    })
    // return {...dataInfo.dataValues, sentAt: newTime, MonitoringData : newMonitoringData}
    return { ...dataInfo.dataValues, name: stationInfo.name, symbol: stationInfo.symbol, MonitoringData: newMonitoringData }
  })

  return newData
}

export const convertMonitoringData = (monitoringDataInfo) => {
  let newData = monitoringDataInfo.map((dataInfo) => {
    let newMonitoringData = {}
    // const newTime = moment.utc(dataInfo.dataValues.sentAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:MM:SS')
    dataInfo.dataValues.MonitoringData.forEach((data) => {
      newMonitoringData[data.indicator] = data.value
    })
    // return {...dataInfo.dataValues, sentAt: newTime, MonitoringData : newMonitoringData}
    return { ...dataInfo.dataValues, MonitoringData: newMonitoringData }
  })

  return newData
}

export const convertStationMonitoringData = (stationInfo, monitoringDataInfo) => {
  let newData = monitoringDataInfo.map((dataInfo) => {
    let newMonitoringData = {}
    // const newTime = moment.utc(dataInfo.dataValues.sentAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:MM:SS')
    dataInfo.dataValues.MonitoringData.forEach(data => {
      newMonitoringData[data.indicator] = data.value
    })
    // return {...dataInfo.dataValues, sentAt: newTime, MonitoringData : newMonitoringData}
    return { ...dataInfo.dataValues, name: stationInfo.name, symbol: stationInfo.symbol, MonitoringData: newMonitoringData }
  })

  return newData
}

//Reformat latest data
export const reformatLatestStationData = (inputArray) => {
  let newArray = []
  inputArray.forEach((item) => {
    if (item.MonitoringDataInfos.length > 0) {
      let newIndicators = []
      let newData = []
      let sentAt = ""
      if (item.MonitoringGroup.IndicatorThresholds.length > 0) {
        newIndicators = item.MonitoringGroup.IndicatorThresholds.map(
          (element) => {
            // console.log(element.Indicator)
            return {
              name: element.Indicator.dataValues.indicatorName,
              unit: element.Indicator.unit,
              upperLimit: element.upperLimit,
              lowerLimit: element.lowerLimit,
              wqiIndicator: element.Indicator.wqiIndicator,
            }
          }
        )
      }
      sentAt = item.MonitoringDataInfos[0].sentAt
      newData = item.MonitoringDataInfos[0].MonitoringData
      // console.log(item.MonitoringDataInfos[0].sentAt)
      // console.log(newIndicators)
      newArray.push({
        id: item.id,
        monitoringType: item.monitoringType,
        name: item.name,
        address: item.address,
        // rootLocation : item.rootLocation,
        // envIndex : item.envIndex,
        envIndex: app.EnviromentIndex.calculateWqiStation(
          newData,
          newIndicators
        ),
        image: item.image,
        verificationOrganization: item.verificationOrganization,
        verifiedAt: item.verifiedAt,
        latestSentAt: sentAt,
        monitoringData: newData,
        threshold: newIndicators,
      })
    }
  })
  return newArray
}

export const reformatStationRankingData = (inputArray) => {
  let newArray = []
  inputArray.forEach((item) => {
    if (item.MonitoringDataInfos.length > 0) {
      let newIndicators = []
      let newData = []
      let sentAt = ""
      if (item.StationIndicators.length > 0) {
        newIndicators = item.StationIndicators.map((element) => {
          return {
            id: element.Indicator.id,
            name: element.Indicator.name,
            unit: element.Indicator.unit,
            upperLimit: element.upperLimit,
            lowerLimit: element.lowerLimit,
            wqiIndicator: element.Indicator.wqiIndicator,
          }
        })
      }
      sentAt = item.MonitoringDataInfos[0].sentAt
      newData = item.MonitoringDataInfos[0].MonitoringData
      const envIndex = app.EnviromentIndex.calculateWqiStation(
        newData,
        newIndicators
      )
      if (envIndex !== null) {
        newArray.push({
          id: item.id,
          name: item.name,
          address: item.address,
          monitoringType: item.monitoringType,
          envIndex: app.EnviromentIndex.calculateWqiStation(
            newData,
            newIndicators
          ),
        })
      }
    }
  })
  return newArray
}

export const sendDataToBotnmt = async () => {
  let stationIdArr = await models.Station.findAll({ attributes: ["id"] })
}

export const reformatDataReport = (
  stationCount,
  stationDuration,
  startAt,
  endAt
) => {
  const timeSubtract = moment(endAt).diff(moment(startAt), "minutes")
  let data = stationCount.map((item) => {
    if (item.isManualStation === 0) {
      const index = _.findIndex(stationDuration, (element) => {
        return element.id === item.stationId
      })
      const duration = stationDuration[index].getDataDuration
      const maxSendingTimes = Math.floor(timeSubtract / duration)
      const percent = ((item.count / maxSendingTimes) * 100).toFixed(2)
      return {
        ...item,
        startAt: startAt,
        endAt: endAt,
        maxSendingTimes: maxSendingTimes,
        percent: percent,
      }
    } else {
      return {
        ...item,
        startAt: startAt,
        endAt: endAt,
        maxSendingTimes: "",
        percent: "",
      }
    }
  })
  return data
}

export const testXacxuat = () => {
  // for(let i = 0; i<100; i++){
  let solan70 = 0
  let solan60 = 0
  let solan50 = 0
  let solannho50 = 0
  const rate = [
    "Xanh",
    "Xanh",
    "Do",
    "Do",
    "Xanh",
    "Do",
    "Xanh",
    "Do",
    "Xanh",
    "Xanh",
  ]
  for (let i = 0; i < 100; i++) {
    let Xanh = 0
    let Do = 0
    for (let i = 0; i < 100; i++) {
      const index = Math.floor(Math.random() * 10)
      if (rate[index] === "Xanh") {
        Xanh = Xanh + 1
      } else {
        Do = Do + 1
      }
    }
    console.log(`Ket qua test he thong: Xanh: ${Xanh} --- Do ${Do}`)
    if (Xanh > 70) {
      solan70 = solan70 + 1
    } else if (Xanh > 60) {
      solan60 = solan60 + 1
    } else if (Xanh > 50) {
      solan50 = solan50 + 1
    } else {
      solannho50 = solannho50 + 1
    }
  }
  console.log(
    `Ketqua Xac suat: solan70: ${solan70} solan60: ${solan60} solan50: ${solan50} solannho50: ${solannho50}`
  )

  // }
}

export const getManagerRoutes = async (managerId) => {
  const managerInfo = await app.Manager.getManagerInfoById(managerId)
  const permissions = await app.CharacterPermission.getCharacterPermissionById(
    managerInfo.characterId
  )
  // console.log(permissions)
  const routes = await getCharacterRoutes(permissions)

  return routes
}

export const isHavingPermission = async (permissions, arrayPermissions) => {
  let result = permissions.map((item) => {
    const index = _.findIndex(arrayPermissions, (element) => {
      return element.dataValues.name === item
    })
    if (index > -1) {
      return arrayPermissions[index].permissionStatus
    } else {
      return 0
    }
  })
  if (result.includes(1)) {
    return true
  } else {
    return false
  }
}

export const getCharacterRoutes = async (arrayPermissions) => {
  let routes = {
    latestData: true,
    chartData: true,
    mapData: true,
    stationInfo: true,
    stationConfig: false,
    stationCamera: false,
    stationSample: false,
    report: false,
    monitoringGroup: false,
    indicator: false,
    indicatorThreshold: false,
    manualData: false,
    handleData: false,
    handleNotification: false,
    userGroup: false,
    userAccount: false,
    system: false,
  }
  const allowStationConfig = await isHavingPermission(
    [
      // "view_station_config",
      "edit_station_config",
      "delete_station",
      "insert_station",
    ],
    arrayPermissions
  )
  const allowReport = await isHavingPermission(
    ["view_general_report", "view_specific_report", "export_report"],
    arrayPermissions
  )
  const allowMonitoringGroup = await isHavingPermission(
    [
      "view_monitoring_group",
      "insert_monitoring_group",
      "edit_monitoring_group",
      "delete_monitoring_group",
    ],
    arrayPermissions
  )
  const allowIndicator = await isHavingPermission(
    [
      "view_indicator",
      "edit_indicator",
      "delete_indicator",
      "insert_indicator",
    ],
    arrayPermissions
  )
  const allowIndicatorThreshold = await isHavingPermission(
    [
      "view_indicator_threshold",
      "edit_indicator_threshold",
      "delete_indicator_threshold",
      "insert_indicator_threshold",
    ],
    arrayPermissions
  )
  const allowHandleData = await isHavingPermission(
    ["upload_data"],
    arrayPermissions
  )
  const allowHandleNotification = await isHavingPermission(
    ["edit_notification"],
    arrayPermissions
  )
  const allowUserGroup = await isHavingPermission(
    [
      "view_user_group",
      "edit_user_group",
      "delete_user_group",
      "insert_user_group",
    ],
    arrayPermissions
  )
  const allowUserAccount = await isHavingPermission(
    ["view_user_info", "edit_user_info", "delete_user", "insert_user"],
    arrayPermissions
  )
  const allowSystem = await isHavingPermission(
    ["view_system_config", "edit_system_config"],
    arrayPermissions
  )
  if (allowStationConfig) {
    routes.stationConfig = true
  }
  if (allowReport) {
    routes.report = true
  }
  if (allowMonitoringGroup) {
    routes.monitoringGroup = true
  }
  if (allowIndicator) {
    routes.indicator = true
  }
  if (allowIndicatorThreshold) {
    routes.indicatorThreshold = true
  }
  if (allowHandleData) {
    routes.manualData = true
    routes.handleData = true
  }
  if (allowHandleNotification) {
    routes.handleNotification = true
  }
  if (allowUserGroup) {
    routes.userGroup = true
  }
  if (allowUserAccount) {
    routes.userAccount = true
  }
  if (allowSystem) {
    routes.system = true
  }
  return routes
}

export const getStationId = (filter) => {
  if (filter.station === undefined) return []
  return filter.station.map((item) => {
    return item.key
  })
}

//Lastest Data
export const reformatLatestData = (inputArray) => {
  const MONITORING_STATUS = "01"
  const BROKEN_DEVICE_COLOR = "#9e9e9e"
  const OVERTHRESHOLD_COLOR = "red"
  const NORMAL_COLOR = "green"
  const UNKNOWN_COLOR = "blue"
  let newArray = []

  inputArray.forEach((item) => {
    if (item.MonitoringDataInfos.length > 0) {
      let newData = []
      item.MonitoringDataInfos[0].MonitoringData.forEach((data) => {
        const index = _.findIndex(item.StationIndicators, (element) => {
          return (
            element.dataValues.Indicator.dataValues.symbol.toUpperCase() ===
            data.dataValues.indicator
          )
        })

        if (index > -1) {
          const isOverThreshold =
            data.dataValues.value >
              item.StationIndicators[index].dataValues.upperLimit ||
              data.dataValues.value <
              item.StationIndicators[index].dataValues.lowerLimit
              ? true
              : false
          let color = isOverThreshold ? OVERTHRESHOLD_COLOR : NORMAL_COLOR
          const sensorStatus = data.dataValues.sensorStatus
          color =
            sensorStatus === MONITORING_STATUS ? color : BROKEN_DEVICE_COLOR
          newData.push({
            indicator:
              item.StationIndicators[index].dataValues.Indicator.dataValues
                .name,
            symbol: item.StationIndicators[index].dataValues.Indicator.dataValues
              .symbol,
            value: data.dataValues.value,
            unit: data.dataValues.unit || "",
            sentAt: item.MonitoringDataInfos[0].sentAt,
            isOverThreshold: isOverThreshold,
            color: color,
            sensorStatus: sensorStatus,
          })
        } else {
          const sensorStatus = data.dataValues.sensorStatus
          const color =
            sensorStatus !== MONITORING_STATUS
              ? BROKEN_DEVICE_COLOR
              : UNKNOWN_COLOR
          newData.push({
            indicator: data.dataValues.indicator,
            value: data.dataValues.value,
            unit: data.dataValues.unit || "",
            sentAt: item.MonitoringDataInfos[0].sentAt,
            isOverThreshold: false,
            color: color,
            sensorStatus: sensorStatus,
          })
        }
      })
      const isOverThreshold =
        item.StationAutoParameter.dataValues.isOverThreshold === 0
          ? false
          : true
      const isDisconnect =
        item.StationAutoParameter.dataValues.isDisconnect === 0 ? false : true
      const isBrokenDevice =
        item.StationAutoParameter.dataValues.isBrokenDevice === 0 ? false : true
      newArray.push({
        id: item.id,
        monitoringType: item.monitoringType,
        name: item.name,
        address: item.address,
        rootLocation: item.rootLocation,
        envIndex: null,
        latestSentAt: item.MonitoringDataInfos[0].sentAt,
        isOverThreshold,
        isDisconnect,
        isBrokenDevice,
        data: newData,
      })
    }
    else {
      newArray.push({
        id: item.id,
        monitoringType: item.monitoringType,
        name: item.name,
        address: item.address,
        rootLocation: item.rootLocation,
        envIndex: null,
        latestSentAt: '',
        isOverThreshold: false,
        isDisconnect: false,
        isBrokenDevice: false,
        data: [],
      })
    }
  })
  return newArray
}

export const getStationIndicators = (indicators) => {
  let newIndicators = []
  indicators.forEach((item) => {
    const index = _.findIndex(newIndicators, (element) => {
      return element.name === item.name
    })
    if (index === -1) {
      newIndicators.push(item)
    }
  })
  return newIndicators
}

export const getOrderStationData = (arrOrderStation, data) => {
  let newData = []
  arrOrderStation.forEach((item) => {
    let index = _.findIndex(data, (element) => {
      return element.id === item
    })
    if (index > -1) {
      console.log(index)
      newData.push(data[index])
    }
  })
  return newData
}
