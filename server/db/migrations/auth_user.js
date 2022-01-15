import Sequelize from "sequelize"

class User extends Sequelize.Model {}

User.init(
  {
    id: { type: Sequelize.STRING(64), allowNull: false, primaryKey: true },
    username: { type: Sequelize.STRING, allowNull: false },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: { isEmail: true }
    },
    password: { type: Sequelize.STRING, allowNull: false },
    email_verified_at: { type: Sequelize.DATE },
    alert_email: { type: Sequelize.STRING, validate: { isEmail: true } },
    phone: { type: Sequelize.STRING(15), allowNull: false },
    workplace: { type: Sequelize.STRING, allowNull: false },
    position: { type: Sequelize.STRING, allowNull: false },
    created_at: { type: Sequelize.DATE, allowNull: false },
    updated_at: { type: Sequelize.DATE, allowNull: false },
    deleted_at: { type: Sequelize.STRING }
  },
  { timestamps: false, tableName: "auth_users" }
)

export default User