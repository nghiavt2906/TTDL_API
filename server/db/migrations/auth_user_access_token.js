import Sequelize from "sequelize"

class AccessToken extends Sequelize.Model {}

AccessToken.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    token: { type: Sequelize.STRING, allowNull: false },
    user_id: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT }
  },
  { tableName: "auth_user_access_token" }
)

export default  AccessToken