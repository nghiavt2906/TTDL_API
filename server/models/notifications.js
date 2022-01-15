import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Notifications extends Sequelize.Model {}

  Notifications.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      type: { type: Sequelize.STRING, allowNull: false },
      dataId: { type: Sequelize.STRING(20), allowNull: false },
      contentNotification: { type: Sequelize.TEXT },
      detail: { type: Sequelize.TEXT },
      deletedAt: { type: Sequelize.DATE, allowNull: true },
    },
    { sequelize, tableName: "notifications", modelName: "Notifications" }
  )

  Notifications.associate = (models) => {
    Notifications.hasMany(models.ManagerNotifications, {
      foreignKey: "notificationId",
      onDelete: "CASCADE",
      hook: true,
    })
  }

  return Notifications
}
