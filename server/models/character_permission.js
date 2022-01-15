import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class CharacterPermission extends Sequelize.Model {}

  CharacterPermission.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      characterId: { type: Sequelize.STRING(20), allowNull: false },
      permissionId: { type: Sequelize.STRING(20), allowNull: false },
      permissionStatus: {type: Sequelize.TINYINT, allowNull: false, defaultValue: 0}
    },
    { sequelize, timestamps: false, tableName: "character_permission", modelName: "CharacterPermission" }
  )

  CharacterPermission.associate = models => {
    CharacterPermission.belongsTo(models.Character, { foreignKey: "characterId" })
    CharacterPermission.belongsTo(models.Permission, {foreignKey: "permissionId"})
  }
  return CharacterPermission
}
