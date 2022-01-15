import Sequelize from "sequelize"

export default (sequelize, DataTypes) => {
  class StationFtp extends Sequelize.Model {}

  StationFtp.init(
    {
      id: { type: Sequelize.STRING(20), allowNull: false, primaryKey: true },
      stationId: { type: Sequelize.STRING(20), allowNull: false },
      ftpFolder: { type: Sequelize.STRING, allowNull: true },
      host: { type: Sequelize.STRING, allowNull: true },
      username: { type: Sequelize.STRING, allowNull: true},
      password: { type: Sequelize.STRING, allowNull: true },
      port: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 21  },
      ftpFilename: { type: Sequelize.STRING, allowNull: true },
      // hostFtpSample: { type: Sequelize.STRING, allowNull: true },
      // usernameFtpSample: { type: Sequelize.STRING, allowNull: true},
      // passwordFtpSample: { type: Sequelize.STRING, allowNull: true },
      // portFtpSample: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 21  },
      hostFtpBotnmt: { type: Sequelize.STRING, allowNull: true },
      usernameFtpBotnmt: { type: Sequelize.STRING, allowNull: true},
      passwordFtpBotnmt: { type: Sequelize.STRING, allowNull: true },
      portFtpBotnmt: { type: Sequelize.INTEGER, allowNull: true, defaultValue: 21  },
      ftpFilenameBotnmt: { type: Sequelize.STRING, allowNull: true },
      deletedAt: { type: Sequelize.DATE }
    },
    { sequelize, tableName: "station_ftp", modelName: "StationFtp" }
  )

  StationFtp.associate = models => {
    StationFtp.belongsTo(models.Station, { foreignKey: "stationId" })
  }
  return StationFtp
}
