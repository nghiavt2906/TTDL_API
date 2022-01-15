import Sequelize, { IndexHints } from "sequelize"

class Indicator extends Sequelize.Model {}

Indicator.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    // note !!!
    monitoring_type_id: { type: Sequelize.STRING, allowNull: false },
    symbol: { type: Sequelize.STRING, allowNull: false },
    unit: { type: Sequelize.STRING, allowNull: false },
    description: { type: Sequelize.TEXT },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.DATE }
  },
  { timestamps: false, tableName: "indicators" }
)

export default Indicator