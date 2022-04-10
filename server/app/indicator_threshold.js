import models from "models"
import HttpStatus from "http-status-codes"
import { newId } from "models/utils"
import { Op } from "sequelize"

class IndicatorThreshold {
  constructor() { }

  async checkExistedThreshold(monitoringGroupId, indicatorId) {
    try {
      const threshold = await models.IndicatorThreshold.findAll({
        where: {
          monitoringGroupId,
          indicatorId,
        },
        attributes: ["id"],
      })
      if (threshold.length > 0) return true
      return false
    } catch (err) {
      throw err
    }
  }

  getThreshold = () => {
    return models.IndicatorThreshold.findAll({
      include: [
        {
          model: models.Indicator,
          attributes: ["name", "unit"],
          required: true,
        },
        { model: models.MonitoringGroup, attributes: ["name"], required: true },
      ],
    })
  }

  getThresholdByMonitoringType = (type) => {
    return models.IndicatorThreshold.findAll({
      where: { monitoringType: [type] },
      // attributes: ['id','upperLimit', 'lowerLimit', 'safetyDescription', 'overThresholdDescription' ],
      include: [
        {
          model: models.Indicator,
          attributes: ["name", "symbol", "unit"],
          required: true,
        },
        { model: models.MonitoringGroup, attributes: ["name"], required: true },
      ],
    })
  }

  getThresholdByMonitoringGroup = (groupId) => {
    return models.IndicatorThreshold.findAll({
      where: { monitoringGroupId: [groupId] },
      // attributes: ['id','upperLimit', 'lowerLimit', 'safetyDescription', 'overThresholdDescription' ],
      include: [
        {
          model: models.Indicator,
          attributes: ["name", "symbol", "unit"],
          required: true,
        },
        { model: models.MonitoringGroup, attributes: ["name"], required: true },
      ],
    })
  }

  findThresholdByCondition = (condition) => {
    return models.IndicatorThreshold.findAll({
      where: condition,
      attributes: [
        "monitoringGroupId",
        "upperLimit",
        "lowerLimit",
        "safetyDescription",
        "overThresholdDescription",
      ],
      include: [
        {
          model: models.Indicator,
          attributes: [["symbol", "indicatorName"], "unit"],
          required: true,
        },
        {
          model: models.MonitoringGroup,
          attributes: [["name", "groupName"]],
          required: true,
        },
      ],
      // include: [{model: Indicator, required: true},{model: MonitoringGroup, attributes : ['name'], required: true}]
    })
  }

  updateThreshold = async (id, info) => {
    let result = await models.IndicatorThreshold.update(
      {
        monitoringType: info.monitoringType,
        indicatorId: info.threshold,
        monitoringGroupId: info.monitoringGroup,
        upperLimit: info.upperLimit,
        lowerLimit: info.lowerLimit,
        safetyDescription: info.safetyDescription,
        overThresholdDescription: info.warningDescription,
      },
      {
        where: { id: [id] },
      }
    )
    let update = await models.StationIndicators.update(
      {
        upperLimit: info.upperLimit,
        lowerLimit: info.lowerLimit,
      },
      {
        where: {
          idIndicator: info.threshold,
          idStation: {
            [Op.in]: [
              models.Sequelize.literal(
                `select id from stations where monitoringGroupId = '${info.monitoringGroup}'`
              ),
            ],
          },
        },
      }
    )
    // console.log(update)
    return result
  }

