import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Character extends Sequelize.Model {}

  Character.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      isDefault: {type: Sequelize.TINYINT, allowNull: true, defaultValue: 0}
    },
    { sequelize, timestamps: false, tableName: "characters", modelName: "Character" }
  )

  Character.associate = models => {
    // Character.belongsToMany(models.User, { through: models.UserCharacter, foreignKey: "characterId" })
    Character.hasMany(models.CharacterPermission, {foreignKey: "characterId", onDelete: 'CASCADE', hooks: true})
  }

  return Character
}
