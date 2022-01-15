import Sequelize from "sequelize"

const Op = Sequelize.Op;


export default (sequelize, DataTypes) => {
  class System extends Sequelize.Model {}

  System.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      idSystem: { type: Sequelize.STRING(20), allowNull: false },
      name: { type: Sequelize.STRING, allowNull: false, primaryKey: true },
      value: { type: Sequelize.TEXT }
    },
    { sequelize, timestamps: false, tableName: "systems", modelName: "System" }
  )
  
  return System
}

