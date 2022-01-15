import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class RolePermission extends Sequelize.Model {}

  RolePermission.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      roleId: { type: Sequelize.STRING(20), allowNull: false },
      permissionId: { type: Sequelize.TEXT, allowNull: false }
    },
    { sequelize, timestamps: false, tableName: "role_permission", modelName: "RolePermission" }
  )
  return RolePermission
}
