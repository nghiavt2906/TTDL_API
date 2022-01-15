import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Notification extends Sequelize.Model {}

  Notification.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      type: { type: Sequelize.STRING, allowNull: false },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      contentNotification: { type: Sequelize.TEXT },
      notiTime: { type: Sequelize.DATE, allowNull: false },
      endTime: { type: Sequelize.DATE, allowNull: false },
    },
    {
      sequelize,
      updatedAt: false,
      tableName: "notifications",
      modelName: "Notification",
    }
  )

  Notification.associate = (models) => {
    Notification.hasMany(models.UserNotification, {
      foreignKey: "notificationId",
      onDelete: "CASCADE",
      hook: true,
    })
    Notification.belongsTo(models.Station, { foreignKey: "stationId" })
  }

  return Notification
}
