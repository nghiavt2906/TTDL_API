import { Router } from "express"
import { isEmail, isEmpty } from "validator"
import _ from "lodash"
import app from 'app'
const router = Router()
import bodyParser from 'body-parser'
import HttpStatus from "http-status-codes"

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/citizen", router)

  router.post("/signup", async (req, res, next) => {
    try {
      const {username, email, password, address} = req.body
      const result = await app.Citizen.createCitizen(username, email, password, address, null, 'normal')
      res.json({ data: result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // login
  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      const error = validateUser(email, password)      
      if (!_.isEmpty(error)) {
        throw { status: HttpStatus.BAD_REQUEST, id: "api.auth.validate", messages: error }
      }
      const result = await app.PublicAuthentication.doLogin(email, password, 'normal')
      res.json(result )
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // login
  router.post("/social_login", async (req, res, next) => {
    try {
      const { username, email, socialId, avatar, authType } = req.body
      const error = validateSocialUser(email, socialId)      
      if (!_.isEmpty(error)) {
        throw { status: HttpStatus.BAD_REQUEST, id: "api.auth.validate", messages: error }
      }
      if (!['facebook', 'apple', 'google'].includes(authType)) {
        throw { status: HttpStatus.BAD_REQUEST, id: "api.auth.validate", messages: "Thông tin đăng nhập không hợp lệ!" }
      }
      const result = await app.PublicAuthentication.doSocialLogin(username, email, socialId, avatar, authType)
      res.json(result )
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:citizenId/changeNotificationStatus", async (req, res, next) => {
    try {
      const {citizenId} = req.params
      // console.log(citizenId)
      await app.Citizen.updateNotiStatus(citizenId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/forgotPassword/:email", async (req, res, next) => {
    try {
      const {email} = req.params
      const info = await app.CitizenPasswordRecovery.createPasswordRecovery(email)
      await app.Email.handleResetPassword(info.code, info.email)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/recoveryPassword", async (req, res, next) => {
    try {
      const {email, code, newPassword, comfirmedNewPassword} = req.body
      // console.log(email, code, newPassword, comfirmedNewPassword)
      await app.CitizenPasswordRecovery.checkCode(email, code)
      await app.Citizen.recoverPassword(email, newPassword, comfirmedNewPassword)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

}

function validateUser(email, password) {
  let error = {}
  if (!isEmail(email)) error.email = "Email không hợp lệ !"
  if (isEmpty(password)) error.password = "Vui lòng nhập mật khẩu !"
  return error
}

function validateSocialUser(email, socialId) {
  let error = {}
  if (!isEmail(email)) error.email = "Email không hợp lệ !"
  if (isEmpty(socialId) && socialId === undefined) error.socialId = "Tài khoản không hợp lệ!"
  return error
}
