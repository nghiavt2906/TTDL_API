import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class AlertHistory extends Sequelize.Model {}
  AlertHistory.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      alertType: { type: Sequelize.TINYINT, allowNull: false },
      alertAt: { type: Sequelize.DATE, allowNull: false },
      indicator: { type: Sequelize.STRING(64) },
      value: { type: Sequelize.FLOAT },
      unit: { type: Sequelize.STRING }
    },
    { sequelize, timestamps: false, tableName: "alert_history", modelName: "AlertHistory" }
  )
  
  return AlertHistory
}
