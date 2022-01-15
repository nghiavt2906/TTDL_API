import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class ApiSharedIndicator extends Sequelize.Model { }

	ApiSharedIndicator.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			apiKeyId: { type: Sequelize.STRING(20), allowNull: false },
			indicatorId: { type: Sequelize.STRING(20), allowNull: false }
		},
		{ sequelize, tableName: "api_shared_indicators", modelName: "ApiSharedIndicator" }
	)

	ApiSharedIndicator.associate = models => {
		ApiSharedIndicator.belongsTo(models.ApiKey, { foreignKey: 'apiKeyId' })
		ApiSharedIndicator.belongsTo(models.Indicator, { foreignKey: 'indicatorId' })
	}

	return ApiSharedIndicator
}
