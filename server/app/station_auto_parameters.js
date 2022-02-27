import HttpStatus from "http-status-codes"
import { Op, where } from "sequelize"
import models from "models"

class StationAutoParameters {
  constructor() { }

  getWrongStructureSettings = (stationId) => {
    return models.StationAutoParameter.findOne({
      raw: true,
      where: { stationId },
      attributes: [
        "defaultAlertWrongStructureTimes",
        "numberOfAlertStructure",
        "alertStructureStatus",
      ],
    })
  }

  getDisconnectionSettings = (stationId) => {
    return models.StationAutoParameter.findOne({
      raw: true,
      where: { stationId },
      attributes: [
        "defaultAlertDisconnectionTimes",
        "numberOfDisconnection",
        "alertDisconnectionStatus",
        "disconnectTime",
      ],
    })
  }

  getOverThresholdSettings = (stationId) => {
    return models.StationAutoParameter.findOne({
      raw: true,
      where: { stationId },
      attributes: [
        "numberOfAlertThreshold",
        "alertThresholdStatus",
      ],
    })
  }
}

export default StationAutoParameters
