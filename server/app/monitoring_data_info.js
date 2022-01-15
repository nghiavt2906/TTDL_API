import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId } from "models/utils"
import moment from "moment"

class MonitoringDataInfo {
  constructor() {}

  findMonitoringDataInfo = (id, content, time) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        stationId: id,
        sentAt: time,
      },
    })
  }

  findMonitoringDataInfoByTime = (id, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      where: { stationId: id, sentAt: { [Op.between]: [startTime, endTime] } },
      attributes: [["id", "idData"], "stationId", "sentAt"],
      order: [["sentAt", "DESC"]],
      include: [
        {
          model: models.Station,
          attributes: [["name", "stationName"]],
          required: true,
        },
      ],
    })
  }

  findMonitoringDataInfoByRawQuery = (id, indicator, startTime, endTime) => {
    return models.sequelize.query(
      `select A.sentAt as name, B.value, B.indicator from monitoring_data_info as A inner join monitoring_data as B on A.id = B.idData and A.stationId = ? and B.indicator = ? and A.sentAt between ? and ? order by A.sentAt ASC`,
      {
        replacements: [id, indicator, startTime, endTime],
        type: models.sequelize.QueryTypes.SELECT,
      }
    )
  }
  updateMonitoringDataInfo = (data, id) => {
    return models.MonitoringDataInfo.update(
      {
        location: data.location,
        battery: data.battery,
        monitoringContent: data.monitoringContent,
      },
      { where: { id: id } }
    )
  }

  createMonitoringDataInfo = (data) => {
    return models.MonitoringDataInfo.create({
      id: data.id,
      stationId: data.stationId,
      location: data.location,
      battery: data.battery,
      monitoringContent: data.monitoringContent,
      sentAt: data.sentAt,
      isFtpdata: data.isFtpdata,
    })
  }

  getDataIndicatorByHour = (stationId, indicator, startTime, endTime) => {
    // let rawQuery = `SELECT DATEPART(HOUR, A.sentAt) as hour, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by DATEPART(HOUR, A.sentAt) order by DATEPART(HOUR, A.sentAt) asc`
    let rawQuery = `SELECT DATE_FORMAT(sentAt, "%Y-%m-%d %H:00:00") as time, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by time order by time asc`
    // let rawQuery = `SELECT EXTRACT(HOUR FROM A.sentAt) as hour, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by hour order by hour asc`
    return models.sequelize.query(rawQuery, {
      type: models.sequelize.QueryTypes.SELECT,
    })
  }

  getDataIndicatorByWeek = (stationId, indicator, startTime, endTime) => {
    // let rawQuery = `SELECT DATEPART(DAY, A.sentAt) as day, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by DATEPART(DAY, A.sentAt) order by DATEPART(DAY, A.sentAt) asc`
    let rawQuery = `SELECT DATE_FORMAT(sentAt, "%Y-%m-%d") as time, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by time order by time asc`
    // let rawQuery = `SELECT EXTRACT(DAY FROM A.sentAt) as day, ROUND(AVG(B.value),2) as avg from monitoring_data_info as A INNER JOIN monitoring_data as B ON A.id = B.idData and indicator = '${indicator}' and A.stationId = '${stationId}' and A.sentAt BETWEEN '${startTime}' AND '${endTime}' group by day order by day asc`

    return models.sequelize.query(rawQuery, {
      type: models.sequelize.QueryTypes.SELECT,
    })
  }

  createManualData = async (data) => {
    try {
      await models.sequelize.transaction(async (t) => {
        await models.MonitoringDataInfo.bulkCreate(data, {
          include: [{ model: models.MonitoringData }],
          transaction: t,
        })
      })
    } catch (err) {
      // console.log(err)
      throw err
    }
    // return models.MonitoringDataInfo.bulkCreate(
    //   data, {

    //     include: [{model: models.MonitoringData}]
    //   }
    // )
  }

  createData = async (data) => {
    try {
      await models.sequelize.transaction(async (t) => {
        await models.MonitoringDataInfo.create(data, {
          include: [{ model: models.MonitoringData }],
          transaction: t,
        })
      })
    } catch (err) {
      throw err
    }
  }

  searchManualData = (stationId, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
        isFtpdata: 2,
      },
      attributes: [
        "id",
        "sentAt",
        "note",
        "sampleType",
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  searchManualDataById = (dataId) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        id: dataId,
      },
      // group: [models.Sequelize.col('Station.symbol')],
      order: [[models.Sequelize.col("Station.symbol"), "ASC"]],
      attributes: [
        "id",
        "sentAt",
        "note",
        "sampleType",
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  searchMonitoringData = (stationId, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      order: [["sentAt", "ASC"]],
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        "id",
        "sentAt",
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  deleteDataById = (dataId) => {
    return models.MonitoringDataInfo.destroy({
      where: { id: dataId },
    })
  }

  // Handle data
  searchSpecificData = (stationId, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      order: [["sentAt", "ASC"]],
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
        // isFtpdata : 2
      },
      attributes: [
        "id",
        "sentAt",
        // 'note',
        // 'sampleType',
        "isApproved",
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  // Handle data
  searchPaginationSpecificData = (
    stationId,
    startTime,
    endTime,
    page,
    limit
  ) => {
    console.log(stationId, startTime, endTime, page, limit)
    return models.MonitoringDataInfo.findAll({
      order: [["sentAt", "ASC"]],
      limit: limit,
      offset: (page - 1) * limit,
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: ["id", "sentAt", "isApproved"],
      include: [
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  // Handle data
  getStationMonitoringData = (stationId, startAt, endAt, offset, limit) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        stationId,
        sentAt: { [Op.between]: [startAt, endAt] },
      },
      attributes: [
        "id",
        "sentAt",
        // 'isApproved',
        // [models.Sequelize.col('Station.name'), 'name'],
        // [models.Sequelize.col('Station.symbol'), 'symbol']
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
      order: [["sentAt", "DESC"]],
      limit: limit,
      offset: offset,
    })
  }

  searchSpecificDataById = (dataId) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        id: dataId,
      },
      attributes: [
        "id",
        "sentAt",
        // 'note',
        // 'sampleType',
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          attributes: ["indicator", "value"],
        },
      ],
    })
  }

  deleteData = (dataId) => {
    return models.MonitoringDataInfo.destroy({
      where: {
        id: dataId,
      },
    })
  }

  updateData = async (dataId, data) => {
    await models.MonitoringDataInfo.update(
      { sentAt: moment.utc(data.sentAt).format() },
      { where: { id: dataId } }
    )
    const newMonitoringData = data.monitoringData.map((item) => {
      return {
        id: newId(),
        idData: dataId,
        indicator: item.indicator,
        value: item.value,
        unit: item.unit,
        sensorStatus: "00",
      }
    })
    // console.log(newMonitoringData)
    await models.MonitoringData.destroy({ where: { idData: dataId } })
    await models.MonitoringData.bulkCreate(newMonitoringData)
  }

  createOneData = async (data) => {
    const newMonitoringData = data.monitoringData.map((item) => {
      return {
        id: newId(),
        indicator: item.indicator,
        value: item.value,
        unit: item.unit,
        sensorStatus: "00",
      }
    })
    return models.MonitoringDataInfo.create(
      {
        id: newId(),
        stationId: data.id,
        sentAt: moment.utc(data.sentAt).format(),
        MonitoringData: newMonitoringData,
      },
      {
        include: [{ model: models.MonitoringData }],
      }
    )
  }

  getLatestSentAtPublic = async (stationId) => {
    const station = await models.MonitoringDataInfo.findAll({
      where: { stationId },
      attributes: ["sentAt"],
      limit: 1,
      order: [["sentAt", "DESC"]],
    })
    if (station.length > 0) {
      return station[0].sentAt
    } else {
      return null
    }
  }
  //FTP
  getLatestSentAt = async (stationId) => {
    const station = await models.MonitoringDataInfo.findAll({
      raw: true,
      where: { stationId },
      order: [["sentAt", "DESC"]],
      limit: 1,
      attributes: ["sentAt"],
    })
    if (station.length > 0) {
      return station[0].sentAt
    } else {
      return null
    }
  }

  //Report
  searchDataGeneral1 = (stationId, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        [models.Sequelize.col("Station.name"), "name"],
        [models.Sequelize.col("Station.symbol"), "symbol"],
        [
          [
            models.Sequelize.fn(
              "avg",
              models.Sequelize.col("MonitoringDatas.value")
            ),
            "avg",
          ],
        ],
        [
          [
            models.Sequelize.fn(
              "max",
              models.Sequelize.col("MonitoringDatas.value")
            ),
            "max",
          ],
        ],
        [
          [
            models.Sequelize.fn(
              "min",
              models.Sequelize.col("MonitoringDatas.value")
            ),
            "min",
          ],
        ],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
        },
        {
          model: models.MonitoringData,
          indicator: ["pH"],
          attributes: [],
        },
      ],
    })
  }

  searchDataGeneral = (stationId, arrIndicator, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      raw: true,
      group: [models.Sequelize.col("MonitoringData.indicator")],
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        [models.Sequelize.col("MonitoringData.indicator"), "indicator"],
        [
          models.Sequelize.fn(
            "round",
            models.Sequelize.fn(
              "avg",
              models.Sequelize.col("MonitoringData.value")
            ),
            2
          ),
          "avg",
        ],
        [
          models.Sequelize.fn(
            "round",
            models.Sequelize.fn(
              "max",
              models.Sequelize.col("MonitoringData.value")
            ),
            2
          ),
          "max",
        ],
        [
          models.Sequelize.fn(
            "round",
            models.Sequelize.fn(
              "min",
              models.Sequelize.col("MonitoringData.value")
            ),
            2
          ),
          "min",
        ],
      ],
      include: [
        {
          model: models.MonitoringData,
          where: {
            indicator: arrIndicator,
          },
          attributes: [
            // 'indicator',
            // [models.Sequelize.fn('avg', models.Sequelize.col('value')), 'avg'],
            // [models.Sequelize.fn('max', models.Sequelize.col('value')), 'max'],
            // [models.Sequelize.fn('min', models.Sequelize.col('value')), 'min']
          ],
        },
      ],
    })
  }

  getAverageData = (stationId, arrIndicator, startTime, endTime) => {
    return models.MonitoringDataInfo.findAll({
      raw: true,
      group: [models.Sequelize.col("MonitoringData.indicator")],
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        [models.Sequelize.col("MonitoringData.indicator"), "indicator"],
        [
          models.Sequelize.fn(
            "round",
            models.Sequelize.fn(
              "avg",
              models.Sequelize.col("MonitoringData.value")
            ),
            2
          ),
          "avg",
        ],
      ],
      include: [
        {
          model: models.MonitoringData,
          where: {
            indicator: arrIndicator,
          },
          attributes: [
            // 'indicator',
            // [models.Sequelize.fn('avg', models.Sequelize.col('value')), 'avg'],
            // [models.Sequelize.fn('max', models.Sequelize.col('value')), 'max'],
            // [models.Sequelize.fn('min', models.Sequelize.col('value')), 'min']
          ],
        },
      ],
    })
  }

  approveData = (arrayDataId) => {
    return models.MonitoringDataInfo.update(
      { isApproved: 1 },
      { where: { id: arrayDataId } }
    )
  }

  cancelApproveData = (arrayDataId) => {
    return models.MonitoringDataInfo.update(
      { isApproved: 0 },
      { where: { id: arrayDataId } }
    )
  }

  getTotalData = (stationId, startAt, endAt) => {
    return models.MonitoringDataInfo.count({
      where: {
        stationId,
        sentAt: { [Op.between]: [startAt, endAt] },
      },
    })
  }

  testTransaction = async () => {
    try {
      let result = await models.sequelize.transaction(async (t) => {
        await models.MonitoringDataInfo.create(
          {
            id: "o1qu0pBhRvm7RvkYKE0o",
            stationId: "v2uV7JhtRI8X5fMOn0UE",
            sentAt: "2020-05-04 15:00:00",
          },
          { transaction: t }
        )
        await models.MonitoringData.create(
          {
            id: "00002Bq5xuKnmHEasYQ6",
            idData: "o1qu0pBhRvm7RvkYKE0o",
            indicator: "CO",
            value: "",
            unit: "",
            sensorStatus: "01",
          },
          { transaction: t }
        )
      })
      // console.log({result})
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  getIndicatorData = async (stationId, indicator, startTime, endTime, limit, page) => {
    const result =  models.MonitoringDataInfo.findAll({
      // raw: true,
      order: [["sentAt", "ASC"]],
      limit: limit,
      offset: (page-1)*limit,
      where: {
        stationId,
        sentAt: { [Op.between]: [startTime, endTime] },
      },
      attributes: [
        "sentAt"
      ],
      include: [
        {
          model: models.MonitoringData,
          attributes: ['value'],
          where: {
            indicator,
          },
        },
      ],
    })

    const formatData = result.map(item => {
      return {
        sentAt: item.sentAt,
        value: item.MonitoringData[0].dataValues.value
      }
    })
    return formatData
  }
}

export default MonitoringDataInfo
