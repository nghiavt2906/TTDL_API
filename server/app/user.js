import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
class Users {
  constructor() {}

  async checkUniqueEmail(email) {
    const users = await models.User.findAll({ where: { email } })
    if (users.length) return false
    return true
  }

  async createUser(user, roleId, stationId, creatorId, creatorRoleName) {
    // console.log('check user', user, roleId, stationId, creatorId, creatorRoleName)
    // check email is registered
    const isExistedEmail = await this.checkUniqueEmail(user.email)
    if (!isExistedEmail) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.non_unique_email", messages: { email: "Email đã được đăng ký!" } }
    }

    // check role
    const role = await app.Role.getRoleById(roleId)
    if (!role) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.invalid_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check role of creator
    if (creatorRoleName === "admin" && role.name === "god" && creatorRoleName === role.name) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.wrong_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check station is managed by creator
    const isStationManagedByCreator = await app.Station.checkStationByCreator(creatorId, stationId)
    if (!isStationManagedByCreator) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.station_not_managed_by_creator", messages: { station: "Trạm được quản lý không hợp lê" } }
    }

    // transaction ???
    // save user to database
    const newUser = await models.User.create(
      {
        id: newId(),
        ...user,
        password: user.phoneNumber,
        isActive: true,
        UserAccessToken: { token: generateToken(40) },
        UserRole: { id: newId(), roleId }
      },
      { include: [models.UserAccessToken, models.UserRole, models.UserStation] }
    )
    // add user t
    const userStation = stationId.map(item => ({ id: newId(), userId: newUser.id, stationId: item }))
    await models.UserStation.bulkCreate(userStation)
    const godUser = await models.UserRole.findAll({ attributes: ["id"], include: [{ model: models.Role, where: { name: "god" } }, { model: models.User }] })

    // sub query ???
    let userManagement = [
      {
        id: newId(),
        managerId: creatorId,
        userId: newUser.id
      }
    ]

    godUser.forEach(item => {
      if (item.User.id !== creatorId) {
        userManagement.push({ id: newId(), managerId: item.User.id, userId: newUser.id })
      }
    })

    await models.UserManagement.bulkCreate(userManagement)

    return {
      id: newUser.id,
      name: newUser.name,
      phoneNumber: newUser.phoneNumber,
      address: newUser.address,
      workplace: newUser.workplace,
      email: newUser.email,
      alertEmail: newUser.alertEmail,
      roleName: role.name,
      roleDisplayName: role.displayName
    }
  }

  async getUserById(id) {
    const user = await models.User.findByPk(id)
    return user
  }

  async updateUser(userId, user, roleId, stationId, creatorId, creatorRoleName) {
    const role = await app.Role.getRoleById(roleId)
    if (!role) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.invalid_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check role of creator
    if ((creatorRoleName === "admin" && role.name === "god") || creatorRoleName === role.name) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.wrong_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check station is managed by creator
    const isStationManagedByCreator = await app.Station.checkStationByCreator(creatorId, stationId)
    if (!isStationManagedByCreator) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.station_not_managed_by_creator", messages: { station: "Trạm được quản lý không hợp lê" } }
    }

    // update user data
    const oldUser = await models.User.findByPk(userId)
    const afterUpdatedUser = await oldUser.update({
      ...user
    })

    // update role
    const userRole = await models.UserRole.findOne({ where: { userId }, include: [models.Role] })

    if (role.name !== userRole.Role.displayName && userRole.Role.name !== "god") {
      await userRole.update({ roleId: role.id })

      // delete all user who is managed by userId
      await models.UserManagement.destroy({ where: { managerId: userId } })
    }

    // delete user stations
    await models.UserStation.destroy({ where: { userId } })

    // create user stations
    await models.UserStation.bulkCreate(stationId.map(item => ({ id: newId(), stationId: item, userId })))

    return {
      id: userId,
      name: afterUpdatedUser.name,
      phoneNumber: afterUpdatedUser.phoneNumber,
      address: afterUpdatedUser.address,
      workplace: afterUpdatedUser.workplace,
      email: afterUpdatedUser.email,
      alertEmail: afterUpdatedUser.alertEmail,
      roleName: role.name,
      roleDisplayName: role.displayName
    }
  }

  async deleteUserById(id) {
    const users = await models.User.findByPk(id)
    if (!users) {
      throw { status: HttpStatus.BAD_REQUEST, id: 'api.user.delete.not_found_user', messages: 'Không tìm thấy user' }
    }
    // await users.destroy({ cascade: true })
    await models.User.destroy({where: {id : id}})
  }

  async findUserByEmail(email) {
    return models.User.findAll({ where: { email }, include: [{ model: models.UserRole, include: [{model: models.Role}] }, {model: models.UserAccessToken}] })
  }

  getStationByUserId(userId){
    return models.User.findAll({
      where: {userId: userId},
      include : [{ model: models.Station, attributes: [["name", "stationName"]], required: true }]
    })
  }

  updateUserInfo (userId, info){
    return models.User.update({
      name: info.name,
      phoneNumber: info.phoneNumber,
      address: info.address,
      workplace: info.workplace
    }, {
      where : { id: userId}
    })
  }

  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await models.User.findOne({ where: { id: userId } })
      const isMatch = models.User.comparePassword(oldPassword, user.password)
      if (!isMatch) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          id: "api.user.change_password.wrong_password",
          message: { password: "Mật khẩu không đúng!" }
        }
      }
      await models.User.update(
        { password: newPassword },
        { where: { id: userId } }
      )
    } catch (error) {
      throw error
    }
  }
}

export default Users
