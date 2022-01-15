import Sequelize from "sequelize"

class UserRole extends Sequelize.Model {}

UserRole.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    user_id: { type: Sequelize.STRING(64), allowNull: false },
    role_id: { type: Sequelize.STRING(64), allowNull: false }
  },
  { timestamps: false, tableName: "auth_user_role" }
)

export default UserRole