import Sequelize from "sequelize"
import { newId, generateToken } from "./utils"

export default (sequelize, DataTypes) => {
  class ManagerAccessToken extends Sequelize.Model {}

  ManagerAccessToken.init(
    {
      token: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      description: { type: Sequelize.TEXT }
    },
    { sequelize, timestamps: false, tableName: "manager_access_tokens", modelName: "ManagerAccessToken" }
  )

  ManagerAccessToken.associate = models => {
    ManagerAccessToken.belongsTo(models.Manager, { foreignKey: "managerId"})
  }

  return ManagerAccessToken
}
