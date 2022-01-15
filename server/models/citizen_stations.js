import Sequelize, { Op } from "sequelize"

export default (sequelize, DataTypes) => {
  class CitizenStation extends Sequelize.Model {}
  CitizenStation.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      citizenId: { type: Sequelize.STRING(20), allowNull: false },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      notiStatus: { type: Sequelize.BOOLEAN, allowNull: false },
      orderStation: {type: Sequelize.INTEGER, allowNull: false}
    },
    { sequelize, tableName: "citizen_stations", modelName: "CitizenStation" }
  )

  CitizenStation.associate = models => {
    CitizenStation.belongsTo(models.Citizen, { foreignKey: "citizenId", targetKey: "id"})
    CitizenStation.belongsTo(models.Station, { foreignKey: "stationId", targetKey: "id" })
  }

  return CitizenStation
}
