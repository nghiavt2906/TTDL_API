import Sequelize from "sequelize"
import { newId, generateToken } from "./utils"

export default (sequelize, DataTypes) => {
  class CitizenAccessToken extends Sequelize.Model {}

  CitizenAccessToken.init(
    {
      token: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      citizenId: { type: Sequelize.STRING(20), allowNull: false },
      description: { type: Sequelize.TEXT }
    },
    { sequelize, timestamps: false, tableName: "citizen_access_tokens", modelName: "CitizenAccessToken" }
  )

  CitizenAccessToken.associate = models => {
    CitizenAccessToken.belongsTo(models.Citizen, { foreignKey: "citizenId"})
  }

  return CitizenAccessToken
}
