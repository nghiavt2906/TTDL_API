import Sequelize from "sequelize"

class MonitoringDataInfo extends Sequelize.Model {}

MonitoringDataInfo.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    station_id: { type: Sequelize.STRING(64), allowNull: false },
    location: { type: Sequelize.STRING(60) },
    battery: { type: Sequelize.STRING },
    monitoring_content: { type: Sequelize.STRING(500), allowNull: false },
    send_at: { type: Sequelize.DATE, allowNull: false },
    is_ftpdata: { type: Sequelize.TINYINT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "monitoring_data_info" }
)

export default MonitoringDataInfo