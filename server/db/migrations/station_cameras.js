import Sequelize from "sequelize"

class Camera extends Sequelize.Model {}

Camera.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    station_id: { type: Sequelize.STRING(64), allowNull: false },
    host: { type: Sequelize.STRING, allowNull: false },
    port: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 80 },
    username: { type: Sequelize.STRING, allowNull: false },
    password: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "station_cameras" }
)

export default Camera