import { Op } from "sequelize"
import models from "models"

class Role {
  constructor() {}

  getRoleById(id) {
    return models.Role.findByPk(id)
  }

  getAllRoles() {
    return models.Role.findAll()
  }

  getRoleByName(name) {
    return models.Role.findAll({ where: { name } })
  }

  checkRoleExit(roleNames) {}

  getLowerPriorityRole = async (userId) => {
    const userPriority = await models.Role.findAll({ include: [{ model: models.UserRole, where: { userId } }], attributes: ["priority"] })
    const result = await models.Role.findAll({ where: { priority: { [Op.gt]: userPriority[0].priority } }, attributes: { exclude: ["permissions"] } })
    return result
  }
}

export default Role
