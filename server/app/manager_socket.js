import models from "models"
import { newId } from "models/utils"
import app from 'app'
import HttpStatus from "http-status-codes"
import moment from 'moment'

class ManagerSocket {
  constructor(){}

  create (managerId, socketId) {
    return models.ManagerSocket.create({
      id : newId(),
      managerId, socketId
    })
  }

  delete (socketId) {
    return models.ManagerSocket.destroy({
      where: {
        socketId
      }
    })
  }

  deleteAll () {
    return models.ManagerSocket.destroy({
      where: {}
    })
  }

  getByManagerId (managerId) {
    return models.ManagerSocket.findAll({
      raw: true,
      attributes: ['socketId'],
      where: {
        managerId
      }
    })
  }

  getManagerIdBySocketId (socketId) {
    return models.ManagerSocket.findOne({
      attributes: ['managerId'],
      raw: true,
      where: {
        socketId
      }
    })
  }

  async checkManagerConnectSocket (socketId) {
    const result = await models.ManagerSocket.findAll({
      raw : true,
      where: {
        socketId
      }
    })

    if(result.length > 0){
      return 1
    }
    return 0
  }

}

export default ManagerSocket