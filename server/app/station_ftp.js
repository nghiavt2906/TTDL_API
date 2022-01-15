import HttpStatus from "http-status-codes"
import { Op, where } from "sequelize"
import models from "models"

class StationFtp {
  constructor() {}

  createStationFtp = (id, info) => {
    // console.log({ id, info })
    return models.StationFtp.create({
      id: id,
      stationId: id,
      host: info.hostFtp,
      username: info.usernameFtp,
      password: info.passwordFtp,
      port: info.portFtp,
      ftpFilename: info.ftpFilename
    })
  }

  updateStationFtp = (id, info) => {
    return models.StationFtp.update({
      host: info.hostFtp,
      username: info.usernameFtp, 
      password: info.passwordFtp,
      port: info.portFtp,
      ftpFilename: info.ftpFilename
    }, 
    { where: {stationId : id}} )
  }

  findStationFtp = id => {
    return models.StationFtp.findAll({
      attributes : ['stationId'],
      where : {stationId : id}
    })
  }
  checkUniqueField = async (condition) => {
    const result = await models.StationFtp.findAll({where: condition, attributes: ['id']})
    if(result.length > 0) return false
    return true
  }

  getSampleFtp = (stationId) => {
    return models.StationFtp.findAll({
      
    })
  }
}

export default StationFtp
