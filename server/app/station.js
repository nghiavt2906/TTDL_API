import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import app from "app"
import { changeBoleanToTinyInt, isEmpty } from "utils/functions"
import url from "url"
import { newId } from "models/utils"
import config from "configs"

class Station {
  constructor() {}

  getAllStations = async () => {
    const stations = await models.Station.findAll({
      attributes: ["id", "name"],
    })
    return stations.map((station) => ({ ...station.dataValues }))
  }
  getAllStationsWithoutReceptionApi = async () => {
    const res = await models.ApiKey.findAll({
      attributes: ["receivedStationId"],
      where: { isReceptionApi: true },
    })

    const stationIds = res.map((r) => r.dataValues.receivedStationId)

    const stations = await models.Station.findAll({
      attributes: ["id", "name"],
      where: {
        id: {
          [Op.notIn]: stationIds,
        },
      },
    })

    return stations.map((station) => ({ ...station.dataValues }))
  }

  getStationByArrayId(arrayId) {
    return models.Station.findAll({ where: { id: { [Op.in]: arrayId } } })
  }

  countStationById(arrayId) {
    return models.Station.count({ where: { id: { [Op.in]: arrayId } } })
  }

  async checkStationByCreator(userId, stationId) {
    const stations = await models.UserStation.findAll({
      where: { userId },
      attributes: ["stationId"],
    })
    if (!stations) return false

    const stationArrayId = stations.map((item) => item.stationId)
    return stationId.every((station) => stationArrayId.includes(station))
  }

  findStationInfoByMonitoringType = (monitoringType) => {
    return models.Station.findAll({
      where: { monitoringType: [monitoringType] },
      attributes: [
        `id`,
        `name`,
        `monitoringGroupId`,
        `symbol`,
        `address`,
        `verifiedAt`,
        `verificationOrganization`,
        `image`,
      ],
    })
  }
  findStationInfoByMonitoringGroup = (monitoringGroup) => {
    return models.Station.findAll({
      where: { monitoringGroupId: [monitoringGroup] },
      attributes: [
        `id`,
        `name`,
        `monitoringGroupId`,
        `symbol`,
        `address`,
        `verifiedAt`,
        `verificationOrganization`,
        `image`,
      ],
    })
  }
  findStationInfoByStationId = (stationId) => {
    return models.Station.findAll({
      where: { id: [stationId] },
      attributes: [
        `id`,
        `name`,
        `monitoringGroupId`,
        `symbol`,
        `address`,
        `verifiedAt`,
        `verificationOrganization`,
        `image`,
      ],
    })
  }
  getStationInfoByStationId = (stationId) => {
    let arrayStationId = []
    stationId.forEach((station) => {
      arrayStationId.push(station.key)
    })
    return models.Station.findAll({
      where: {
        id: {
          [Op.or]: arrayStationId,
        },
      },
      order: [["name", "ASC"]],
      attributes: [
        `id`,
        `name`,
        `monitoringGroupId`,
        `symbol`,
        `address`,
        "rootLocation",
        `verifiedAt`,
        `verificationOrganization`,
        `image`,
      ],
    })
  }

