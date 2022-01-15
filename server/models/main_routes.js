import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class MainRoute extends Sequelize.Model {}

  MainRoute.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING(500), allowNull: false },
      displayName: { type: Sequelize.STRING(1024), allowNull: false },
      isRequired: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1  },
      isVisible: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1  },
      mainRouteOrder: { type: Sequelize.INTEGER, allowNull: false},
    },
    { sequelize, timestamps: false, tableName: "main_routes", modelName: "MainRoute" }
  )

  MainRoute.associate = models => {
    MainRoute.hasMany(models.Route, {foreignKey: "mainRouteId", onDelete: 'CASCADE', hooks: true})
  }

  return MainRoute
}
