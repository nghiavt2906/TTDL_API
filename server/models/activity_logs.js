import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class ActivityLog extends Sequelize.Model {}
  ActivityLog.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      activityType: {  type: Sequelize.STRING(20), allowNull: false },
      dataType: {  type: Sequelize.STRING(20), allowNull: false },
      handleAt: { type: Sequelize.DATE, allowNull: false },
      dataId: { type: Sequelize.STRING(20), allowNull: false },
    },
    { sequelize, timestamps: false, tableName: "activity_logs", modelName: "ActivityLog" }
  )
  
  return ActivityLog
}
