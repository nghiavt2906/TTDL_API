import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class CitizenNotification extends Sequelize.Model {}

  CitizenNotification.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      type: { type: Sequelize.STRING, allowNull: true },
      // stationSender: { type: Sequelize.STRING, allowNull: true },
      receiverId: { type: Sequelize.STRING(20), allowNull: false },
      notificationId: { type: Sequelize.STRING(20), allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
      deletedAt: { type: Sequelize.DATE },
    },
    {
      sequelize,
      updatedAt: false,
      tableName: "citizen_notifications",
      modelName: "CitizenNotification",
    }
  )

  CitizenNotification.associate = (models) => {
    CitizenNotification.belongsTo(models.Notification, { foreignKey: "notificationId" })
    CitizenNotification.belongsTo(models.Citizen, { foreignKey: "receiverId" })
  }

  return CitizenNotification
}
