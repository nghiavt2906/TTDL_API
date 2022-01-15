import Sequelize from "sequelize"
import Indicator from "./indicator"
import Station from "./station"

export default (sequelize, DataTypes) => {
  class StationIndicators extends Sequelize.Model {}
  StationIndicators.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      idStation: { type: Sequelize.STRING(20), allowNull: false },
      idIndicator: { type: Sequelize.STRING(20), allowNull: false },
      status: { type: Sequelize.STRING(20), allowNull: false },
      upperLimit: { type: Sequelize.FLOAT, allowNull: false },
      lowerLimit: { type: Sequelize.FLOAT, allowNull: false },
      orderIndicator: {type: Sequelize.INTEGER, allowNull: false},
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "station_indicators", modelName: "StationIndicators" }
  )
  StationIndicators.associate = (models) => {
    StationIndicators.belongsTo(models.Station, { foreignKey: "idStation" })
    StationIndicators.belongsTo(models.Indicator, { foreignKey: "idIndicator" })
  }

  return StationIndicators
}

