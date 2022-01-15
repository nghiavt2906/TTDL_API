import Sequelize,{Op} from "sequelize"
import Station from './station'
import MonitoringData from "./monitoring_data"
// import models from 'models'

export default (sequelize, DataTypes) => {
  class MonitoringDataInfo extends Sequelize.Model {}

  MonitoringDataInfo.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      sampleType: {type: Sequelize.STRING(255), allowNull: true},
      location: { type: Sequelize.STRING(60), allowNull: true },
      battery: { type: Sequelize.STRING },
      monitoringContent: { type: Sequelize.STRING(1024), allowNull: true },
      sentAt: { type: Sequelize.DATE, allowNull: false },
      isFtpdata: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1},
      isApproved: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0},
      note : {type: Sequelize.TEXT, allowNull: true},
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "monitoring_data_info", modelName: "MonitoringDataInfo" }
  )
  
  MonitoringDataInfo.associate =(models) => {
    MonitoringDataInfo.belongsTo(models.Station, {foreignKey: 'stationId'})
    MonitoringDataInfo.hasMany(models.MonitoringData, {foreignKey: 'idData', onDelete: 'CASCADE', hook: true})
  }

  
  return MonitoringDataInfo
}


