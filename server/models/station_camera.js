import Sequelize from "sequelize"
// import Station from "app/station"

export default (sequelize, DataTypes) => {
  class StationCamera extends Sequelize.Model {}

  StationCamera.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false},
      host: { type: Sequelize.STRING, allowNull: true },
      port: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 80 },
      camUser: { type: Sequelize.STRING, allowNull: true },
      camPass: { type: Sequelize.STRING, allowNull: true },
      rtspLink: { type: Sequelize.TEXT, allowNull: false },
      srcCam: { type: Sequelize.STRING, allowNull: true },
      pid: { type: Sequelize.INTEGER, allowNull: true},
      status: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      details: { type: Sequelize.STRING, allowNull: true},
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "station_cameras", modelName: "StationCamera" }
  )

  StationCamera.associate = models => {
    StationCamera.belongsTo(models.Station, { foreignKey: "stationId" })
  }
  return StationCamera
}
