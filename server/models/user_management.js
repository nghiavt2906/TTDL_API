import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class UserManagement extends Sequelize.Model {}

  UserManagement.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      userId: { type: Sequelize.STRING(20), allowNull: false }
    },
    { sequelize, tableName: "user_management", modelName: "UserManagement" }
  )

  UserManagement.associate = models => {
    // UserManagement.belongsTo(models.User, { foreignKey: "managerId"})
    UserManagement.belongsTo(models.User, { foreignKey: "userId"})
  }

  return UserManagement
}
