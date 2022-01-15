import Sequelize from "sequelize"

class Permission extends Sequelize.Model {}

Permission.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    name: { type: Sequelize.STRING, allowNull: false },
    display_name: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT }
  },
  { tableName: "auth_permission" }
)

export default Permission