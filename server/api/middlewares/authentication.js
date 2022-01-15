import HttpStatus from "http-status-codes"
import app from "app"

export function authenticate(permission) {
  const middleware = (req, res, next) => {
    try {
      // console.log('call authenticate')
      const accessToken = req.headers.authorization
      if (!accessToken) {
        throw { status: HttpStatus.UNAUTHORIZED, id: "api.authentication.invalid_token", messages: "Unauthorized" }
      }

      app.Authentication.authenticateUser(accessToken)
        .then(async userId => {
          const roleName = await app.Authorization.hasPermission(userId, permission)
          req.userId = userId
          req.roleName = roleName
          next()
        })
        .catch(err => {
          console.log(err)
          next(err)
        })
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  return middleware
}
