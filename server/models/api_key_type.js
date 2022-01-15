import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class ApiKeyType extends Sequelize.Model { }

	ApiKeyType.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.TEXT }
		},
		{ sequelize, tableName: "api_key_types", modelName: "ApiKeyType" }
	)

	ApiKeyType.associate = models => {
		ApiKeyType.hasMany(models.ApiKey, { foreignKey: "typeId", onDelete: 'CASCADE', hooks: true })
	}

	return ApiKeyType
}
