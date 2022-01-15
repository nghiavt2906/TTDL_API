import Sequelize from "sequelize"

class SampleHistory extends Sequelize.Model {}

SampleHistory.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    station_id: { type: Sequelize.STRING(64), allowNull: false },
    sample_at: { type: Sequelize.DATE, allowNull: false },
    user_id: { type: Sequelize.STRING(64), allowNull: false }
  },
  { timestamps: false, tableName: "sample_history" }
)

export default SampleHistory