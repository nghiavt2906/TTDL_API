import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class CitizenPasswordRecovery extends Sequelize.Model {}

  CitizenPasswordRecovery.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      email: { type: Sequelize.STRING, allowNull: false },
      code: { type: Sequelize.STRING(6), allowNull: false }
    },
    { sequelize, tableName: "citizen_password_recovery", modelName: "CitizenPasswordRecovery" }
  )

  return CitizenPasswordRecovery
}
