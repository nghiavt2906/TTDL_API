import bcrypt from "bcrypt"
import Sequelize, { Op } from "sequelize"
import { newId } from "./utils"

const SALT_ROUNDS = 10

export default (sequelize, DataTypes) => {
  class Manager extends Sequelize.Model {
    static comparePassword(password, hashPassword) {
      return bcrypt.compareSync(password, hashPassword)
    }
  }

  Manager.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      characterId: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
      password: { type: Sequelize.STRING, allowNull: false },
      phoneNumber: { type: Sequelize.STRING(15), allowNull: false },
      workplace: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false },
      isDefault: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 0},
      socketStatus: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 0},
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "managers", modelName: "Manager" }
  )

  Manager.associate = models => {
    // Manager.belongsToMany(models.Role, { through: models.ManagerRole, foreignKey: "managerId" })
    Manager.hasOne(models.ManagerAccessToken, { foreignKey: "managerId", onDelete: "CASCADE" })
    Manager.hasMany(models.ManagerStation, { foreignKey: "managerId",  onDelete: "CASCADE"  })
    Manager.hasMany(models.News, { foreignKey: "creatorId",  onDelete: "CASCADE"  })
    Manager.belongsTo(models.Character, { foreignKey: "characterId"})
  }

  Manager.addHook("beforeCreate", (manager, options) => {
    manager.password = bcrypt.hashSync(manager.password, SALT_ROUNDS)
  })

  Manager.addHook("beforeBulkUpdate", (manager, options) => {
    // console.log(manager)
    if (manager.attributes.password) {
      manager.attributes.password = bcrypt.hashSync(manager.attributes.password, SALT_ROUNDS)
    }
  })

  return Manager
}
