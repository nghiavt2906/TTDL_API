import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class ManagerNotificationSettings extends Sequelize.Model {}

  ManagerNotificationSettings.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      type: { type: Sequelize.STRING(50), allowNull: false },
      status: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 0 },
      emailAlertStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      notificationAlertStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      overThresholdAlertStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      wrongStructureAlertStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      disconnectionAlertStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "manager_notification_settings",
      modelName: "ManagerNotificationSettings",
    }
  )

  // ManagerNotificationSettings.associate = models => {
  //   ManagerAccessToken.belongsTo(models.Manager, { foreignKey: "managerId"})
  // }

  return ManagerNotificationSettings
}
