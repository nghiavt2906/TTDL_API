import HttpStatus from "http-status-codes"
import models from "models"
import { newId } from "models/utils"
import { Op } from "sequelize"

export default class StationSample {
  constructor() {}

  getStationSample = (stationId) => {
    return models.StationSample.findAll({
      // raw: true,
      where: {
        stationId: stationId
      },
      attributes: [
        'id', 'stationId', 'host', 'port', 'username', 'password',
        [models.Sequelize.col('Station.name'), 'stationName'] 
      ],
      include: [{
        model: models.Station,
        attributes: ['id'],
        order: [['name', 'ASC']],
        include: [{
          model: models.SampleHistory,
          // separate: true,
          order: [['sampleAt', 'DESC']],
          limit: 1,
          where: {
            finishAt: {
              [Op.ne]: null
            }
          },
          attributes: ['finishAt', 'bottle']
        }]
      }]
    })
  }

  getStationSampleById = (id) => {
    return models.StationSample.findAll({
      where: {
        id: id
      },
      attributes: [
        'id', 'stationId', 'host', 'port', 'username', 'password',
        [models.Sequelize.col('Station.name'), 'stationName'] 
      ],
      include: [{
        model: models.Station,
        attributes: ['id'],
        order: [['name', 'ASC']],
        include: [{
          model: models.SampleHistory,
          order: [['sampleAt', 'DESC']],
          limit: 1,
          where: {
            finishAt: {
              [Op.ne]: null
            }
          },
          attributes: ['finishAt', 'bottle']
        }]
      }]
    })
  }

  updateStationSample = (id, data) => {
    return models.StationSample.update(data, { where: {id: id}})
  } 

  createStationSample = (data) => {
    return models.StationSample.create({
      id: newId(),
      ...data
    })
  } 

  deleteStationSample = (id) => {
    return models.StationSample.destroy({
      where: {
        id: id
      }
    })
  } 
}
