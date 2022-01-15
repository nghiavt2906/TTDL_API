import Sequelize from "sequelize"

class Firmware extends Sequelize.Model {}

Firmware.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    version: { type: Sequelize.STRING(50), allowNull: false },
    firmware_data: { type: Sequelize.DATE, allowNull: false },
    status: { type: Sequelize.TINYINT },
    url: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "firmwares" }
)

export default Firmware