  getStationInfoById = async (stationIdList) => {
    stationIdList = stationIdList.map((station) => station.key)
    let stationList = await models.Station.findAll({
      where: { id: stationIdList },
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "name",
        "address",
        "rootLocation",
        "verifiedAt",
        "image",
        [models.Sequelize.col("MonitoringGroup.name"), "monitoringGroup"],
      ],
      include: [
        {
          model: models.MonitoringGroup,
          attributes: [],
        },
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
        },
      ],
    })
    stationList = stationList.map((station) => {
      let latestSentAt = null
      if (station["MonitoringDataInfos"].length > 0) {
        latestSentAt = station["MonitoringDataInfos"][0].sentAt
      }
      return {
        id: station.id,
        name: station.name,
        address: station.address,
        rootLocation: station.rootLocation,
        verifiedAt: station.verifiedAt,
        monitoringGroup: station.dataValues.monitoringGroup,
        latestSentAt,
        image: station.image,
      }
    })
    return stationList
  }

  findStationNameByMonitoringType = (monitoringType) => {
    return models.Station.findAll({
      where: { monitoringType: [monitoringType] },
      // attributes: [`id`, `name`, `monitoringType`, `monitoringGroupId`, `symbol`]
      attributes: [`id`, `name`],
    })
  }
  findStationNameByMonitoringGroup = (monitoringGroup) => {
    return models.Station.findAll({
      where: { monitoringGroupId: [monitoringGroup] },
      attributes: [
        `id`,
        `name`,
        `monitoringType`,
        `monitoringGroupId`,
        `symbol`,
      ],
    })
  }
  findStationNameByStationId = (stationId) => {
    return models.Station.findAll({
      where: { id: [stationId] },
      attributes: [
        `id`,
        `name`,
        `monitoringType`,
        `monitoringGroupId`,
        `symbol`,
      ],
    })
  }

  findStationInfo = (attributes) => {
    return models.Station.findAll({ attributes: attributes })
  }

  getStationInfo = (attributes) => {
    return models.Station.findAll({
      attributes: attributes,
      where: { activityStatus: 1 },
      include: [
        {
          model: models.StationFtp,
          attributes: ["host", "username", "password", "port"],
          required: true,
        },
      ],
    })
  }

  findStationInfoByCondition = (condition, attributes) => {
    return models.Station.findAll({
      raw: true,
      where: condition,
      attributes: attributes,
    })
  }

  updateStationById = (attributes, id) => {
    return models.Station.update(attributes, { where: { id: [id] } })
  }

  findOneStationInfo = (condition) => {
    return models.Station.findAll({
      where: condition,
      limit: 1,
      include: [
        {
          model: models.StationFtp,
          attributes: ["host", "username", "password", "port", "ftpFilename"],
        },
      ],
    })
  }

  findBasicStationInfo = (condition) => {
    return models.Station.findAll({
      where: condition,
      limit: 1,
      attributes: ["id", "name", "address", "symbol", "monitoringGroupId"],
    })
  }

  getStationInfobyRawQuery = (filterType, value) => {
    // return models.sequelize.query('select stations.id, stations.name, max(monitoringdatainfos.sentAt) as sentAt from stations inner join monitoringdatainfos on stations.id = monitoringdatainfos.stationId group by stations.id, stations.name', {model: [models.Station, models.MonitoringDataInfo]})
    switch (filterType) {
      case "MONITORING_TYPE":
        return models.sequelize.query(
          "select X.id as idData, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt from monitoring_data_info as X join (select a.id, a.name, a.monitoringGroupId, a.symbol, a.rootLocation, a.address, max(b.sentAt) as sentAt from stations as a inner join monitoring_data_info as b on a.id = b.stationId where a.monitoringType = ? group by a.id, a.name,a.monitoringGroupId, a.symbol, a.rootLocation, a.address limit 1) Y on X.sentAt = Y.sentAt and X.stationId = Y.id group by X.id, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt",
          { replacements: [value], type: models.sequelize.QueryTypes.SELECT }
        )
      case "MONITORING_GROUP":
        return models.sequelize.query(
          "select X.id as idData, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt from monitoring_data_info as X join (select a.id, a.name, a.monitoringGroupId, a.symbol, a.rootLocation, a.address, max(b.sentAt) as sentAt from stations as a inner join monitoring_data_info as b on a.id = b.stationId where a.monitoringGroupId = ? group by a.id, a.name,a.monitoringGroupId, a.symbol, a.rootLocation, a.address) Y on X.sentAt = Y.sentAt and X.stationId = Y.id group by X.id, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt",
          { replacements: [value], type: models.sequelize.QueryTypes.SELECT }
        )
      case "STATION":
        return models.sequelize.query(
          "select X.id as idData, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt from monitoring_data_info as X join (select a.id, a.name, a.monitoringGroupId, a.symbol, a.rootLocation, a.address, max(b.sentAt) as sentAt from stations as a inner join monitoring_data_info as b on a.id = b.stationId where a.id = ? group by a.id, a.name,a.monitoringGroupId, a.symbol, a.rootLocation, a.address) Y on X.sentAt = Y.sentAt and X.stationId = Y.id group by X.id, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt",
          { replacements: [value], type: models.sequelize.QueryTypes.SELECT }
        )
    }
  }

  getStationInfoByCondition = (stationId) => {
    return models.Station.findAll({
      where: {
        id: {
          [Op.or]: stationId,
        },
      },
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "name",
        "symbol",
        "monitoringGroupId",
        "address",
        "rootLocation",
      ],
      include: [
        {
          model: models.MonitoringDataInfo,
          limit: 1,
          order: [["sentAt", "DESC"]],
          attributes: [["id", "idData"], "sentAt"],
          required: true,
          // separate: true,
        },
      ],
    })
  }

  findStationInfobyRawQuery = (stationInfo) => {
    // console.log('It maybe here')
    let strStationId = ""
    stationInfo.forEach((station, index) => {
      if (index !== 0) {
        strStationId = `${strStationId},'${station.key}'`
      } else {
        strStationId = `'${station.key}'`
      }
    })

    let rawQuery = `select X.id as idData, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt from monitoring_data_info as X join (select a.id, a.name, a.monitoringGroupId, a.symbol, a.rootLocation, a.address, max(b.sentAt) as sentAt from stations as a inner join monitoring_data_info as b on a.id = b.stationId where a.id IN (${strStationId}) group by a.id, a.name,a.monitoringGroupId, a.symbol, a.rootLocation, a.address) Y on X.sentAt = Y.sentAt and X.stationId = Y.id group by X.id, X.stationId, Y.name, Y.monitoringGroupId, Y.symbol, Y.rootLocation, Y.address, X.sentAt`

    return models.sequelize.query(rawQuery, {
      type: models.sequelize.QueryTypes.SELECT,
    })
  }

  createStation = (id, info) => {
    // console.log({ id, info })
    // console.log(info.monitoringType)
    return models.Station.create({
      id: id,
      monitoringType: info.monitoringType,
      name: info.name,
      monitoringGroupId: info.monitoringGroup,
      symbol: info.symbol,
      address: info.address,
      phone: info.phone,
      image: info.image,
      rootLocation: info.rootLocation,
      // updateLocationStatus: changeBoleanToTinyInt(info.updateLocationStatus),
      // installedAt: info.installedAt,
      verifiedAt: info.verifiedAt,
      verificationOrganization: info.verificationOrganization,
      // emittedFrequency: info.emittedFrequency,
      activeState: "NORMAL",
      // ftpFolder: info.ftpFolder,
      // ftpFilename: info.ftpFilename,
      sendftpStatus: 1,
      receiveftpStatus: 1,
      numberOfThreshold: 0,
      numberOfAlertThreshold: 0,
      alertThresholdStatus: changeBoleanToTinyInt(info.alertThresholdStatus),
      numberOfAlertStructure: 0,
      alertStructureStatus: changeBoleanToTinyInt(info.alertStructureStatus),
      numberOfDisconnection: 0,
      alertDisconnectionStatus: changeBoleanToTinyInt(
        info.alertDisconnectionStatus
      ),
      activityStatus: changeBoleanToTinyInt(info.activityStatus),
      publicStatus: changeBoleanToTinyInt(info.publicStatus),
      dataSentFrequency: parseInt(info.dataSentFrequency),
      // disconnectionTime: info.disconnectionTime
    })
  }

  getFilterStation = (stationId) => {
    // console.log('No zo day nek ban')
    return models.Station.findAll({
      attributes: ["id", "name", "monitoringType", "monitoringGroupId"],
      order: [["name", "ASC"]],
      where: {
        id: {
          [Op.or]: stationId,
        },
        // [Op.or] : {
        //   publicStatus : 1,
        //   id : {
        //     [Op.or] : [ '73SywWduuD95etjlWnHa' ]
        //   }
        // }
      },
      include: [
        {
          model: models.MonitoringType,
          attributes: ["id", "name"],
          required: true,
        },
        {
          model: models.MonitoringGroup,
          attributes: ["id", "name"],
          required: true,
        },
      ],
    })
  }
  getFilterStationByType = (type, stationId) => {
    return models.Station.findAll({
      attributes: ["id", "name", "monitoringGroupId"],
      where: {
        monitoringType: type,
        id: {
          [Op.or]: stationId,
        },
        // [Op.or] : {
        //   publicStatus : 1,
        //   id : {
        //     [Op.or] : stationId
        //   }
        // }
      },
      include: [
        {
          model: models.MonitoringGroup,
          attributes: ["id", "name"],
          required: true,
        },
      ],
    })
  }
  getFilterStationByGroup = (groupId, stationId) => {
    return models.Station.findAll({
      attributes: ["id", "name"],

      where: {
        monitoringGroupId: groupId,
        id: {
          [Op.or]: stationId,
        },
        // [Op.or] : {
        //   publicStatus : 1,
        //   id : {
        //     [Op.or] : stationId
        //   }
        // }
      },
    })
  }

  // For mobile and portal
  getAllStationInfoMobile = () => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        publicStatus: 1,
      },
    })
  }

  getStationInfoByTypeMobile = (typeId) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringType: typeId,
        publicStatus: 1,
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          // attributes: ['upperLimit', 'lowerLimit', [models.Sequelize.col('Indicator.name'), 'name']],
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })
  }

  getStationInfoByGroupMobile = (groupId) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringGroupId: groupId,
        publicStatus: 1,
      },
    })
  }
  getStationInfoByStationMobile = (groupId, stationId) => {
    return models.Station.findAll({
      attributes: ["id", "name"],
      where: {
        monitoringGroupId: groupId,
        publicStatus: 1,
      },
    })
  }

  getStationInfoByTypeIndexMobile1 = (typeId, startEnvIndex, endEnvIndex) => {
    return models.Station.findAll({
      separate: true,
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringType: typeId,
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "id", "unit"],
            },
          ],
        },
      ],
    })
  }

  getPublicStationInfoByCondition = (condition, startEnvIndex, endEnvIndex) => {
    return models.Station.findAll({
      separate: true,
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        ...condition,
        publicStatus: 1,
        // envIndex : {
        //   [Op.gte] : startEnvIndex,
        //   [Op.lte] : endEnvIndex
        // }
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })
  }

  getPublicStationInfoByConditionTest = (condition) => {
    return models.Station.findAll({
      separate: true,
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        ...condition,
        publicStatus: 1,
        // envIndex : {
        //   [Op.gte] : startEnvIndex,
        //   [Op.lte] : endEnvIndex
        // }
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })
  }

  getPublicStationInfoByArray = (arrayStationId) => {
    return models.Station.findAll({
      separate: true,
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        id: {
          [Op.or]: arrayStationId,
        },
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "symbol", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })
  }

  getLatestStationData = async (arrayStationId) => {
    let results = await models.Station.findAll({
      separate: true,
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
        "dataSentFrequency",
      ],
      where: {
        id: arrayStationId,
      },
      include: [
        {
          model: models.StationAutoParameter,
          attributes: ["isOverThreshold", "isDisconnect", "isBrokenDevice"],
        },
        // {
        //   model: models.MonitoringDataInfo,
        //   order: [["sentAt", "DESC"]],
        //   limit: 1,
        //   attributes: ["sentAt", "monitoringContent"],
        //   required: true,
        //   include: [
        //     {
        //       model: models.MonitoringData,
        //       separate: true,
        //       attributes: ["indicator", "value", "unit", "sensorStatus"],
        //       required: true,
        //     },
        //   ],
        // },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit", "idStation", "idIndicator"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "symbol", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })

    arrayStationId = arrayStationId.filter((item) => item !== "ALL")
    const latestData = await models.LatestData.findAll({
      separate: true,
      where: {
        stationId: arrayStationId,
      },
    })

    return { stations: results, latestData }
  }

  getLatestApprovedData = (arrayStationId) => {
    return models.Station.findAll({
      separate: true,
      order: [["name", "ASC"]],
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        id: arrayStationId,
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          where: {
            isApproved: 0,
          },
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "symbol", "id", "unit", "wqiIndicator"],
            },
          ],
        },
      ],
    })
  }

  getStationInfoByTypeIndexMobile = (typeId, startEnvIndex, endEnvIndex) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringType: typeId,
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
    })
  }

  getStationInfoByGroupIndexMobile = (groupId, startEnvIndex, endEnvIndex) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringGroupId: groupId,
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
    })
  }

  getStationInfoByTypeDistrictIndexMobile = (
    typeId,
    districtId,
    startEnvIndex,
    endEnvIndex
  ) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringType: typeId,
        districtId: districtId,
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
    })
  }

  getStationInfoByGroupDistrictIndexMobile = (
    groupId,
    districtId,
    startEnvIndex,
    endEnvIndex
  ) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        monitoringGroupId: groupId,
        districtId: districtId,
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
    })
  }

  getStationInfoByStationIndexMobile = (
    stationId,
    startEnvIndex,
    endEnvIndex
  ) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        id: stationId,
        // publicStatus: 1,
        // envIndex : {
        //   [Op.gte] : startEnvIndex,
        //   [Op.lte] : endEnvIndex
        // }
      },
    })
  }

  getStationInfoByAllIndexMobile = (startEnvIndex, endEnvIndex) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        publicStatus: 1,
        envIndex: {
          [Op.gte]: startEnvIndex,
          [Op.lte]: endEnvIndex,
        },
      },
    })
  }

  getStationInfoByKeywordMobile = (keyword) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "rootLocation",
        "envIndex",
        "latestSentAt",
      ],
      where: {
        name: {
          [Op.like]: `%${keyword}%`,
        },
        publicStatus: 1,
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          order: [["sentAt", "DESC"]],
          limit: 1,
          attributes: ["sentAt"],
          required: true,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: ["indicator", "value", "unit"],
              required: true,
            },
          ],
        },
        {
          model: models.StationIndicators,
          order: [["orderIndicator", "ASC"]],
          attributes: ["upperLimit", "lowerLimit"],
          include: [
            {
              model: models.Indicator,
              attributes: ["name", "id", "unit"],
            },
          ],
        },
      ],
    })
  }

  // Get unfollow Station
  async getUnfollowStation(citizenId, typeId) {
    let station = await models.Station.findAll({
      attributes: [["id", "stationId"], ["name", "stationName"], "address"],
      where: {
        monitoringType: typeId,
        id: {
          [Op.not]: [
            models.sequelize.literal(
              `select stationId from citizen_stations where citizenId = '${citizenId}'`
            ),
          ],
        },
      },
    })
    return station
  }

  //Ranking
  getStationRankingByTypeMobile = (type) => {
    return models.Station.findAll({
      attributes: ["id", "name", "address", "envIndex"],
      where: {
        monitoringType: type,
        publicStatus: 1,
        envIndex: {
          [Op.ne]: null,
        },
      },
      order: [["envIndex", "DESC"]],
    })
  }

  getStationRankingByGroupMobile = (groupId) => {
    return models.Station.findAll({
      attributes: ["id", "name", "address", "envIndex"],
      where: {
        monitoringGroupId: groupId,
        publicStatus: 1,
        envIndex: {
          [Op.ne]: null,
        },
      },
      order: [["envIndex", "DESC"]],
    })
  }

  getStationRankingByDistrictMobile = (typeId, districtId) => {
    return models.Station.findAll({
      attributes: ["id", "name", "address", "envIndex"],
      where: {
        monitoringType: typeId,
        districtId: districtId,
        publicStatus: 1,
        envIndex: {
          [Op.ne]: null,
        },
      },
      order: [["envIndex", "DESC"]],
    })
  }

  getStationRankingByDistrictGroupMobile = (groupId, districtId) => {
    return models.Station.findAll({
      attributes: ["id", "name", "address", "envIndex"],
      where: {
        districtId: districtId,
        monitoringGroupId: groupId,
        publicStatus: 1,
        envIndex: {
          [Op.ne]: null,
        },
      },
      order: [["envIndex", "DESC"]],
    })
  }

  // Get station by Code
  getStationInfobyCode = (stationCode) => {
    return models.Station.findAll({
      attributes: ["id", "monitoringGroupId"],
      where: {
        symbol: stationCode,
      },
    })
  }

  getLatestStation = (stationId) => {
    return models.Station.findAll({
      attributes: [
        "id",
        "monitoringType",
        "name",
        "address",
        "envIndex",
        "latestSentAt",
        "verifiedAt",
        "verificationOrganization",
        "image",
      ],
      where: {
        id: stationId,
        publicStatus: 1,
      },
      include: [
        {
          model: models.MonitoringDataInfo,
          attributes: ["id", "stationId", "sentAt"],
          order: [["sentAt", "DESC"]],
          limit: 1,
          include: [
            {
              model: models.MonitoringData,
              separate: true,
              attributes: [
                "idData",
                "indicator",
                "value",
                "unit",
                "sensorStatus",
              ],
            },
          ],
        },
        {
          model: models.MonitoringGroup,
          attributes: ["name"],
          include: [
            {
              model: models.IndicatorThreshold,
              attributes: [
                "upperLimit",
                "lowerLimit",
                "safetyDescription",
                "overThresholdDescription",
              ],
              include: [
                {
                  model: models.Indicator,
                  attributes: [
                    ["symbol", "indicatorName"],
                    "unit",
                    "wqiIndicator",
                  ],
                },
              ],
            },
          ],
        },
      ],
    })
  }

  getStationsBySymbol = (arraySymbols) => {
    return models.Station.findAll({
      attributes: ["id", "name", "symbol"],
      where: {
        symbol: {
          [Op.or]: arraySymbols,
        },
      },
    })
  }

  getListStation = () => {
    return models.Station.findAll({
      attributes: ["id", "name"],
      // attributes: [[models.Sequelize.col('id'), 'Station.id'],[models.Sequelize.col('name'), 'Station.name']],
      include: [
        {
          model: models.MonitoringType,
          attributes: ["id", "name"],
        },
        {
          model: models.MonitoringGroup,
          attributes: ["id", "name"],
        },
        {
          model: models.District,
          attributes: ["id", "name"],
        },
      ],
    })
  }

  // getLatestStation = (stationId) => {
  //   return models.MonitoringDataInfo.findAll({
  //     where: {stationId :stationId},
  //     attributes: ['id', 'stationId', 'sentAt'],
  //     order : [['sentAt', 'DESC']],
  //     limit: 1,
  //     include : [{model: models.MonitoringData,attributes: ['idData', 'indicator', 'value', 'unit', 'sensorStatus']}]
  //   })
  // }

  //web admin
  getStationConfigById = (stationId) => {
    return models.Station.findOne({
      where: { id: stationId },
      attributes: [
        "id",
        "monitoringType",
        "monitoringGroupId",
        "districtId",
        "name",
        "symbol",
        "address",
        "phone",
        "image",
        "rootLocation",
        "verifiedAt",
        "verificationOrganization",
        "isManualStation",
        "alertThresholdStatus",
        "alertStructureStatus",
        "alertDisconnectionStatus",
        "syncDataBotnmtStatus",
        "activityStatus",
        "publicStatus",
      ],
      include: [
        {
          model: models.StationFtp,
          attributes: [
            "ftpFolder",
            "host",
            "username",
            "password",
            "port",
            "ftpFilename",
            "hostFtpBotnmt",
            "usernameFtpBotnmt",
            "passwordFtpBotnmt",
            "portFtpBotnmt",
            "ftpFilenameBotnmt",
          ],
        },
      ],
    })
  }

  deleteStation = async (stationId) => {
    await models.StationIndicators.destroy({
      where: { idStation: stationId },
    })
    await models.MonitoringDataInfo.destroy({
      where: { stationId: stationId },
    })
    return models.Station.destroy({
      where: { id: stationId },
    })
  }

  checkUniqueField = async (condition) => {
    const result = await models.Station.findAll({
      where: condition,
      attributes: ["id"],
    })
    if (result.length > 0) return false
    return true
  }

  createNewStation = async (info) => {
    try {
      let result = await models.sequelize.transaction(async (t) => {
        let stationFtp = {}
        await this.validateStationData(info, true)
        const indicatorNames = Object.keys(info.indicatorImages)
        const stationIndicatorData = info.indicators.map((item, index) => {
          const indicatorName = indicatorNames.find(
            (name) => info.indicatorImages[name].indicatorId == item.indicatorId
          )
          const indicatorImage = info.indicatorImages[indicatorName].image
          return {
            id: newId(),
            idIndicator: item.indicatorId,
            status: item.status,
            image:
              indicatorImage === "" ||
              indicatorImage === null ||
              indicatorImage === undefined
                ? `default-sensor.jpg`
                : indicatorImage,
            upperLimit: item.upperLimit,
            lowerLimit: item.lowerLimit,
            orderIndicator: index,
          }
        })
        const data = {
          id: newId(),
          name: info.name,
          monitoringType: info.monitoringType,
          monitoringGroupId: info.monitoringGroupId,
          districtId: info.districtId,
          symbol: info.symbol,
          address: info.address,
          phone: info.phone,
          image:
            info.image === "" || info.image === null || info.image === undefined
              ? `default.jpg`
              : info.image,
          rootLocation: info.rootLocation,
          verifiedAt: info.verifiedAt,
          verificationOrganization: info.verificationOrganization,
          isManualStation: info.isManualStation,
          alertThresholdStatus: info.alertThresholdStatus,
          alertStructureStatus: info.alertStructureStatus,
          alertDisconnectionStatus: info.alertDisconnectionStatus,
          syncDataBotnmtStatus: info.syncDataBotnmtStatus,
          activityStatus: info.activityStatus,
          publicStatus: info.publicStatus,
          StationIndicators: stationIndicatorData,
          StationAutoParameter: {
            id: newId(),
            alertThresholdStatus: info.alertThresholdStatus,
            alertStructureStatus: info.alertStructureStatus,
            alertDisconnectionStatus: info.alertDisconnectionStatus,
          },
          dataSentFrequency: info.dataSentFrequency,
        }
        const newStation = await models.Station.create(data, {
          include: [models.StationIndicators, models.StationAutoParameter],
          transaction: t,
        })
        if (!info.isManualStation) {
          stationFtp = {
            ...info.StationFtp,
            stationId: newStation.id,
            id: newId(),
          }
        } else {
          stationFtp = {
            id: newId(),
            stationId: newStation.id,
            hostFtpBotnmt: info.StationFtp.hostFtpBotnmt,
            usernameFtpBotnmt: info.StationFtp.usernameFtpBotnmt,
            passwordFtpBotnmt: info.StationFtp.passwordFtpBotnmt,
            portFtpBotnmt: info.StationFtp.portFtpBotnmt,
            ftpFilenameBotnmt: info.StationFtp.ftpFilenameBotnmt,
          }
        }
        await models.StationFtp.create(stationFtp, { transaction: t })
        return newStation.id
      })
      return result
    } catch (error) {
      throw error
    }
  }

  updateStation = async (stationId, data) => {
    try {
      // console.log(data)
      await this.validateStationData(data, false)
      const indicatorNames = Object.keys(data.indicatorImages)
      const stationIndicatorData = data.indicators.map((item, index) => {
        const indicatorName = indicatorNames.find(
          (name) => data.indicatorImages[name].indicatorId == item.indicatorId
        )
        const indicatorImage = data.indicatorImages[indicatorName].image
        return {
          id: newId(),
          idStation: stationId,
          idIndicator: item.indicatorId,
          status: item.status,
          image:
            indicatorImage === "" ||
            indicatorImage === null ||
            indicatorImage === undefined
              ? `default-sensor.jpg`
              : indicatorImage,
          upperLimit: item.upperLimit,
          lowerLimit: item.lowerLimit,
          orderIndicator: index,
        }
      })
      const stationInfo = {
        name: data.name,
        monitoringType: data.monitoringType,
        monitoringGroupId: data.monitoringGroupId,
        districtId: data.districtId,
        symbol: data.symbol,
        address: data.address,
        phone: data.phone,
        rootLocation: data.rootLocation,
        verificationOrganization: data.verificationOrganization,
        verifiedAt: data.verifiedAt,
        isManualStation: data.isManualStation,
        syncDataBotnmtStatus: data.syncDataBotnmtStatus,
        activityStatus: data.activityStatus,
        publicStatus: data.publicStatus,
        dataSentFrequency: data.dataSentFrequency,
      }
      if (
        data.image === "" ||
        data.image === null ||
        data.image === undefined
      ) {
        stationInfo.image = `default.jpg`
      } else {
        stationInfo.image = data.image
      }

      const stationAutoParams = !data.isManualStation
        ? {
            alertDisconnectionStatus: data.alertDisconnectionStatus,
            alertStructureStatus: data.alertStructureStatus,
            alertThresholdStatus: data.alertThresholdStatus,
          }
        : {
            alertDisconnectionStatus: 0,
            alertStructureStatus: 0,
            alertThresholdStatus: 0,
          }
      const stationFtp = data.isManualStation
        ? {
            host: null,
            username: null,
            password: null,
            port: null,
            ftpFilename: null,
            // hostFtpSample : null,
            // usernameFtpSample: null,
            // passwordFtpSample: null,
            // portFtpSample: null,
            hostFtpBotnmt: data.StationFtp.hostFtpBotnmt,
            usernameFtpBotnmt: data.StationFtp.usernameFtpBotnmt,
            passwordFtpBotnmt: data.StationFtp.passwordFtpBotnmt,
            portFtpBotnmt: data.StationFtp.portFtpBotnmt,
            ftpFilenameBotnmt: data.StationFtp.ftpFilenameBotnmt,
          }
        : data.StationFtp
      await models.Station.update(stationInfo, { where: { id: stationId } })
      await models.StationAutoParameter.update(stationAutoParams, {
        where: { stationId },
      })
      await models.StationFtp.update(stationFtp, { where: { stationId } })
      await models.StationIndicators.destroy({
        where: { idStation: stationId },
      })
      await models.StationIndicators.bulkCreate(stationIndicatorData)
    } catch (error) {
      throw error
    }
  }

  getStationById = async (stationId) => {
    return models.Station.findOne({
      where: { id: stationId },
      attributes: [
        "id",
        "name",
        "monitoringType",
        "monitoringGroupId",
        "districtId",
        "symbol",
        "address",
        "phone",
        "image",
        "rootLocation",
        "verifiedAt",
        "verificationOrganization",
        "isManualStation",
        "syncDataBotnmtStatus",
        "activityStatus",
        "publicStatus",
        "dataSentFrequency",
        [
          models.Sequelize.col("StationAutoParameter.alertThresholdStatus"),
          "alertThresholdStatus",
        ],
        [
          models.Sequelize.col("StationAutoParameter.alertDisconnectionStatus"),
          "alertDisconnectionStatus",
        ],
        [
          models.Sequelize.col("StationAutoParameter.alertStructureStatus"),
          "alertStructureStatus",
        ],
      ],
      include: [
        {
          model: models.StationFtp,
          // attributes: ['ftpFolder','ftpFilename', 'host', 'username', 'password', 'port', 'hostFtpSample', 'usernameFtpSample', 'passwordFtpSample', 'portFtpSample', 'hostFtpBotnmt', 'usernameFtpBotnmt', 'passwordFtpBotnmt', 'portFtpBotnmt']
          attributes: [
            "ftpFolder",
            "ftpFilename",
            "host",
            "username",
            "password",
            "port",
            "hostFtpBotnmt",
            "usernameFtpBotnmt",
            "passwordFtpBotnmt",
            "portFtpBotnmt",
            "ftpFilenameBotnmt",
          ],
        },
        {
          model: models.StationAutoParameter,
          attributes: [],
        },
      ],
    })
  }

  validateStationData = async (data, isCreate) => {
    if (isEmpty(data.monitoringType)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Loại quan trắc là trường bắt buộc!",
      }
    }
    if (isEmpty(data.monitoringGroupId)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Nhóm quan trắc là trường bắt buộc!",
      }
    }
    if (isEmpty(data.districtId)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Quận, huyện là trường bắt buộc!",
      }
    }

    // check unique symbol
    const isUniqueSymbol = await this.checkUniqueField({ symbol: data.symbol })
    if (isCreate && !isUniqueSymbol) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Mã trạm đã tồn tại!",
      }
    }
    if (isEmpty(data.rootLocation)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Tọa độ trạm là trường bắt buộc!",
      }
    }
    if (isEmpty(data.rootLocation)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Tọa độ trạm là trường bắt buộc!",
      }
    }
    if (isEmpty(data.address)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Địa chỉ là trường bắt buộc!",
      }
    }
    if (isEmpty(data.indicators)) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.station.config.invalid",
        messages: "Cảm biến trạm là trường bắt buộc!",
      }
    }

    // if (!data.isManualStation) {
    //   const isUniqueFtpFolder = await app.StationFtp.checkUniqueField({
    //     ftpFolder: data.StationFtp.ftpFolder,
    //   })
    //   if (isCreate && !isUniqueFtpFolder) {
    //     throw {
    //       status: HttpStatus.BAD_REQUEST,
    //       id: "api.station.config.invalid",
    //       messages: "Thư mục chứa file FTP đã tồn tại!",
    //     }
    //   }

    //   if (isEmpty(data.StationFtp.ftpFolder)) {
    //     throw {
    //       status: HttpStatus.BAD_REQUEST,
    //       id: "api.station.config.invalid",
    //       messages: "Thư mục chứa file FTP là trường bắt buộc!",
    //     }
    //   }

    //   if (data.StationFtp.ftpFolder.includes("\\")) {
    //     throw {
    //       status: HttpStatus.BAD_REQUEST,
    //       id: "api.station.config.invalid",
    //       messages: `Cấu hình sai tên thư mục FTP. Sử dụng dấu '/' để phân cấp thư mục con.`,
    //     }
    //   }

    //   const isUniqueFtpFilename = await app.StationFtp.checkUniqueField({
    //     ftpFilename: data.StationFtp.ftpFilename,
    //   })
    //   if (isCreate && !isUniqueFtpFilename) {
    //     throw {
    //       status: HttpStatus.BAD_REQUEST,
    //       id: "api.station.config.invalid",
    //       messages: "Tên file FTP đã tôn tại!",
    //     }
    //   }
    //   if (isEmpty(data.StationFtp.ftpFilename)) {
    //     throw {
    //       status: HttpStatus.BAD_REQUEST,
    //       id: "api.station.config.invalid",
    //       messages: "Tên file FTP là trường bắt buộc!",
    //     }
    //   }
    //   // if (isEmpty(data.StationFtp.host)) {
    //   //   throw {
    //   //     status: HttpStatus.BAD_REQUEST,
    //   //     id: "api.station.config.invalid",
    //   //     messages: "Host FTP là trường bắt buộc!",
    //   //   }
    //   // }
    //   // if (isEmpty(data.StationFtp.username)) {
    //   //   throw {
    //   //     status: HttpStatus.BAD_REQUEST,
    //   //     id: "api.station.config.invalid",
    //   //     messages: "Username FTP là trường bắt buộc!",
    //   //   }
    //   // }
    //   // if (isEmpty(data.StationFtp.password)) {
    //   //   throw {
    //   //     status: HttpStatus.BAD_REQUEST,
    //   //     id: "api.station.config.invalid",
    //   //     messages: "Password FTP là trường bắt buộc!",
    //   //   }
    //   // }
    //   // if (isEmpty(data.StationFtp.port)) {
    //   //   throw {
    //   //     status: HttpStatus.BAD_REQUEST,
    //   //     id: "api.station.config.invalid",
    //   //     messages: "Port FTP là trường bắt buộc!",
    //   //   }
    //   // }
    // }

    if (data.syncDataBotnmtStatus) {
      const isUniqueftpFilenameBotnmt = await app.StationFtp.checkUniqueField({
        ftpFilenameBotnmt: data.StationFtp.ftpFilenameBotnmt,
      })
      if (isCreate && !isUniqueftpFilenameBotnmt) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Tên file FTP đồng bộ về Tổng cục TNMT đã tôn tại!",
        }
      }
      if (isEmpty(data.StationFtp.ftpFilenameBotnmt)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Tên file FTP đồng bộ về Tổng cục TNMT là trường bắt buộc!",
        }
      }
      if (isEmpty(data.StationFtp.hostFtpBotnmt)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Host FTP đồng bộ về Tổng cục TNMT là trường bắt buộc!",
        }
      }
      if (isEmpty(data.StationFtp.usernameFtpBotnmt)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Username FTP đồng bộ về Tổng cục TNMT là trường bắt buộc!",
        }
      }
      if (isEmpty(data.StationFtp.passwordFtpBotnmt)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Password FTP đồng bộ về Tổng cục TNMT là trường bắt buộc!",
        }
      }
      if (isEmpty(data.StationFtp.portFtpBotnmt)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.station.config.invalid",
          messages: "Port FTP đồng bộ về Tổng cục TNMT là trường bắt buộc!",
        }
      }
    }
  }

  // FTP function
  getInfo = () => {
    return models.Station.findAll({
      raw: true,
      where: {
        activityStatus: 1,
        isManualStation: 0,
      },
      attributes: [
        "id",
        "name",
        "monitoringType",
        [models.Sequelize.col("StationFtp.ftpFolder"), "ftpFolder"],
        [models.Sequelize.col("StationFtp.ftpFilename"), "ftpFilename"],
        [models.Sequelize.col("StationFtp.host"), "host"],
        [models.Sequelize.col("StationFtp.username"), "username"],
        [models.Sequelize.col("StationFtp.password"), "password"],
        [models.Sequelize.col("StationFtp.port"), "port"],
      ],
      include: [
        {
          model: models.StationFtp,
          attributes: [],
        },
      ],
    })
  }

  getFtpInfo = () => {
    return models.Station.findAll({
      raw: true,
      where: {
        activityStatus: 1,
        isManualStation: 0,
      },
      attributes: [
        "id",
        "monitoringType",
        [models.Sequelize.col("StationFtp.ftpFolder"), "ftpFolder"],
        [models.Sequelize.col("StationFtp.ftpFilename"), "ftpFilename"],
        [models.Sequelize.col("StationFtp.host"), "host"],
        [models.Sequelize.col("StationFtp.username"), "username"],
        [models.Sequelize.col("StationFtp.password"), "password"],
        [models.Sequelize.col("StationFtp.port"), "port"],
        // [models.Sequelize.col('StationAutoParameter.disconnectionTime'), 'disconnectionTime'],
      ],
      include: [
        {
          model: models.StationFtp,
          attributes: [],
        },
        {
          model: models.StationAutoParameter,
          attributes: [],
        },
      ],
    })
  }

  // getFtpSample = (stationId) => {
  //   return models.Station.findAll({
  //     raw : true,
  //     where : {
  //       id: stationId,
  //     },
  //     attributes: [
  //       'id', 'symbol',
  //       [models.Sequelize.col('StationFtp.hostFtpSample'), 'hostFtpSample'],
  //       [models.Sequelize.col('StationFtp.usernameFtpSample'), 'usernameFtpSample'],
  //       [models.Sequelize.col('StationFtp.passwordFtpSample'), 'passwordFtpSample'],
  //       [models.Sequelize.col('StationFtp.portFtpSample'), 'portFtpSample']
  //     ],
  //     include: [{
  //       model: models.StationFtp,
  //       attributes: []
  //     }]
  //   })
  // }

  getIndicatorThreshold = (stationId) => {
    return models.StationIndicators.findAll({
      raw: true,
      where: { idStation: stationId },
      attributes: [
        "upperLimit",
        "lowerLimit",
        [models.Sequelize.col("Indicator.name"), "name"],
      ],
      include: [
        {
          model: models.Indicator,
          attributes: [],
        },
      ],
    })
  }

  getStationFtpBotnmt = () => {
    return models.Station.findAll({
      // subQuery: false,
      raw: true,
      where: {
        syncDataBotnmtStatus: 1,
      },
      attributes: [
        "id",
        [models.Sequelize.col("StationFtp.hostFtpBotnmt"), "hostFtpBotnmt"],
        [
          models.Sequelize.col("StationFtp.usernameFtpBotnmt"),
          "usernameFtpBotnmt",
        ],
        [
          models.Sequelize.col("StationFtp.passwordFtpBotnmt"),
          "passwordFtpBotnmt",
        ],
        [models.Sequelize.col("StationFtp.portFtpBotnmt"), "portFtpBotnmt"],
        [
          models.Sequelize.col("StationFtp.ftpFilenameBotnmt"),
          "ftpFilenameBotnmt",
        ],
      ],
      include: [
        {
          model: models.StationFtp,
          attributes: [],
        },
      ],
    })
  }

  getCountData = (condition, startTime, endTime) => {
    return models.Station.findAll({
      raw: true,
      group: [models.Sequelize.col("MonitoringDataInfos.stationId")],
      where: {
        ...condition,
      },
      attributes: [
        "name",
        "symbol",
        "isManualStation",
        [models.Sequelize.col("MonitoringDataInfos.stationId"), "stationId"],
        [
          models.Sequelize.fn(
            "count",
            models.Sequelize.col("MonitoringDataInfos.id")
          ),
          "count",
        ],
      ],
      include: [
        {
          model: models.MonitoringDataInfo,
          where: {
            sentAt: { [Op.between]: [startTime, endTime] },
          },
          attributes: [],
        },
      ],
    })
  }

  getDataDuration = (condition) => {
    return models.Station.findAll({
      raw: true,
      where: {
        ...condition,
        isManualStation: 0,
      },
      attributes: [
        "id",
        [
          models.Sequelize.col("StationAutoParameter.getDataDuration"),
          "getDataDuration",
        ],
      ],
      include: [
        {
          model: models.StationAutoParameter,
          attributes: [],
        },
      ],
    })
  }

  getBasicStationInfo = (stationId) => {
    return models.Station.findAll({
      raw: true,
      where: { id: stationId },
      attributes: ["id", "name", "symbol"],
    })
  }

  getStationAttributes = (stationId, attributes) => {
    return models.Station.findOne({
      raw: true,
      where: { id: stationId },
      attributes: attributes,
    })
  }

  getStationConfiguration(condition) {
    return models.Station.findAll({
      raw: true,
      where: {
        ...condition,
      },
      attributes: [
        "id",
        "name",
        "symbol",
        "address",
        "rootLocation",
        "isManualStation",
        [models.Sequelize.col("MonitoringGroup.name"), "monitoringGroup"],
      ],
      order: [["name", "ASC"]],
      include: [
        {
          model: models.MonitoringGroup,
          attributes: [],
        },
      ],
    })
  }
}

export default Station
