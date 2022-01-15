import Sequelize from "sequelize"

// ?
export default (sequelize, DataTypes) => {
  class UserPermission extends Sequelize.Model {}

  UserPermission.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      userId: { type: Sequelize.STRING(20), allowNull: false },
      permissionId: { type: Sequelize.TEXT, allowNull: false }
    },
    { sequelize, timestamps: false, tableName: "user_permission", modelName: "UserPermission" }
  )

  return UserPermission
  
}
