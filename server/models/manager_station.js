import Sequelize, { Op } from "sequelize"

export default (sequelize, DataTypes) => {
  class ManagerStation extends Sequelize.Model {
    static getByName = async (name) => {
      return this.findAll({ where: { name } })
    }
  }
  ManagerStation.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      orderStation: { type: Sequelize.INTEGER, allowNull: false },
    },
    { sequelize, tableName: "manager_station", modelName: "ManagerStation" }
  )

  ManagerStation.associate = (models) => {
    ManagerStation.belongsTo(models.Manager, {
      foreignKey: "managerId",
      targetKey: "id",
    })
    ManagerStation.belongsTo(models.Station, {
      foreignKey: "stationId",
      targetKey: "id",
    })
  }

  return ManagerStation
}
