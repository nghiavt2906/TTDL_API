import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"

class MonitoringData {
  constructor() {}

  deleteMonitoringData = (idData) => {
    return models.MonitoringData.destroy({ where: { idData: idData } })
  }

  createMonitoringData = (data) => {
    return models.MonitoringData.bulkCreate(data)
  }

  updateMonitoringData = (data) => {
    return models.MonitoringData.bulkCreate(data, { updateOnDuplicate: [""] })
  }

  findMonitoringData = (idData) => {
    return models.MonitoringData.findAll({
      where: {
        idData: {
          [Op.or]: idData
        }
      },
      attributes: ["id", "idData", "indicator", "value", "unit", "sensorStatus"]
    })
  }

  findNullUnit = async () => {
    // await models.MonitoringData.update({
    //   unit : ''
    // }, {
    //   where: {
    //     id : [models.Sequelize.literal('select id from monitoring_data where unit = null')]

    //   }
    // })
    const result = await models.MonitoringData.findAll({
      where : {unit : null},
      attributes: ['id']
    })
    let ids = result.map(item => {
      return item.id
    })
    await models.MonitoringData.update({
      unit : ''
    },{
      where : {
        id : ids
      }
    })
    return ids
  }

}

export default MonitoringData
