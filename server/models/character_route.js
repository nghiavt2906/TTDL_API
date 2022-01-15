import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class CharacterRoute extends Sequelize.Model {}

  CharacterRoute.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      characterId: { type: Sequelize.STRING(20), allowNull: false },
      routeId: { type: Sequelize.STRING(20), allowNull: false },
      routeStatus: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: "character_route",
      modelName: "CharacterRoute",
    }
  )

  CharacterRoute.associate = (models) => {
    CharacterRoute.belongsTo(models.Character, { foreignKey: "characterId" })
    CharacterRoute.belongsTo(models.Route, { foreignKey: "routeId" })
  }
  return CharacterRoute
}
