import Sequelize from "sequelize"

class UserPermission extends Sequelize.Model {}

UserPermission.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    user_id: { type: Sequelize.STRING(64), allowNull: false },
    permission_id: { type: Sequelize.TEXT, allowNull: false }
  },
  { tableName: "auth_user_permission" }
)

export default UserPermission