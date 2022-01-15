import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Role extends Sequelize.Model {}

  Role.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      displayName: { type: Sequelize.STRING },
      permissions: { type: Sequelize.TEXT },
      priority : {type: Sequelize.SMALLINT},
      description: { type: Sequelize.TEXT }
    },
    { sequelize, timestamps: false, tableName: "roles", modelName: "Role" }
  )

  Role.associate = models => {
    // Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: "roleId" })
    Role.hasMany(models.UserRole, {foreignKey: "roleId"})
  }

  return Role
}
