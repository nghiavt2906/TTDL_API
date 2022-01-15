import { Router } from "express"
import _ from 'lodash'
import Logger from "lib/logger"
import app from "app"
import middlewares from "../middlewares"
import { isEmpty, isEmail } from "validator"
import * as func from "utils/functions"

const router = Router()
export default expressRouter => {
  expressRouter.use("/users", router)

  router.post("/register", middlewares.authenticate("create_user"), createUser)
  router.put("/change_password", changePassword)
  router.put("/:userId", middlewares.authenticate("update_user"), updateUser)
  router.delete("/:userId", middlewares.authenticate("delete_user"), deleteUser)
  router.get('/managed', async (req, res, next) => {
    try {
      let data = {}
      let accessToken = req.headers.accesstoken
      let userId = await app.Authentication.authenticateUser(accessToken)
      let role = await app.Role.getLowerPriorityRole(userId)
      let stationInfo = await app.UserStation.getStationByUserId(userId)
      stationInfo = func.eleminateNestedField(stationInfo, ["Station"])
      data.role = role
      data.stationInfo = stationInfo
      res.send(data)
      
    } catch (error) {
      next(error)
      console.log(error)
    }
  })
  router.get('/', async (req,res, next) => {
    try {
      // console.log('here')
      let data = {}
      let accessToken = req.headers.authorization
      let managerId = await app.Authentication.authenticateUser(accessToken)
      let userInfo = await app.UserManagement.getManagedUser(managerId)
      let newUserInfo = userInfo.map(user => {
        user.managedStation = []
        user.strManagedStation = ''
        let stations = []
        let strStations = ''
        user.User.UserStations.forEach((station,key) => {
          stations.push({value : station.stationId, label: station.Station.dataValues.stationName})
          if(key === 0){
            strStations += station.Station.dataValues.stationName
          }else {
            strStations = strStations + ', ' + station.Station.dataValues.stationName
          }        
        });
        user.dataValues.managedStation = stations
        user.dataValues.strManagedStation = strStations
        delete(user.User.UserStations)
        return user
      })
      res.send(newUserInfo)
    } catch (error) {
      next(error)
      console.log(error)
    }
  })
  router.put("/info/:userId", async (req, res, next) => {
    try {
      const userInfo = req.body
      const userId = req.params.userId
      app.User.updateUserInfo(userId, userInfo).then(result => {
        res.sendStatus(200)
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  })

  
}

async function createUser(req, res, next) {
  try {
    // console.log(req.body)
    const creatorId = req.userId
    const creatorRoleName = req.roleName
    const { user, roleId, stationId } = req.body

    const result = await app.User.createUser(user, roleId, stationId, creatorId, creatorRoleName)

    res.json({ data: result })
  } catch (error) {
    next(error)
    console.log(error)
  }
}

async function updateUser(req, res, next) {
  try {
    const creatorId = req.userId
    const creatorRoleName = req.roleName
    const userId = req.params.userId
    const { user, stationId, roleId } = req.body

    const result = await app.User.updateUser(userId, user, roleId, stationId, creatorId, creatorRoleName)
    res.json({ result })
  } catch (error) {
    next(error)
    console.log(error)
  }
}

async function deleteUser(req, res, next) {
  try {
    // console.log('It me', req.params.userId)
    const data = await app.User.deleteUserById(req.params.userId)
    res.json({ messages: 'Delete User Success!', data })
  } catch (error) {
    console.log(error)
    next(error)
  }
}

async function changePassword(req, res, next){
  try {
    const {
      userId,
      oldPassword,
      newPassword,
      confirmedNewPassword
    } = req.body
    let error = {}
    if(newPassword !== confirmedNewPassword ){
      error.confirmedNewPassword = 'Mật khẩu không trùng khớp!'
    }
    if(!_.isEmpty(error)){
      throw {status: HttpStatus.BAD_REQUEST, id: 'api.user.confirmed_password.invalid', messages: error}
    }

    await app.User.changePassword(userId, oldPassword, newPassword)
    res.sendStatus(200)
  } catch (error) {
    console.log(error)
    next(error)
  }
}
function validateUser(user, stationId, roleId) {
  let error = { user: {} }
  if (!isEmail(user.email)) error.user.email = 'Email không hợp lệ'
}
function test(req, res, next) { }
