import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"

class System {
  constructor() {}

  getSystemParams = (id) => {
    return models.System.findAll({where: {idSystem : [id]}})
  }

  findSystemInfo = (id, attributes) => {
    return models.System.findAll({
      raw: true,
      where: {
        idSystem : [id], 
        name: {
          [Op.or] : attributes
        }
      }
    })
  }

  updateSystemById = (attributes, id) => {
    return models.System.update(attributes, {where: {idSystem : [id]}})
  }

  updateSystem = (attributes, value) => {
    // console.log(attributes, value)
    return models.System.update({value : value}, {where: { name : attributes}})
  }
}

export default System
