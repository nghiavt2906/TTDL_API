import Sequelize, { Op } from "sequelize"
import MonitoringDataInfo from "./monitoring_data_info"

export default (sequelize, DataTypes) => {
  class MonitoringData extends Sequelize.Model { }

  MonitoringData.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      // note !!!
      idData: { type: Sequelize.STRING(20), allowNull: false },
      indicator: { type: Sequelize.STRING(100), allowNull: false },
      indicatorId: { type: Sequelize.STRING(20), allowNull: false },
      value: { type: Sequelize.FLOAT, allowNull: false },
      // note !!!
      unit: { type: Sequelize.STRING, allowNull: true },
      // Note !!!
      sensorStatus: { type: Sequelize.STRING(2), allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "monitoring_data", modelName: "MonitoringData" }
  )

  MonitoringData.associate = (models) => {
    MonitoringData.belongsTo(models.MonitoringDataInfo, { foreignKey: "idData" })
    MonitoringData.belongsTo(models.Indicator, { foreignKey: 'indicatorId' })
  }

  return MonitoringData

}

