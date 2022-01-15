import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId } from "models/utils"

class Indicator {
  constructor() {}

  async checkExistedIndicator(symbol, monitoringType) {
    try {
      const indicator = await models.Indicator.findAll({
        where: { symbol, monitoringType },
        attributes: ["id"],
      })
      if (indicator.length > 0) return true
      return false
    } catch (err) {
      throw err
    }
  }

  getIndicatorName = (monitoringType) => {
    return models.Indicator.findAll({
      where: { monitoringType: [monitoringType] },
      attributes: ["id", "name", "monitoringType", "symbol"],
    })
  }
  getIndicatorInfo = (monitoringType) => {
    return models.Indicator.findAll({
      where: { monitoringType: [monitoringType] },
      order: [['name', 'ASC']],
      attributes: [
        "id",
        "name",
        "monitoringType",
        "symbol",
        "unit",
        "description",
      ],
    })
  }

  deleteIndicator = (id) => {
    return models.Indicator.destroy({ where: { id: [id] } })
  }

  updateIndicator = (id, info) => {
    return models.Indicator.update(
      {
        name: info.indicator,
        monitoringType: info.monitoringType,
        symbol: info.symbol,
        unit: info.unit,
        description: info.description,
      },
      { where: { id: [id] } }
    )
  }

  createIndicator = async (id, info) => {
    try {
      let isExistedIndicator = await this.checkExistedIndicator(
        info.symbol,
        info.monitoringType
      )
      if (isExistedIndicator) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.indicator.invalid",
          messages: "Chỉ số đã tồn tại!",
        }
      }
      return models.Indicator.create({
        id: id,
        name: info.indicator,
        monitoringType: info.monitoringType,
        symbol: info.symbol,
        unit: info.unit,
        description: info.description,
      })
    } catch (err) {
      throw err
    }
  }

  getIndicatorByType = (monitoringType) => {
    return models.Indicator.findAll({
      where: { monitoringType: [monitoringType] },
      attributes: ["id", "name", "symbol"],
    })
  }

  getIndicatorByCondition = (condition, attributes) => {
    return models.Indicator.findAll({
      where: condition,
      attributes: attributes,
      order: [["symbol", "ASC"]],
    })
  }
}

export default Indicator
