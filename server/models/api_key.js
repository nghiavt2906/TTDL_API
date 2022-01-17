import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class ApiKey extends Sequelize.Model { }

	ApiKey.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.TEXT },
			secret: { type: Sequelize.STRING(40), allowNull: false, unique: true },
			typeId: { type: Sequelize.STRING(20), allowNull: false },
			stationId: { type: Sequelize.STRING(20), allowNull: false }
		},
		{ sequelize, tableName: "api_keys", modelName: "ApiKey" }
	)

	ApiKey.associate = models => {
		ApiKey.belongsTo(models.Station, { foreignKey: 'stationId' })
		ApiKey.belongsTo(models.ApiKeyType, { foreignKey: 'typeId' })
	}

	return ApiKey
}
