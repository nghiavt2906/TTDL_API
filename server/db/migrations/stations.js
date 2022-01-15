import Sequelize from "sequelize"

class Station extends Sequelize.Model {}

Station.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    station_group_id: { type: Sequelize.STRING(64), allowNull: false },
    symbol: { type: Sequelize.STRING, allowNull: false },
    address: { type: Sequelize.STRING, allowNull: false },
    phone: { type: Sequelize.STRING(20), allowNull: false },
    root_location: { type: Sequelize.STRING },
    lasted_location: { type: Sequelize.STRING },
    update_location_status: { type: Sequelize.TINYINT, allowNull: false },
    installed_at: { type: Sequelize.DATE },
    verified_at: { type: Sequelize.DATE },
    verification_organization: { type: Sequelize.STRING },
    emittedFrequency: { type: Sequelize.INTEGER, allowNull: false },
    // warning
    // indicators: { type: Sequelize.STRING, allowNull: false },
    ftp_folder: { type: Sequelize.STRING, allowNull: false },
    ftp_filename: { type: Sequelize.STRING, allowNull: false },
    lasted_send_at: { type: Sequelize.DATE },
    sendftp_status: { type: Sequelize.TINYINT, allowNull: false },
    reveiceftp_status: { type: Sequelize.TINYINT, allowNull: false },
    // what?
    lasted_indicator_over_threshold: { type: Sequelize.STRING(20) },
    number_of_threshold: { type: Sequelize.INTEGER },
    number_of_alert_threshold: { type: Sequelize.INTEGER },
    alert_threshold_status: { type: Sequelize.TINYINT },
    number_of_alert_structure: { type: Sequelize.INTEGER },
    alert_sturcture_status: { type: Sequelize.TINYINT },
    number_of_disconnection: { type: Sequelize.INTEGER },
    alert_disconnection_status: { type: Sequelize.TINYINT },
    battery: { type: Sequelize.INTEGER },
    activity_status: { type: Sequelize.TINYINT },
    public_status: { type: Sequelize.TINYINT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "stations" }
)

export default Station