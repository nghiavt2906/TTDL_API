const Sequelize = require("sequelize")
const sequelize = new Sequelize("quantracmoitruong", "root", "qwerty123", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully.")
//   })
//   .catch(err => {
//     console.error("Unable to connect to the database:", err)
//   })

const Model = Sequelize.Model

class User extends Model {}

class Role extends Model {}

User.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false
    },
    lastName: {
      type: Sequelize.STRING
      // allowNull defaults to true
    }
  },
  {
    sequelize,
    modelName: "user"
  }
)

// User.sync({ force: true }).then(() => {
//   // Now the `users` table in the database corresponds to the model definition
//   return User.create({
//     firstName: 'John',
//     lastName: 'Hancock'
//   });
// });

// User.findAll().then(users => {
//   console.log("All users: ", JSON.stringify(users, null, 4))
// })

// Role.init({
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true
//   },
//   name: {
//     type: Sequelize.STRING,
//   },
//   display_name: {
//     type: Sequelize.STRING
//   },
//   description: {
//     type: Sequelize.TEXT
//   },
  
// }, {
//   timestamps: false,
//   sequelize,
//   tableName: 'auth_roles'
// })

Role.init({})

Role.findAll().then(roles => {
  console.log("All roles: ", JSON.stringify(roles, null, 4))
})

Role.count().then(c => console.log(c))