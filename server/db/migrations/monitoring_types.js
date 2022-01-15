import Sequelize from "sequelize"

class MonitoringTypes extends Sequelize.Model {}

MonitoringTypes.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    symbol: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false }
  },
  { timestamps: false, tableName: "monitoring_types" }
)

export default MonitoringTypes