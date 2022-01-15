import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class District extends Sequelize.Model {}

  District.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      name: { type: Sequelize.STRING, allowNull: false },
      symbol: { type: Sequelize.STRING }
    },
    { sequelize, timestamps: false, tableName: "districts", modelName: "District" }
  )

  District.associate = models => {
    // Role.belongsToMany(models.User, { through: models.UserRole, foreignKey: "roleId" })
    District.hasMany(models.Station, {foreignKey: "districtId"})
  }

  return District
}
