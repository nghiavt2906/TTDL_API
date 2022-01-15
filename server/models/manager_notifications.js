import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class ManagerNotifications extends Sequelize.Model {}

  ManagerNotifications.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      notificationId: { type: Sequelize.STRING(20), allowNull: false },
      isSeen: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 0},
      isRead: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 0},
      deletedAt: { type: Sequelize.DATE, allowNull: true }
    },
    { sequelize , tableName: "manager_notifications", modelName: "ManagerNotifications" }
  )

  ManagerNotifications.associate = models => {
    ManagerNotifications.belongsTo(models.Manager, { foreignKey: "managerId"})
  }

  ManagerNotifications.associate = models => {
    ManagerNotifications.belongsTo(models.Notifications, { foreignKey: "notificationId"})
  }

  return ManagerNotifications
}
