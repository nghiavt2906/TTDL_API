import models from "models"
import { newId, generateToken } from "models/utils"
import { app } from "firebase-admin"
import HttpStatus from "http-status-codes"
import App from 'app'

class CitizenPasswordRecovery {
  constructor() {}

  async createPasswordRecovery (email) {
    const isExistedEmail = await App.Citizen.checkUniqueNormalEmail(email)
    if (isExistedEmail) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.forgot_password.not_existed_email", messages: "Email không tồn tại!" }
    }
    await models.CitizenPasswordRecovery.destroy({where : {email}})
    return models.CitizenPasswordRecovery.create({
      id: newId(),
      email: email,
      code: generateToken(6)
    })
  }

  async checkCode (email, code) {
    const isCorrectCode = await models.CitizenPasswordRecovery.findOne({
      attributes: ['createdAt'],
      where: {email, code}
    })
    if(isCorrectCode === null) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.forgot_password.wrong_code", messages: "Mã code không đúng!" }
    }
    const diffTime = Math.abs(new Date() - new Date(isCorrectCode.createdAt))/60000
    if(diffTime > 60){
      await models.CitizenPasswordRecovery.destroy({where : {email}})
      throw { status: HttpStatus.BAD_REQUEST, id: "api.forgot_password.expired_time", messages: "Yêu cầu tạo lại mật khẩu đã hết hạn. Vui lòng yêu cầu lại!" }
    }
    return true
  }

}

export default CitizenPasswordRecovery
