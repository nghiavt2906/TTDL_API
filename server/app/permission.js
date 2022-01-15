
import models from "models"
import {Op} from "sequelize"

class Permission {
  constructor() {}

  async getPermission() {
    return models.Permission.findAll({
      where: {isVisible: 1},
      order: [['id','ASC']],
      attributes: ['id', 'displayName']
    })
  }

  async getUnsubmitPermission(pemissions) {
    return models.Permission.findAll({
      where: {
        id : {
          [Op.not] : pemissions
        }
        
      },
      attributes: ['id']
    })
  }
}

export default Permission
