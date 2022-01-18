import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class ApiKey extends Sequelize.Model { }

	ApiKey.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			name: { type: Sequelize.STRING, allowNull: false, unique: true },
			description: { type: Sequelize.TEXT },
			secret: { type: Sequelize.STRING(40), allowNull: false, unique: true },
			isReceptionApi: { type: Sequelize.BOOLEAN, allowNull: false },
			receivedStationId: { type: Sequelize.STRING(20), allowNull: true }
		},
		{ sequelize, tableName: "api_keys", modelName: "ApiKey" }
	)

	ApiKey.associate = models => {
		ApiKey.hasMany(models.ApiSharedStation, { foreignKey: 'apiKeyId', onDelete: 'NO ACTION', hooks: true })
		ApiKey.belongsTo(models.Station, { foreignKey: 'receivedStationId' })
	}

	return ApiKey
}
