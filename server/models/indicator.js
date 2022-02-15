import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Indicator extends Sequelize.Model { }

  Indicator.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      // note !!!
      monitoringType: { type: Sequelize.STRING(20), allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      unit: { type: Sequelize.STRING, allowNull: false },
      wqiIndicator: { type: Sequelize.STRING, allowNull: true },
      description: { type: Sequelize.TEXT },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "indicators", modelName: "Indicator" }
  )

  Indicator.associate = (models) => {
    Indicator.hasMany(models.IndicatorThreshold, { foreignKey: "indicatorId", onDelete: 'CASCADE', hooks: true })
    Indicator.hasMany(models.StationIndicators, { foreignKey: "idIndicator", onDelete: 'CASCADE', hooks: true })
    Indicator.belongsTo(models.MonitoringType, { foreignKey: 'monitoringType' })
  }


  return Indicator
}

