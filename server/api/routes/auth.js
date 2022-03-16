import { Router } from "express"
import { isEmail, isEmpty } from "validator"
import _ from "lodash"
import app from 'app'
import { getManagerRoutes } from 'app/utils'
const router = Router()

import bodyParser from 'body-parser'
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/auth", router)

  // login
  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body
      // console.log({email, password})
      const error = validateUser(email, password)

      if (!_.isEmpty(error)) {
        throw { status: HttpStatus.BAD_REQUEST, id: "api.auth.validate", messages: error }
      }

      let result = await app.Authentication.doLogin(email, password)
      if (result.id !== undefined) {
        const route = await getManagerRoutes(result.id)
        result.route = route
      }
      res.json(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // fetch Info
  router.get("/userInfo", async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization
      let result = await app.Authentication.fetchUserInfoByAccessToken(accessToken)
      if (result.id !== undefined) {
        const route = await getManagerRoutes(result.id)
        result.route = route
      }
      res.json(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/quenmatkhau", async (req, res) => {
    if (!req.body.email)
      res.status(400).send('email is required')

    const result = await app.Authentication.sendResetPasswordLinkToEmail(req.body.email)
    if (result === 'ok')
      res.sendStatus(200)
    else
      res.status(400).send('bad request')
  })

  router.post("/resetmatkhau", async (req, res) => {
    if (!req.body.token || !req.body.newPassword)
      res.status(400).send('field(s) is missing')

    const result = await app.Authentication.resetPassword(req.body.token, req.body.newPassword)
    if (result == 'ok')
      res.sendStatus(200)
    else
      res.status(400).send('bad request')
  })
}

function validateUser(email, password) {
  let error = {}
  if (!isEmail(email)) error.email = "Email không hợp lệ !"
  if (isEmpty(password)) error.password = "Vui lòng nhập mật khẩu !"
  return error
}
