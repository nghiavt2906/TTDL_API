import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"

class CitizenAccessToken {
  constructor() {}

  async checkAccessToken(citizenId, token) {
    if (token === undefined || citizenId === undefined) {
      throw { status: HttpStatus.BAD_REQUEST, id: "api.auth.validate", messages: {account: "Tài khoản không hợp lệ!"} }
    }
    const citizen = await models.CitizenAccessToken.findAll({ where: { citizenId, token } })
    if (!citizen.length){
      throw { status: HttpStatus.BAD_REQUEST, id: "api.token.invalid", messages: { account: "Tài khoản không hợp lệ!" } }
    }
    return true
  }
}

export default CitizenAccessToken
