import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class MonitoringClass extends Sequelize.Model {}
  
  MonitoringClass.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      monitoringGroupId: { type: Sequelize.STRING(20), allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      isPublic: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "monitoring_classes", modelName: "MonitoringClass" }
  )

  MonitoringClass.associate = (models) => {
    // MonitoringClass.hasMany(models.IndicatorThreshold, { foreignKey: "monitoringGroupId", onDelete: 'NO ACTION' })
    MonitoringClass.hasMany(models.Station, { foreignKey: "monitoringClassId"})
    MonitoringClass.belongsTo(models.MonitoringGroup, { foreignKey: 'monitoringGroupId'})
  }
  
  return MonitoringClass
}

