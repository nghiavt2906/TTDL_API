import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
class CitizenStation {
  constructor() {}

  async getCitizenStation(citizenId, typeId) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: ['citizenId', 'stationId', 'notiStatus', 'orderStation'],
      include: [{model: models.Station, where: {monitoringType: typeId}, attributes: [['name', 'stationName'], 'address']}] 
    })
    // console.log(stations)
    return stations
  }

  async updateCitizenStation (citizenId, typeId, data){
    await models.CitizenStation.destroy({
      where: {
        citizenId,
        stationId : [models.sequelize.literal(`select id from stations where monitoringType = '${typeId}'`)]
      },
    })
    if(data.length){
      let citizenStation = data.map(item => ({id : newId(), citizenId: citizenId, stationId : item.stationId, notiStatus : item.notiStatus, orderStation: item.orderStation}))
      await models.CitizenStation.bulkCreate(citizenStation)
    }  
  }

  async getStationByCitizenId(citizenId, typeId) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        where: {monitoringType: typeId}, 
        attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station
    })
    return stationInfo
  }

  async getPublicStation (citizenId, condition, startEnvIndex, endEnvIndex) {
    let stations = await models.CitizenStation.findAll({
      separate: true,
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        // attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
        attributes: ['id'],
        where: {
          ...condition,
          publicStatus: 1,
          // envIndex : {
          //   [Op.gte] : startEnvIndex,
          //   [Op.lte] : endEnvIndex
          // }
        }, 
        // include: [{
        //   model: models.MonitoringDataInfo,
        //   order: [['sentAt','ASC']],
        //   limit: 1,
        //   attributes: ['sentAt'],
        //   required: true,
        //   include: [{
        //     model: models.MonitoringData,
        //     attributes: ['indicator', 'value', 'unit'],
        //     required: true
        //   }]
        // }, {
        //   model: models.StationIndicators,
        //   order: [['orderIndicator', 'ASC']],
        //   attributes: ['upperLimit', 'lowerLimit'],
        //   include: [{
        //     model: models.Indicator,
        //     attributes: ['name', 'id','unit']
        //   }]
        // }]
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station.id
    })
    return stationInfo
  }

  async getPublicStationByTypeIndex(citizenId, typeId, startEnvIndex, endEnvIndex) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        where: {
          monitoringType: typeId,
          envIndex : {
            [Op.gte] : startEnvIndex,
            [Op.lte] : endEnvIndex
          }
        }, 
        attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station
    })
    return stationInfo
  }

  async getPublicStationByGroupIndex(citizenId, groupId, startEnvIndex, endEnvIndex) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        where : {
          monitoringGroupId : groupId,
          envIndex : {
            [Op.gte] : startEnvIndex,
            [Op.lte] : endEnvIndex
          }
        }, 
        attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station
    })
    return stationInfo
  }

  async getPublicStationByTypeDistrictIndex(citizenId, typeId, districtId, startEnvIndex, endEnvIndex) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        where : {
          monitoringType : typeId,
          districtId: districtId,
          envIndex : {
            [Op.gte] : startEnvIndex,
            [Op.lte] : endEnvIndex
          }
        }, 
        attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station
    })
    return stationInfo
  }

  async getPublicStationByGroupDistrictIndex(citizenId, groupId, districtId, startEnvIndex, endEnvIndex) {
    let stations = await models.CitizenStation.findAll({ 
      where: { citizenId },
      order : [['orderStation', 'ASC']],
      attributes: [],
      include: [{
        model: models.Station, 
        where : {
          monitoringGroupId : groupId,
          districtId: districtId,
          envIndex : {
            [Op.gte] : startEnvIndex,
            [Op.lte] : endEnvIndex
          }
        }, 
        attributes: ['id', 'monitoringType',  'name', 'address', 'rootLocation', 'envIndex', 'latestSentAt'],
      }]
    })
    let stationInfo = stations.map(station => {
      return station.Station
    })
    return stationInfo
  }

  async deleteStation (citizenId, stationId){
    return models.CitizenStation.destroy({
      where : {citizenId, stationId}
    })
  }

  async updateNotification (citizenId, stationId){
    let station = await models.CitizenStation.findOne({where: {citizenId, stationId}, attributes: ['notiStatus']})
    return models.CitizenStation.update(
      {notiStatus : !station.notiStatus},
      {where : {citizenId, stationId}}
    )
  }

  async checkUniqueStation (citizenId, stationId) {
    let info = await models.CitizenStation.findAll({
      where: {
        citizenId: citizenId,
        stationId: stationId
      }
    })
    if(info.length) return false
    return true
  }

  async addStation (citizenId, stationId){
    const isExistStation = await this.checkUniqueStation(citizenId, stationId)
    if (!isExistStation) {
      throw { status: HttpStatus.UNAUTHORIZED, id: "api.citizenstation.station.exist", messages: "Trạm đã tồn tại." }
    }
    let orderStation = 0
    let data = await models.CitizenStation.findAll({
      attributes: ['orderStation'],
      where: {citizenId},
      order: [['orderStation', 'DESC']],
      limit : 1
    })
    if(data.length){
      orderStation = data[0].orderStation + 1
    }
    let result = await models.CitizenStation.create({
      id : newId(),
      citizenId,
      stationId,
      notiStatus : true,
      orderStation : orderStation
    })
    let stationInfo = await models.Station.findOne({where : {id: stationId}, attributes: ['name', 'address']})
    return {
      id : result.id,
      citizenId : result.citizenId,
      stationId: result.stationId,
      notiStatus: result.notiStatus,
      Station : {
        stationName: stationInfo.name,
        address: stationInfo.address 
      }
    }
  }

  async updateOrderStation (citizenId, arraystationId){
    arraystationId.map(async (stationId,index) => {
      await models.CitizenStation.update(
        {orderStation : index},
        {where: {citizenId, stationId}}
      )
    })
  }

}

export default CitizenStation
