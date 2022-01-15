import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
class UserStation {
  constructor() {}

  getStationByUserId(userId){
    return models.UserStation.findAll({
      where: {userId: userId},
      include : [{ model: models.Station, attributes: [["name", "stationName"]], required: true }]
    })
  }

  getStationIdByUserId (userId){
    return models.UserStation.findAll({
      attributes: ['stationId'],
      where: {userId: userId}
    })
  }
}

export default UserStation