  createThreshold = async (id, info) => {
    try {
      let isExistedThreshold = await this.checkExistedThreshold(
        info.monitoringGroup,
        info.threshold
      )
      if (isExistedThreshold) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.indicator.invalid",
          messages: "Chỉ số đã tồn tại!",
        }
      }
      return models.IndicatorThreshold.create({
        id: id,
        monitoringType: info.monitoringType,
        indicatorId: info.threshold,
        monitoringGroupId: info.monitoringGroup,
        upperLimit: info.upperLimit,
        lowerLimit: info.lowerLimit,
        safetyDescription: info.safetyDescription,
        overThresholdDescription: info.warningDescription,
      })
    } catch (err) {
      throw err
    }
  }

  deleteThreshold = (id) => {
    return models.IndicatorThreshold.destroy({ where: { id: [id] } })
  }

  getIndicatorThreshold = (groupId, indicatorId) => {
    return models.IndicatorThreshold.findAll({
      where: { monitoringGroupId: groupId, indicatorId: indicatorId },
      attributes: [
        "upperLimit",
        "lowerLimit",
        "safetyDescription",
        "overThresholdDescription",
      ],
      include: [
        {
          model: models.Indicator,
          attributes: [["symbol", "indicatorName"], "unit"],
          required: true,
        },
      ],
    })
  }

  getIndicatorThresholdByGroupId = (groupId) => {
    return models.IndicatorThreshold.findAll({
      raw: true,
      where: { monitoringGroupId: groupId },
      order: [[models.Sequelize.col("Indicator.symbol"), "ASC"]],
      attributes: [
        "indicatorId",
        "monitoringGroupId",
        "upperLimit",
        "lowerLimit",
        [models.Sequelize.col("Indicator.symbol"), "name"],
        [models.Sequelize.col("Indicator.unit"), "unit"],
      ],
      include: [{ model: models.Indicator, attributes: [] }],
    })
  }

  selectInfoThreshold = (monitoringGroupId, arrayIndicator) => {
    return models.IndicatorThreshold.findAll({
      where: {
        monitoringGroupId,
      },
      include: [
        {
          model: models.Indicator,
          where: {
            symbol: {
              [Op.notIn]: arrayIndicator,
            },
          },
          attributes: ["symbol"],
        },
      ],
    })
  }

  selectExistInfoThreshold = (monitoringGroupId, arrayIndicator) => {
    return models.IndicatorThreshold.findAll({
      where: {
        monitoringGroupId,
      },
      include: [
        {
          model: models.Indicator,
          where: {
            symbol: arrayIndicator,
          },
          attributes: ["symbol"],
        },
      ],
    })
  }

  selectExistedIndicator = async (monitoringGroupId) => {
    let result = await models.IndicatorThreshold.findAll({
      raw: true,
      where: {
        monitoringGroupId,
      },
      attributes: [[models.Sequelize.col("Indicator.symbol"), "name"]],
      include: [
        {
          model: models.Indicator,
          attributes: [],
        },
      ],
    })
    let indicators = result.map((item) => {
      return item.name
    })
    return indicators
  }
  insertThreshold = (monitoringGroupId, arrayInfo) => {
    const thresholds = arrayInfo.map((item) => {
      return {
        id: newId(),
        monitoringType: "QTN",
        indicatorId: item.indicatorId,
        monitoringGroupId: monitoringGroupId,
        upperLimit: item.upperLimit,
        lowerLimit: item.lowerLimit,
        safetyDescription: item.safetyDescription,
        overThresholdDescription: item.overThresholdDescription,
      }
    })
    // console.log(thresholds)
    return models.IndicatorThreshold.bulkCreate(thresholds)
  }

  autoInsertStationIndicator = async () => {
    let result = await models.Station.findAll({
      where: {
        monitoringGroupId: "pVZXXF6m4EHwn3VhohRL",
        // id: '73SywWduuD95etjlWnHa'
      },
      attributes: ["id"],
    })
    let arrayStationId = result.map((item) => {
      return item.id
    })
    // console.log(arrayStationId)
    let thresholds = await this.selectExistInfoThreshold(
      "p1R0HGiFGdyZFBuLse5b",
      ["BOD5", "COD", "Cl-", "Coliform", "DO", "ECOLI", "NH4", "PO4", "pH"]
    )
    // console.log(thresholds.length)
    let finalData = []
    arrayStationId.forEach((station) => {
      thresholds.forEach((threshold, index) => {
        finalData.push({
          id: newId(),
          idStation: station,
          idIndicator: threshold.indicatorId,
          status: "00",
          upperLimit: threshold.upperLimit,
          lowerLimit: threshold.lowerLimit,
          orderIndicator: index,
        })
      })
    })
    await models.StationIndicators.destroy({
      where: { idStation: arrayStationId },
    })
    await models.StationIndicators.bulkCreate(finalData)
    return finalData
  }

  getStationThreshold = (monitoringGroupId, arrIndicatorIds) => {
    return models.IndicatorThreshold.findAll({
      raw: true,
      where: {
        monitoringGroupId,
        indicatorId: arrIndicatorIds,
      },
      attributes: [
        "upperLimit",
        "lowerLimit",
        [models.Sequelize.col("Indicator.symbol"), "symbol"],
        [models.Sequelize.col("Indicator.unit"), "unit"],
      ],
      include: [
        {
          model: models.Indicator,
          attributes: [],
        },
      ],
    })
  }
}

export default IndicatorThreshold
