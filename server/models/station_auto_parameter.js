import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class StationAutoParameter extends Sequelize.Model {}

  StationAutoParameter.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      disconnectTime : {type: Sequelize.INTEGER, allowNull: true, defaultValue: 60},
      activeState: { type: Sequelize.STRING(50), allowNull: false,  defaultValue: 'NORMAL'  },
      // activeState = 'NORMAL' || 'OVER_THRESHOLD' || 'DISCONNECT' || 'WRONG_FORMAT'
      envIndex : {type: Sequelize.INTEGER, allowNull: true, defaultValue : 0},
      latestSentAt: { type: Sequelize.DATE },
      sendftpStatus: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      receiveftpStatus: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      latestIndicatorOverThreshold: { type: Sequelize.STRING(20) },
      numberOfThreshold: { type: Sequelize.INTEGER, defaultValue: 0 },
      numberOfAlertThreshold: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertThresholdStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      numberOfAlertStructure: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertStructureStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      numberOfDisconnection: { type: Sequelize.INTEGER, defaultValue: 0 },
      alertDisconnectionStatus: { type: Sequelize.TINYINT, defaultValue: 1 },
      getDataDuration: { type: Sequelize.INTEGER, defaultValue: 5 }
    },
    { sequelize, tableName: "station_auto_parameters", modelName: "StationAutoParameter" }
  )

  StationAutoParameter.associate = models => {
    StationAutoParameter.belongsTo(models.Station, { foreignKey: 'stationId'})
  }

  return StationAutoParameter
}

