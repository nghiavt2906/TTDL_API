import Sequelize from "sequelize"
// import MonitoringDataInfo from './monitoring_data_info'
// import models from 'models'
// import {changeBoleanToTinyInt} from 'utils/functions'

export default (sequelize, DataTypes) => {
  class Station extends Sequelize.Model { }

  Station.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      monitoringType: { type: Sequelize.STRING(20), allowNull: false },
      monitoringGroupId: { type: Sequelize.STRING(20), allowNull: false },
      districtId: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      address: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING(20), allowNull: false },
      image: { type: Sequelize.STRING(1024), allowNull: false },
      rootLocation: { type: Sequelize.STRING },
      verifiedAt: { type: Sequelize.DATE },
      verificationOrganization: { type: Sequelize.STRING },
      isManualStation: { type: Sequelize.TINYINT, allowNull: true, defaultValue: 0 },
      // warning
      activeState: { type: Sequelize.STRING(50), allowNull: false, defaultValue: 'NORMAL' },
      // activeState = 'NORMAL' || 'OVER_THRESHOLD' || 'DISCONNECT' || 'WRONG_FORMAT'
      envIndex: { type: Sequelize.INTEGER, allowNull: true, defaultValue: null },
      latestSentAt: { type: Sequelize.DATE },
      sendftpStatus: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      receiveftpStatus: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      // what?
      lastedIndicatorOverThreshold: { type: Sequelize.STRING(20) },
      numberOfThreshold: { type: Sequelize.INTEGER, defaultValue: 0 },
      numberOfAlertThreshold: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertThresholdStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      numberOfAlertStructure: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertStructureStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      numberOfDisconnection: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertDisconnectionStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      syncDataBotnmtStatus: { type: Sequelize.TINYINT, defaultValue: 0 },
      activityStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      publicStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "stations", modelName: "Station" }
  )

  Station.associate = models => {
    Station.hasMany(models.StationCamera, { foreignKey: "stationId", onDelete: 'CASCADE', hooks: true })
    Station.hasMany(models.MonitoringDataInfo, { foreignKey: 'stationId' })
    Station.hasMany(models.StationIndicators, { foreignKey: 'idStation', onDelete: 'CASCADE', hooks: true })
    Station.hasOne(models.StationFtp, { foreignKey: 'stationId', onDelete: 'CASCADE', hooks: true })
    Station.belongsTo(models.MonitoringType, { foreignKey: 'monitoringType' })
    Station.belongsTo(models.MonitoringGroup, { foreignKey: 'monitoringGroupId' })
    Station.belongsTo(models.District, { foreignKey: 'districtId' })
    Station.hasMany(models.Notification, { foreignKey: "stationId", onDelete: 'CASCADE', hooks: true })
    Station.hasOne(models.StationAutoParameter, { foreignKey: "stationId", onDelete: 'CASCADE', hooks: true })
    Station.hasMany(models.ManagerStation, { foreignKey: "stationId", onDelete: 'CASCADE', hooks: true })
    Station.hasMany(models.SampleHistory, { foreignKey: "stationId", onDelete: 'CASCADE', hooks: true })
    Station.hasMany(models.ApiSharedStation, { foreignKey: 'stationId', onDelete: 'CASCADE', hooks: true })
  }


  return Station
}

