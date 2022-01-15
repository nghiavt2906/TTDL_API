import Sequelize from "sequelize"

class StationGroup extends Sequelize.Model {}

StationGroup.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    symbol: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  {
    timestamps: false,
    tableName: "station_groups"
  }
)

export default StationGroup