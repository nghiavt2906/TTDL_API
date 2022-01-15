import models from "models"
import { newId } from "models/utils"
import { Op } from "sequelize"
import HttpStatus from "http-status-codes"

export default class SampleHistory {
  constructor() {}

  createHistory = (stationId, managerId, sampleId, sampleAt) => {
    return models.SampleHistory.create({
      id: newId(),
      stationId,
      managerId,
      sampleId,
      sampleAt,
    })
  }

  getSampleHistoryBySampleId = (stationId) => {
    return models.SampleHistory.findAll({
      where: { stationId },
      order: [['sampleAt', 'DESC']],
      attributes:[
        'sampleAt',
        'finishAt',
        'bottle',
        [models.Sequelize.col("Manager.name"), "manager"],
        [models.Sequelize.col("Station.name"), "station"],    
      ],
      include: [{
        model: models.Manager, attributes: []
      },{
        model: models.Station, attributes: []
      }] 
    })
  }

  updateHistory = async (sampleId, finishAt, bottle) => {
    let history = await this.getSampleHistoryBySampleId(sampleId)
    if (history.length === 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "sample.invalid",
        messages: "id không tồn tại!",
      }
    }
    return models.SampleHistory.update(
      {
        finishAt,
        bottle,
      },
      { where: { sampleId } }
    )
  }
}
