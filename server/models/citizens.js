import bcrypt from "bcrypt"
import Sequelize, { Op } from "sequelize"
import { newId } from "./utils"

const SALT_ROUNDS = 10

export default (sequelize, DataTypes) => {
  class Citizen extends Sequelize.Model {
    static comparePassword(password, hashPassword) {
      return bcrypt.compareSync(password, hashPassword)
    }
  }

  Citizen.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      username: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true } },
      password: { type: Sequelize.STRING, allowNull: true },
      address: { type: Sequelize.STRING, allowNull: true },
      socialId: { type: Sequelize.STRING, allowNull: true },
      authType: {type: Sequelize.STRING(50), allowNull: true},
      notiStatus : { type: Sequelize.BOOLEAN, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "citizens", modelName: "Citizen" }
  )

  Citizen.associate = models => {
    Citizen.hasOne(models.CitizenAccessToken, { foreignKey: "citizenId", onDelete: "CASCADE", hooks: true })
    Citizen.hasMany(models.CitizenStation, { foreignKey: "citizenId",  onDelete: "CASCADE", hooks: true  })
    Citizen.hasOne(models.CitizenSocialLogin, { foreignKey: "citizenId",  onDelete: "CASCADE", hooks: true  })
  }

  Citizen.addHook("beforeCreate", (user, options) => {
    if(user.password !== null){
      user.password = bcrypt.hashSync(user.password, SALT_ROUNDS)
    }
    
  })

  Citizen.addHook("beforeBulkUpdate", (user, options) => {
    // console.log(user)
    if (user.attributes.password) {
      user.attributes.password = bcrypt.hashSync(user.attributes.password, SALT_ROUNDS)
    }
  })

  return Citizen
}
