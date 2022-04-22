import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"

class StationIndicators {
  constructor() { }

  findIndicatorByIdStation = (idStation) => {
    return models.StationIndicators.findAll({
      where: { idStation: idStation },
      attributes: ["idStation", "idIndicator"],
      include: [{ model: models.Indicator, attributes: [["symbol", "indicatorName"]], required: true }]
    })
  }

  deleteStationIndicator = (idData) => {
    return models.StationIndicators.destroy({ where: { idStation: idData } })
  }

  createStationIndicator = (data) => {
    return models.StationIndicators.bulkCreate(data)
  }

  findIndicatorByIdStation = (idStation) => {
    return models.StationIndicators.findAll({
      where: { idStation: idStation },
      attributes: ["idStation", "idIndicator"],
      include: [{ model: models.Indicator, attributes: [["symbol", "indicatorName"]], required: true }]
    })
  }

  getIndicators = async (stationId) => {
    let indicators = await models.StationIndicators.findAll({
      where: { idStation: stationId },
      attributes: ['idIndicator', 'status'],
      include: [{ model: models.Indicator, attributes: ["symbol", "unit"], required: true }]
    })
    let data = []
    if (indicators.length) {
      data = indicators.map(indicator => {
        return { id: indicator.idIndicator, name: indicator.Indicator.symbol, unit: indicator.Indicator.unit, status: indicator.status }
      })
    }
    return data
  }

  getStationIndicators = async (stationId) => {
    return models.StationIndicators.findAll({
      where: { idStation: stationId },
      attributes: [
        ['idIndicator', 'id'],
        [models.Sequelize.col('Indicator.symbol'), 'symbol'],
        [models.Sequelize.col('Indicator.unit'), 'unit']
      ],
      include: [{ model: models.Indicator, order: [['symbol', 'ASC']], attributes: [] }]
    })
  }

  getStationIndicatorsByStationId = async (stationId) => {
    return models.StationIndicators.findAll({
      where: { idStation: stationId },
      order: [['orderIndicator', 'ASC']],
      attributes: [
        'idIndicator', 'upperLimit', 'lowerLimit', 'image', 'status',
        [models.Sequelize.col('Indicator.symbol'), 'name'],
        [models.Sequelize.col('Indicator.unit'), 'unit']
      ],
      include: [{ model: models.Indicator, attributes: [] }]
    })
  }

  findIndicator = (idStation) => {
    return models.StationIndicators.findAll({
      raw: true,
      where: { idStation: idStation },
      attributes: [
        ['idIndicator', 'id'],
        'lowerLimit',
        'upperLimit',
        [models.Sequelize.col('Indicator.symbol'), 'name'],
        [models.Sequelize.col('Indicator.unit'), 'unit']
      ],
      include: [{ model: models.Indicator, order: [['symbol', 'ASC']], attributes: ['name'] }]
    })
  }

  updateIndicatorStatus = async (idStation, idIndicator, status) =>
    models.StationIndicators.update({ status }, { where: { idStation, idIndicator } })
}

export default StationIndicators
