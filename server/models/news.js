import Sequelize, { Op } from "sequelize"

export default (sequelize, DataTypes) => {
  class News extends Sequelize.Model {}
  News.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },     
      creatorId: { type: Sequelize.STRING(20), allowNull: false },
      title: { type: Sequelize.TEXT, allowNull: false },
      image: { type: Sequelize.STRING(255), allowNull: false },
      imageDesc: { type: Sequelize.TEXT, allowNull: true },
      description: { type: Sequelize.TEXT, allowNull: false },
      body: { type: Sequelize.TEXT, allowNull: false },
      publishDate: { type: Sequelize.DATE, allowNull: false },
      status : { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      numberReads : { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      link: { type: Sequelize.STRING(255), allowNull: true },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "news", modelName: "News" }
  )

  News.associate = models => {
    News.belongsTo(models.Manager, { foreignKey: "creatorId"})
  }

  return News
}
