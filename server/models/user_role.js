import Sequelize from "sequelize"
import { newId } from "./utils"

export default (sequelize, DataTypes) => {
  class UserRole extends Sequelize.Model {}

  UserRole.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      userId: { type: Sequelize.STRING(20), allowNull: false },
      roleId: { type: Sequelize.STRING(20), allowNull: false }
    },
    { sequelize, tableName: "user_role", modelName: "UserRole" }
  )

  UserRole.associate = models => {
    UserRole.belongsTo(models.User, { foreignKey: "userId"})
    UserRole.belongsTo(models.Role, { foreignKey: "roleId" })
  }

  return UserRole
}
