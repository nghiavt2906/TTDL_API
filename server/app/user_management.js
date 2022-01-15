import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
class UserManagement {
  constructor() {}

  getManagedUser(managerId){
    return models.UserManagement.findAll({
      attributes: ['managerId','userId'],
      where: { managerId : managerId},
      include: [{ 
        model: models.User,
        attributes: ['name','email','phoneNumber','workplace','address'], 
        include: [{
          model : models.UserStation,
          attributes : ['stationId'],
          include : [{
            model : models.Station,
            attributes : [['name', 'stationName']]
          }]
        }, 
        {
          model : models.UserRole, 
          attributes : ['roleId'],
          include: [{
            model: models.Role,
            attributes: [['displayName', 'roleName']]
          }]
        }] 
      }] 
    })
  }
 
}

export default UserManagement
