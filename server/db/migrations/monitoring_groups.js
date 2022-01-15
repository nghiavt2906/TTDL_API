import Sequelize from "sequelize"

class MonitoringGroup extends Sequelize.Model {}

MonitoringGroup.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    monitoring_type_id: { type: Sequelize.STRING(64), allowNull: false },
    symbol: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "monitoring_group" }
)

export default MonitoringGroup