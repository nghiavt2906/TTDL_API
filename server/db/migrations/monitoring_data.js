import Sequelize from "sequelize"

class MonitoringData extends Sequelize.Model {}

MonitoringData.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    monitoring_type_id: { type: Sequelize.STRING(64), allowNull: false },
    // note !!!
    data_id: { type: Sequelize.STRING, allowNull: false },
    indicator: { type: Sequelize.STRING(20), allowNull: false },
    value: { type: Sequelize.FLOAT, allowNull: false },
    // note !!!
    unit: { type: Sequelize.STRING, allowNull: false },
    // Note !!!
    sensor_status: { type: Sequelize.STRING(2), allowNull: false }
  },
  { timestamps: false, tableName: "monitoring_data" }
)

export default MonitoringData