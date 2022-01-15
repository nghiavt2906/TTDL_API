import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class ManagerSocket extends Sequelize.Model {}

  ManagerSocket.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      socketId: { type: Sequelize.STRING(50), allowNull: false }
    },
    { sequelize , timestamps: false,  tableName: "manager_socket", modelName: "ManagerSocket" }
  )

  // ManagerNotifications.associate = models => {
  //   ManagerNotifications.belongsTo(models.Manager, { foreignKey: "managerId"})
  // }

  return ManagerSocket
}