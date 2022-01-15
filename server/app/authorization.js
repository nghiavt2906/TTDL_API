import HttpStatus from "http-status-codes"
import Logger from "lib/logger"
import models from "models"

export default class Authorization {
  constructor() {}

  async hasPermission(userId, action) {
    // find permissions via userId
    // console.log('====>', userId, action)
    const userRole = await models.UserRole.findAll({ where: { userId },
      include: [models.Role]
    })
    if (!userRole) {
      throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_userId", messages: "Unauthorized" }
    }
    const role = await models.Role.findOne({ where: { id: userRole[0].roleId } })
    
    // check user permission
    const permissions = role.permissions.split(",").map(item => item.trim())
    if (!permissions.includes(action)) {
      Logger.error(`cann't ${action}`)
      throw { status: HttpStatus.UNAUTHORIZED, id: `api.authorization.cann't_${action}`, messages: "Unauthorized" }
    }

    Logger.info(`can ${action}`)

    return role.name
  }
}
