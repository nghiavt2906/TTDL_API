import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class FirebaseToken extends Sequelize.Model {}

  FirebaseToken.init(
    {
      id: {type:Sequelize.STRING(20), allowNull: false, primaryKey: true},
      citizenId: { type: Sequelize.STRING(20), allowNull: false },
      token: { type: Sequelize.TEXT, allowNull: false },
    },
    {
      sequelize,
      tableName: "firebase_tokens",
      modelName: "FirebaseToken",
    }
  )

  // FirebaseToken.associations = models => {
  //   // FirebaseToken.hasMany(models.Citizens, )
  // }

  return FirebaseToken
}
