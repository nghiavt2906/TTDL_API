import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Token extends Sequelize.Model {}

  Token.init(
    {
      token: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      type: { type: Sequelize.STRING, allowNull: false }
    },
    { sequelize, timestamps: false, tableName: "tokens", modelName: "Token" }
  )

  return Token
}
