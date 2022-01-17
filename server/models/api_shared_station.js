import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class ApiSharedStation extends Sequelize.Model { }

	ApiSharedStation.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			apiKeyId: { type: Sequelize.STRING(20), allowNull: false },
			stationId: { type: Sequelize.STRING(20), allowNull: false }
		},
		{ sequelize, tableName: "api_shared_station", modelName: "ApiSharedStation" }
	)

	ApiSharedStation.associate = models => {
		ApiSharedStation.belongsTo(models.ApiKey, { foreignKey: 'apiKeyId' })
		ApiSharedStation.belongsTo(models.Station, { foreignKey: 'stationId' })
	}

	return ApiSharedStation
}

