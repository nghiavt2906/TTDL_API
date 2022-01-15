import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class SampleHistory extends Sequelize.Model {}

  SampleHistory.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      managerId: { type: Sequelize.STRING(20), allowNull: false },
      sampleId: { type: Sequelize.STRING(20), allowNull: false },
      sampleAt: { type: Sequelize.DATE, allowNull: false },
      finishAt: { type: Sequelize.DATE, allowNull: true },
      bottle: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 0  },
    },
    { sequelize, timestamps: false, tableName: "sample_history", modelName: "SampleHistory" }
  )

  SampleHistory.associate = models => {
    SampleHistory.belongsTo(models.Station, { foreignKey: "stationId" })
    SampleHistory.belongsTo(models.Manager, { foreignKey: "managerId" })
  }

  return SampleHistory
}
