import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class Firmware extends Sequelize.Model {}

  Firmware.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      version: { type: Sequelize.STRING(50), allowNull: false },
      firmwareData: { type: Sequelize.DATE, allowNull: false },
      status: { type: Sequelize.TINYINT },
      url: { type: Sequelize.STRING, allowNull: false },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "firmwares", modelName: "Firware" }
  )

  return Firmware
}
