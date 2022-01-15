import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Route extends Sequelize.Model {}

  Route.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      mainRouteId: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING(500), allowNull: false },
      displayName: { type: Sequelize.STRING(1024), allowNull: false },
      description: { type: Sequelize.STRING(1024), allowNull: false },
      isMainRoute: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
      isVisible: { type: Sequelize.TINYINT, allowNull: false, defaultValue: 1 },
      routeOrder: { type: Sequelize.INTEGER, allowNull: false },
    },
    { sequelize, timestamps: false, tableName: "routes", modelName: "Route" }
  )

  Route.associate = (models) => {
    Route.belongsTo(models.MainRoute, { foreignKey: "mainRouteId" })
    Route.hasMany(models.Permission, {
      foreignKey: "routeId",
      onDelete: "CASCADE",
      hooks: true,
    })
  }

  return Route
}
