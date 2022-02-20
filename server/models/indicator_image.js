import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
	class IndicatorImage extends Sequelize.Model { }

	IndicatorImage.init(
		{
			id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
			path: { type: Sequelize.STRING(1024), allowNull: false },
			indicatorThresholdId: { type: Sequelize.STRING(20), allowNull: false }
		},
		{ sequelize, tableName: "indicator_image", modelName: "IndicatorImage" }
	)

	IndicatorImage.associate = (models) => {
		IndicatorImage.belongsTo(models.IndicatorThreshold, { foreignKey: 'indicatorThresholdId' })
	}

	return IndicatorImage
}