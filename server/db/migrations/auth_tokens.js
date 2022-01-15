import Sequelize from "sequelize"

class Token extends Sequelize.Model {}

Token.init(
  {
    token: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
    created_at: { type: Sequelize.DATE, allowNull: false },
    type: { type: Sequelize.STRING, allowNull: false }
  },
  { tableName: "auth_token" }
)

export default Token