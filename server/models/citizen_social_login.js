import bcrypt from "bcrypt"
import Sequelize, { Op } from "sequelize"

export default (sequelize, DataTypes) => {
  class CitizenSocialLogin extends Sequelize.Model {}

  CitizenSocialLogin.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      citizenId: { type: Sequelize.STRING(20), allowNull: false },
      socialId: { type: Sequelize.STRING(255), allowNull: true },
      authType : { type: Sequelize.STRING(50), allowNull: false }
    },
    { sequelize, tableName: "citizen_social_login", modelName: "CitizenSocialLogin" }
  )

  CitizenSocialLogin.associate = models => {
    CitizenSocialLogin.belongsTo(models.Citizen, { foreignKey: "citizenId"})
  }

  return CitizenSocialLogin
}
