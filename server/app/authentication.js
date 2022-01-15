import HttpStatus from "http-status-codes"
import app from "app"
import models from "models"

export default class Authentication {
  constructor() { }

  async doLogin(email, password) {
    const manager = await app.Manager.findManagerByEmail(email)

    if (!manager.length) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_manager.unregistered", messages: "Tài khoản không tồn tại!" }
    } else if (manager.length > 1) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_manager.multi_email", messages: "Lỗi hệ thống." }
    }

    // const isMatch = models.Manager.comparePassword(password, manager[0].password)

    // if (!isMatch) {
    //   throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_password.invalid", messages: "Tài khoản không tồn tại!" }
    // }
    manager[0].password = ''
    return manager[0]
  }

  async authenticateUser(accessToken) {
    const manager = await models.ManagerAccessToken.findByPk(accessToken)
    if (!manager) {
      throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_token", messages: "Unauthorized" }
    }

    return manager.managerId
  }

  async fetchUserInfoByAccessToken(accessToken) {
    const managerInfo = await models.ManagerAccessToken.findAll({
      raw: true,
      where: { token: accessToken },
      attributes: ['token',
        [models.Sequelize.col('Manager.id'), 'id'],
        [models.Sequelize.col('Manager.name'), 'name'],
        [models.Sequelize.col('Manager.email'), 'email'],
        [models.Sequelize.col('Manager.phoneNumber'), 'phoneNumber'],
        [models.Sequelize.col('Manager.workplace'), 'workplace'],
        [models.Sequelize.col('Manager.address'), 'address'],
      ],
      include: [{ model: models.Manager, attributes: [], required: true }]
    })
    if (!managerInfo) {
      throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_token", messages: "Unauthorized" }
    }

    return managerInfo[0]
  }
}


// export default class Authentication {
//   constructor() {}

//   async doLogin(email, password) {
//     const user = await app.User.findUserByEmail(email)

//     if (!user.length) {
//       throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_user.unregistered", messages: { email: "Email không tồn tại." } }
//     } else if (user.length > 1) {
//       throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_user.multi_email", messages: { email: "Lỗi hệ thống." } }
//     }

//     const isMatch = models.User.comparePassword(password, user[0].password)

//     if (!isMatch) {
//       throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_password.invalid", messages: { password: "Mật khẩu không đúng." } }
//     }

//     return { name: user[0].name, email: user[0].email, phoneNumber: user[0].phoneNumber, address: user[0].address, workplace: user[0].workplace, token: user[0].UserAccessToken.token }
//   }

//   async authenticateUser(accessToken) {
//     const user = await models.UserAccessToken.findByPk(accessToken)
//     if (!user) {
//       throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_token", messages: "Unauthorized" }
//     }

//     return user.userId
//   }

//   async fetchUserInfoByAccessToken (accessToken){
//     const userInfo = await models.UserAccessToken.findAll({
//       where: {token: accessToken},
//       attributes: ['token'],
//       include : [{ model: models.User, attributes: ['name', 'id', 'email', 'phoneNumber', 'workplace', 'address' ], required: true }]
//     })
//     if (!userInfo) {
//       throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_token", messages: "Unauthorized" }
//     }

//     return userInfo[0]
//   }
// }