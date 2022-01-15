import Sequelize from "sequelize"
// import models from 'models'

export default (sequelize, DataTypes) => {
  class MonitoringType extends Sequelize.Model {}

  MonitoringType.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      symbol: { type: Sequelize.STRING(20), allowNull: false },
      description: { type: Sequelize.TEXT },
      isPublic: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "monitoring_types", modelName: "MonitoringType" }
  )
  MonitoringType.associate = models => {
    MonitoringType.hasMany(models.Station, { foreignKey: "monitoringType",  onDelete: 'NO ACTION' })
    MonitoringType.hasMany(models.MonitoringGroup, {foreignKey: 'monitoringType'})
    MonitoringType.hasMany(models.Indicator, {foreignKey: 'monitoringType'})
    MonitoringType.hasMany(models.IndicatorThreshold, {foreignKey: 'monitoringType', onDelete: 'NO ACTION'})
  }
  return MonitoringType
  
}


