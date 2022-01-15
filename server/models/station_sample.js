import Sequelize from "sequelize"
// import Station from "app/station"

export default (sequelize, DataTypes) => {
  class StationSample extends Sequelize.Model {}

  StationSample.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      host: { type: Sequelize.STRING, allowNull: false},
      port: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 3100 },
      username: { type: Sequelize.STRING, allowNull: false },
      password: { type: Sequelize.STRING, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "station_sample", modelName: "StationSample" }
  )

  StationSample.associate = models => {
    StationSample.belongsTo(models.Station, { foreignKey: "stationId" })
  }
  return StationSample
}
