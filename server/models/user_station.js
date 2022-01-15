import Sequelize, { Op } from "sequelize"

export default (sequelize, DataTypes) => {
  class UserStation extends Sequelize.Model {}
  UserStation.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      userId: { type: Sequelize.STRING(20), allowNull: false },
      stationId: { type: Sequelize.STRING(20), allowNull: false }
    },
    { sequelize, tableName: "user_station", modelName: "UserStation" }
  )

  UserStation.associate = models => {
    UserStation.belongsTo(models.User, { foreignKey: "userId", targetKey: "id"})
    UserStation.belongsTo(models.Station, { foreignKey: "stationId", targetKey: "id" })
  }

  return UserStation
}
