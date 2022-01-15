import Sequelize, { TableHints } from "sequelize"

class AlertHistory extends Sequelize.Model {}

AlertHistory.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    station_id: { type: Sequelize.STRING(64), allowNull: false },
    alert_type: { type: Sequelize.TINYINT, allowNull: false },
    alert_at: { type: Sequelize.DATE, allowNull: false },
    indicator: { type: Sequelize.STRING(64) },
    value: { type: Sequelize.FLOAT },
    unit: { type: Sequelize.STRING }
  },
  {
   
    tableName: "alert_history"
  }
)

export default AlerHistory