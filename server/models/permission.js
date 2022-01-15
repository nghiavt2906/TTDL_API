import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Permission extends Sequelize.Model { }

  Permission.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      // routeId: { type: Sequelize.STRING(20), allowNull: false},
      name: { type: Sequelize.STRING, allowNull: false },
      displayName: { type: Sequelize.STRING, allowNull: false },
      // isRequired: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 1},
      isVisible: { type: Sequelize.TINYINT, allowNull: true, defaultValue: 1 },
      // permissionOrder : {type: Sequelize.INTEGER, allowNull: true}
    },
    { sequelize, timestamps: false, tableName: "permissions", modelName: "Permission" }
  )

  // Permission.associate = models => {
  //   Permission.belongsTo(models.Route, { foreignKey: "routeId" })
  // }

  return Permission

}
