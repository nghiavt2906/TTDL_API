import Sequelize from "sequelize"
import Indicator from "./indicator"
import MonitoringGroup from "./monitoring_group"

export default (sequelize, DataTypes) => {
  class IndicatorThreshold extends Sequelize.Model { }

  IndicatorThreshold.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      monitoringType: { type: Sequelize.STRING(20), allowNull: false },
      indicatorId: { type: Sequelize.STRING(20), allowNull: false },
      monitoringGroupId: { type: Sequelize.STRING(20), allowNull: false },
      upperLimit: { type: Sequelize.FLOAT, allowNull: false },
      lowerLimit: { type: Sequelize.FLOAT, allowNull: false },
      safetyDescription: { type: Sequelize.TEXT },
      overThresholdDescription: { type: Sequelize.TEXT },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "indicator_threshold", modelName: "IndicatorThreshold" }
  )

  IndicatorThreshold.associate = (models) => {
    IndicatorThreshold.belongsTo(models.MonitoringType, { foreignKey: 'monitoringType' })
    IndicatorThreshold.belongsTo(models.MonitoringGroup, { foreignKey: "monitoringGroupId" })
    IndicatorThreshold.belongsTo(models.Indicator, { foreignKey: "indicatorId" })
    IndicatorThreshold.hasOne(models.IndicatorImage, { foreignKey: 'indicatorThresholdId', onDelete: 'CASCADE', hooks: true })
  }


  return IndicatorThreshold
}
