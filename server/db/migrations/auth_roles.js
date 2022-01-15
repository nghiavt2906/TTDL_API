import Sequelize from "sequelize"

class Role extends Sequelize.Model {}

Role.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    display_name: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT }
  },
  { tableName: "auth_roles" }
)

export default Role
