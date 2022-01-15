import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class MonitoringGroup extends Sequelize.Model {}
  
  MonitoringGroup.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      monitoringType: { type: Sequelize.STRING(20), allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      isPublic: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "monitoring_groups", modelName: "MonitoringGroup" }
  )

  MonitoringGroup.associate = (models) => {
    MonitoringGroup.hasMany(models.IndicatorThreshold, { foreignKey: "monitoringGroupId", onDelete: 'NO ACTION' })
    MonitoringGroup.hasMany(models.Station, { foreignKey: "monitoringGroupId",  onDelete: 'CASCADE', hooks: true })
    MonitoringGroup.belongsTo(models.MonitoringType, { foreignKey: 'monitoringType'})
  }
  
  return MonitoringGroup
}

