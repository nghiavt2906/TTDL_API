import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  class UserNotification extends Sequelize.Model {}

  UserNotification.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      type: { type: Sequelize.STRING, allowNull: false },
      receiverId: { type: Sequelize.STRING(20), allowNull: false },
      notificationId: { type: Sequelize.STRING(20), allowNull: false },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "user_notification",
      modelName: "UserNotification",
    }
  );

  UserNotification.associate = (models) => {
    UserNotification.belongsTo(models.Notification, {
      foreignKey: "notificationId",
    });
    UserNotification.belongsTo(models.User, { foreignKey: "receiverId" });
  };

  return UserNotification;
};
