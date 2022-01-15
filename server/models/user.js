import bcrypt from "bcrypt"
import Sequelize, { Op } from "sequelize"
import { newId } from "./utils"

const SALT_ROUNDS = 10

export default (sequelize, DataTypes) => {
  class User extends Sequelize.Model {
    static comparePassword(password, hashPassword) {
      return bcrypt.compareSync(password, hashPassword)
    }
  }

  User.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
      password: { type: Sequelize.STRING, allowNull: false },
      emailVerifiedAt: { type: Sequelize.DATE },
      alertEmail: { type: Sequelize.STRING, defaultValue: null },
      phoneNumber: { type: Sequelize.STRING(15), allowNull: false },
      workplace: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      isActive: { type: Sequelize.BOOLEAN, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "users", modelName: "User" }
  )

  User.associate = models => {
    // User.belongsToMany(models.Role, { through: models.UserRole, foreignKey: "userId" })
    User.hasOne(models.UserAccessToken, { foreignKey: "userId", onDelete: "CASCADE" })
    // User.hasMany(models.UserManagement, { foreignKey: "managerId", onDelete: 'NO ACTION'})
    User.hasMany(models.UserManagement, { foreignKey: "userId", onDelete: 'CASCADE'})
    User.hasMany(models.UserStation, { foreignKey: "userId",  onDelete: "CASCADE"  })
    User.hasOne(models.UserRole, { foreignKey: "userId",  onDelete: "CASCADE"  })
  }

  User.addHook("beforeCreate", (user, options) => {
    user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)
  })

  User.addHook("beforeBulkUpdate", (user, options) => {
    // console.log(user)
    if (user.attributes.password) {
      user.attributes.password = bcrypt.hashSync(user.attributes.password, SALT_ROUNDS)
    }
  })

  return User
}
