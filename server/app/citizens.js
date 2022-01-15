import HttpStatus from "http-status-codes"
import { Op, Sequelize } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
class Citizen {
  constructor() {}

  async checkUniqueEmail(email, authType) {
    const citizen = await models.Citizen.findAll({ where: { email, authType } })
    if (citizen.length) return false
    return true
  }

  async checkUniqueNormalEmail(email) {
    const citizen = await models.Citizen.findAll({
      where: { 
        email,
        socialId : null
      } 
      })
    if (citizen.length) return false
    return true
  }

  async createCitizen(username, email, password, address, socialId, authType) {
    // check email is registered
    const isExistedEmail = await this.checkUniqueEmail(email, authType)
    if (!isExistedEmail) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.non_unique_email", messages: "Email đã được đăng ký!" }
    }
    // save citizen to database
    const newCitizen = await models.Citizen.create(
      {
        id: newId(),
        username : username,
        email: email,
        password: password,
        address : address,
        socialId: socialId,
        authType: authType,
        notiStatus: false,
        CitizenAccessToken: { token: generateToken(40) },
      },
      { include: [models.CitizenAccessToken] }

    )
    
    let publicStationId = await models.Station.findAll({attributes: ['id'], where : {publicStatus: 1}})
    let citizenStations = publicStationId.map((item, index) => ({ id: newId(), stationId: item.id, citizenId : newCitizen.id, notiStatus : true, orderStation: index }))
    // console.log(newCitizen.CitizenAccessToken)
    await models.CitizenStation.bulkCreate(citizenStations)
    return {
      id: newCitizen.id,
      username : newCitizen.username,
      email: newCitizen.email,
      address : newCitizen.address,
      socialId : newCitizen.socialId,
      token : newCitizen.CitizenAccessToken.token,
      notiStatus: newCitizen.notiStatus
    }
  }

  async createSocialCitizen(username, email, socialId, authType) {
    // check email is registered
    const isExistedEmail = await this.checkUniqueEmail(email)
    if (!isExistedEmail) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.non_unique_email", messages: { email: "Email đã được đăng ký!" } }
    }
    // save citizen to database
    const newCitizen = await models.Citizen.create(
      {
        id: newId(),
        username : username,
        email: email,
        password: null,
        address : null,
        socialId: 1,
        notiStatus: false,
        CitizenAccessToken: { token: generateToken(40) },
        CitizenSocialLogin : {
          id: newId(),
          socialId,
          authType
        }
      },
      { include: [models.CitizenAccessToken, models.CitizenSocialLogin] }

    )
    
    let publicStationId = await models.Station.findAll({attributes: ['id'], where : {publicStatus: 1}})
    let citizenStations = publicStationId.map((item, index) => ({ id: newId(), stationId: item.id, citizenId : newCitizen.id, notiStatus : true, orderStation: index }))
    // console.log(newCitizen.CitizenAccessToken)
    await models.CitizenStation.bulkCreate(citizenStations)
    return {
      id: newCitizen.id,
      username : newCitizen.username,
      email: newCitizen.email,
      address : newCitizen.address,
      socialId : newCitizen.socialId,
      token : newCitizen.CitizenAccessToken.token,
      notiStatus: newCitizen.notiStatus
    }
  }

  async findCitizenByEmailSocialId(email, socialId, authType) {
    return models.Citizen.findAll({
       where: { email, socialId, authType }, 
       include: [{model: models.CitizenAccessToken}]
      })
  }

  async findCitizenByEmailSocialId1(email, socialId, authType) {
    return models.Citizen.findAll({
       where: { email }, 
       include: [{
         model: models.CitizenSocialLogin,
         where: {socialId, authType},
         require: true
        }, {
          model: models.CitizenAccessToken
        }]
    })
  }

  async getCitizenById(id) {
    const citizen = await models.Citizen.findByPk(id)
    return citizen
  }

  async updateCitizen(userId, citizen, roleId, stationId, creatorId, creatorRoleName) {
    const role = await app.Role.getRoleById(roleId)
    if (!role) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.invalid_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check role of creator
    if ((creatorRoleName === "admin" && role.username === "god") || creatorRoleName === role.username) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.wrong_role", messages: { role: "Quyền không hợp lệ!" } }
    }

    // check station is managed by creator
    const isStationManagedByCreator = await app.Station.checkStationByCreator(creatorId, stationId)
    if (!isStationManagedByCreator) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.register.station_not_managed_by_creator", messages: { station: "Trạm được quản lý không hợp lê" } }
    }

    // update citizen data
    const oldCitizen = await models.Citizen.findByPk(userId)
    const afterUpdatedCitizen = await oldCitizen.update({
      ...citizen
    })

    // update role
    const userRole = await models.CitizenRole.findOne({ where: { userId }, include: [models.Role] })

    if (role.username !== userRole.Role.displayName && userRole.Role.username !== "god") {
      await userRole.update({ roleId: role.id })

      // delete all citizen who is managed by userId
      await models.CitizenManagement.destroy({ where: { managerId: userId } })
    }

    // delete citizen stations
    await models.CitizenStation.destroy({ where: { userId } })

    // create citizen stations
    await models.CitizenStation.bulkCreate(stationId.map(item => ({ id: newId(), stationId: item, userId })))

    return {
      id: userId,
      username: afterUpdatedCitizen.username,
      phoneNumber: afterUpdatedCitizen.phoneNumber,
      address: afterUpdatedCitizen.address,
      workplace: afterUpdatedCitizen.workplace,
      email: afterUpdatedCitizen.email,
      alertEmail: afterUpdatedCitizen.alertEmail,
      roleName: role.username,
      roleDisplayName: role.displayName
    }
  }

  async deleteCitizenById(id) {
    const citizen = await models.Citizen.findByPk(id)
    if (!citizen) {
      throw { status: HttpStatus.BAD_REQUEST, id: 'api.citizen.delete.not_found_user', messages: 'Không tìm thấy citizen' }
    }
    // await citizen.destroy({ cascade: true })
    await models.Citizen.destroy({where: {id : id}})
  }

  updateNotiStatus (citizenId) {
    return models.Citizen.update({
      notiStatus : models.Sequelize.literal('NOT notiStatus')
    }, {
      where: {id : citizenId}
    })
  }



  getStationByCitizenId(userId){
    return models.Citizen.findAll({
      where: {userId: userId},
      include : [{ model: models.Station, attributes: [["username", "stationName"]], required: true }]
    })
  }

  updateCitizenInfo (userId, info){
    return models.Citizen.update({
      username: info.username,
      phoneNumber: info.phoneNumber,
      address: info.address,
      workplace: info.workplace
    }, {
      where : { id: userId}
    })
  }

  async recoverPassword(email, newPassword, confirmedNewPassword) {
    try {
      if (newPassword !== confirmedNewPassword) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          id: "api.citizen.recover_password.mismatch_password",
          messages:  "Xác nhận mật khẩu và mật khẩu mới không khớp nhau!"
        }
      }
      await models.Citizen.update(
        { password: newPassword },
        { where: { email } }
      )
    } catch (error) {
      throw error
    }
  }

  async changePassword(citizenId, oldPassword, newPassword) {
    try {
      const citizen = await models.Citizen.findOne({ where: { id: citizenId } })
      const isMatch = models.Citizen.comparePassword(oldPassword, citizen.password)
      if (!isMatch) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          id: "api.citizen.change_password.wrong_password",
          messages: { password: "Mật khẩu không đúng!" }
        }
      }
      await models.Citizen.update(
        { password: newPassword },
        { where: { id: userId } }
      )
    } catch (error) {
      throw error
    }
  }
}

export default Citizen
