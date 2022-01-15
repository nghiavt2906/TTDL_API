import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
import _ from "lodash"
class ManagerStation {
  constructor() {}

  getStationByManagerId(managerId) {
    return models.ManagerStation.findAll({
      where: { managerId: managerId },
      include: [
        {
          model: models.Station,
          attributes: [["name", "stationName"]],
          required: true,
        },
      ],
    })
  }

  getStationIdByManagerId(managerId) {
    return models.ManagerStation.findAll({
      raw: true,
      attributes: ["stationId"],
      where: { managerId: managerId },
    })
  }

  // getListStationByManagerId (managerId){
  //   return models.ManagerStation.findAll({
  //     raw: true,
  //     attributes: [
  //       'stationId',
  //       [models.Sequelize.col('Station.name'), 'stationName'],
  //       [models.Sequelize.col('Station.MonitoringType.id'), 'typeId'],
  //       [models.Sequelize.col('Station.MonitoringType.name'), 'typeName'],
  //       [models.Sequelize.col('Station.MonitoringGroup.id'), 'groupId'],
  //       [models.Sequelize.col('Station.MonitoringGroup.name'), 'groupName'],
  //       [models.Sequelize.col('Station.District.id'), 'districtId'],
  //       [models.Sequelize.col('Station.District.name'), 'districtName'],
  //     ],
  //     where: {managerId},
  //     include: [{
  //       model: models.Station,
  //       attributes: [],
  //     // attributes: [[models.Sequelize.col('id'), 'Station.id'],[models.Sequelize.col('name'), 'Station.name']],
  //       include: [{
  //         model: models.MonitoringType,
  //         attributes: [],
  //       }, {
  //         model: models.MonitoringGroup,
  //         attributes: []
  //       }, {
  //         model: models.District,
  //         attributes: []
  //       }]
  //     }]
  //   })
  // }

  getListStationByManagerId(managerId, condition) {
    return models.ManagerStation.findAll({
      // raw: true,
      order: [[models.Sequelize.col("Station.name"), "ASC"]],
      attributes: [
        ["stationId", "id"],
        [models.Sequelize.col("Station.name"), "name"],
      ],
      where: { managerId },
      include: [
        {
          model: models.Station,
          attributes: [],
          where: condition,
        },
      ],
    })
  }

  getStationManagement(managerId, condition) {
    return models.ManagerStation.findAll({
      // raw: true,
      order: [[models.Sequelize.col("Station.name"), "ASC"]],
      attributes: [
        ["stationId", "id"],
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
        [models.Sequelize.col("Station.address"), "address"],
        [models.Sequelize.col("Station.rootLocation"), "rootLocation"],
        [models.Sequelize.col("Station.isManualStation"), "isManualStation"],
        [
          models.Sequelize.col("Station.MonitoringGroup.name"),
          "monitoringGroup",
        ],
      ],
      where: { managerId },
      include: [
        {
          model: models.Station,
          attributes: [],
          where: condition,
          include: [
            {
              model: models.MonitoringGroup,
              attributes: [],
            },
          ],
        },
      ],
    })
  }

  findMaxOrderStation(managerId) {
    return models.ManagerStation.findAll({
      raw: true,
      attributes: [
        [
          models.Sequelize.fn("MAX", models.Sequelize.col("orderStation")),
          "orderStation",
        ],
      ],
      where: {
        managerId,
      },
    })
  }

  async addNewStationManager(managerId, stationId) {
    const manager = await app.Manager.getAutoUpdateStationManager()
    console.log(manager)
    if (
      _.findIndex(manager, (item) => {
        return item.id === managerId
      }) < 0
    ) {
      manager.push({ id: managerId })
    }
    if (manager.length) {
      await Promise.all(
        manager.map(async (element) => {
          const station = await this.findMaxOrderStation(element.id)
          // console.log(station)
          await models.ManagerStation.create({
            id: newId(),
            managerId: element.id,
            stationId: stationId,
            orderStation: station.length > 0 ? station[0].orderStation + 1 : 0,
          })
        })
      )
    }
    // return app.ManagerStation
  }

  getListStation = (managerId, condition) => {
    return models.ManagerStation.findAll({
      raw: true,
      order: [[models.Sequelize.col("Station.name"), "ASC"]],
      where: {
        managerId: managerId,
      },
      attributes: [
        ["stationId", "id"],
        [models.Sequelize.col("Station.name"), "name"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
          where: condition,
        },
      ],
    })
  }

  getStationListByCondition = (managerId, condition, statusCondition) => {
    console.log({managerId, condition, statusCondition})
    return models.ManagerStation.findAll({
      raw: true,
      order: [[models.Sequelize.col("Station.name"), "ASC"]],
      where: {
        managerId: managerId,
      },
      attributes: [
        ["stationId", "id"],
        [models.Sequelize.col("Station.name"), "name"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
          where: condition,
          // include: [
          //   {
          //     model: models.StationAutoParameter,
          //     where: statusCondition,
          //   },
          // ],
        },
      ],
    })
  }

  getListMonitoringType = (managerId) => {
    return models.ManagerStation.findAll({
      raw: true,
      where: { managerId },
      group: [
        [models.Sequelize.col("Station.monitoringType")],
        [models.Sequelize.col("Station.MonitoringType.name"), "name"],
      ],
      attributes: [
        [models.Sequelize.col("Station.monitoringType"), "id"],
        [models.Sequelize.col("Station.MonitoringType.name"), "name"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
          include: [
            {
              model: models.MonitoringType,
              attributes: [],
            },
          ],
        },
      ],
    })
  }

  getManagerByStationId = (stationId) => {
    return models.ManagerStation.findAll({
      raw: true,
      where: {
        stationId,
      },
      attributes: [
        "managerId",
        [models.Sequelize.col("Manager.name"), "name"],
        [models.Sequelize.col("Manager.email"), "email"],
      ],
      include: [
        {
          model: models.Manager,
          attributes: [],
        },
      ],
    })
  }
}

export default ManagerStation
