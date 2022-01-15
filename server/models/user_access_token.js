import Sequelize from "sequelize"
import { newId, generateToken } from "./utils"

export default (sequelize, DataTypes) => {
  class UserAccessToken extends Sequelize.Model {}

  UserAccessToken.init(
    {
      token: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      userId: { type: Sequelize.STRING(20), allowNull: false },
      description: { type: Sequelize.TEXT }
    },
    { sequelize, timestamps: false, tableName: "user_access_tokens", modelName: "UserAccessToken" }
  )

  UserAccessToken.associate = models => {
    UserAccessToken.belongsTo(models.User, { foreignKey: "userId"})
  }

  return UserAccessToken
}
