import Sequelize from "sequelize"

class RolePermission extends Sequelize.Model {}

RolePermission.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    role_id: { type: Sequelize.STRING(64), allowNull: false },
    permission_id: { type: Sequelize.TEXT, allowNull: false }
  },
  { tableName: "auth_role_permission" }
)

export default RolePermission