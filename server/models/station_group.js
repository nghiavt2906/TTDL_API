import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class StationGroup extends Sequelize.Model {}
  StationGroup.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      symbol: { type: Sequelize.STRING, allowNull: false },
      description: { type: Sequelize.TEXT },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "station_groups", modelName: "StationGroup" }
  )
  return StationGroup
}
