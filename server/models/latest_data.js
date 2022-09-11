import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class LatestData extends Sequelize.Model {}

  LatestData.init(
    {
      // id = staionId + sensorId
      id: { type: Sequelize.STRING(40), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      sentAt: { type: Sequelize.DATE, allowNull: false },
      indicator: { type: Sequelize.STRING(100), allowNull: false },
      value: { type: Sequelize.FLOAT, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      sensorStatus: { type: Sequelize.STRING(2), allowNull: false },
      updatedAt: { type: Sequelize.DATE },
    },
    { sequelize, tableName: "latest_data", modelName: "LatestData" }
  )

  return LatestData
}
