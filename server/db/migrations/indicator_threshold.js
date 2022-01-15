import Sequelize from "sequelize"

class IndicatorThreshold extends Sequelize.Model {}

IndicatorThreshold.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    indicator_id: { type: Sequelize.STRING(64), allowNull: false },
    station_group_id: { type: Sequelize.STRING(64), allowNull: false },
    upper_limit: { type: Sequelize.FLOAT, allowNull: false },
    lower_limit: { type: Sequelize.FLOAT, allowNull: false },
    hour_limit: { type: Sequelize.FLOAT, allowNull: false },
    safety_description: { type: Sequelize.TEXT },
    over_threshold_description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "indicator_threshold" }
)


export default IndicatorThreshold