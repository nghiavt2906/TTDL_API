import HttpStatus from "http-status-codes"
import app from "app"
import models from "models"

export default class PublicAuthentication {
  constructor() {}

  async doLogin(email, password, authType) {
    const citizen = await app.Citizen.findCitizenByEmailSocialId(email, null, authType)

    if (!citizen.length) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_user.unregistered", messages: { email: "Tài khoản không tồn tại." } }
    } else if (citizen.length > 1) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_user.multi_email", messages: { email: "Lỗi hệ thống." } }
    }

    const isMatch = models.Citizen.comparePassword(password, citizen[0].password)

    if (!isMatch) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.authentication.check_password.invalid", messages: { password: "Mật khẩu không đúng." } }
    }
    return {
      id : citizen[0].id,
      username : citizen[0].username,
      email: citizen[0].email,
      address: citizen[0].address,
      socialId: citizen[0].socialId,
      token: citizen[0].CitizenAccessToken.token,
      notiStatus: citizen[0].notiStatus
    }

  }

  async doSocialLogin(username, email, socialId, avatar, authType) {
    const citizen = await app.Citizen.findCitizenByEmailSocialId(email, socialId, authType)

    if (!citizen.length) {
      const result = await app.Citizen.createCitizen(username, email, null, null, socialId, authType)
      return result
    }

    return {
      id : citizen[0].id,
      username : citizen[0].username,
      email: citizen[0].email,
      address: citizen[0].address,
      socialId : citizen[0].socialId,
      avatar: avatar,
      token: citizen[0].CitizenAccessToken.token,
      notiStatus: citizen[0].notiStatus
    }

  }

}
