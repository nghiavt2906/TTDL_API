import { Router } from "express"
import HttpStatus from "http-status-codes"
import models from "models"
import * as func from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import app from "app"
import { reformatManagerInfo } from "app/utils"
import _, { isEmpty } from "lodash"
import moment from "moment"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/nguoidung", router)

  router.post("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "insert_user")

      const { manager, stations } = req.body
      // console.log({manager, stations})
      let result = await app.Manager.createManager(manager, stations)
      result = reformatManagerInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/updateInfo/:managerId/:accountId", async (req, res, next) => {
    try {
      const { manager, stations } = req.body
      const { managerId, accountId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_user_info")

      let result = await app.Manager.updateManager(accountId, manager, stations)
      result = reformatManagerInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/", async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization
      if (accessToken === undefined) return res.sendStatus(400)
      await app.Authentication.fetchUserInfoByAccessToken(accessToken)

      const { managerId } = req.query
      if (managerId === undefined) return res.sendStatus(400)
      await app.Manager.checkManagerPermission(managerId, "view_user_info")

      let result = await app.Manager.getManagers()

      result = reformatManagerInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:managerId/:accountId", async (req, res, next) => {
    try {
      const { managerId, accountId } = req.params
      await app.Manager.checkManagerPermission(managerId, "delete_user")

      await app.Manager.deleteManagerById(accountId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get(
    "/checkPermission/:managerId/:permission",
    async (req, res, next) => {
      try {
        const { managerId, permission } = req.params
        await app.Manager.checkManagerPermission(managerId, permission)
        res.sendStatus(200)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get("/getSelect/:managerId", async (req, res, next) => {
    try {
      let accessToken = req.headers.authorization
      if (accessToken === undefined) return res.sendStatus(400)
      await app.Authentication.fetchUserInfoByAccessToken(accessToken)

      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "view_user_group")

      const characters = await app.Character.getSelectCharacters()
      const stations = await app.ManagerStation.getListStationByManagerId(
        managerId,
        {}
      )
      res.send({
        characters,
        stations,
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  })

  router.put("/info/:managerId", async (req, res, next) => {
    try {
      const managerInfo = req.body
      const managerId = req.params.managerId
      app.Manager.updateManagerInfo(managerId, managerInfo).then((result) => {
        res.sendStatus(200)
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  })

  router.put("/change_password", async (req, res, next) => {
    try {
      const { managerId, oldPassword, newPassword, confirmedNewPassword } =
        req.body
      // console.log(managerId, oldPassword,newPassword, confirmedNewPassword )
      let error = {}
      if (newPassword !== confirmedNewPassword) {
        error.confirmedNewPassword = "Mật khẩu không trùng khớp!"
      }
      if (!_.isEmpty(error)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.user.confirmed_password.invalid",
          messages: error,
        }
      }

      await app.Manager.changePassword(managerId, oldPassword, newPassword)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get(
    "/get_number_of_notifications/:managerId",
    async (req, res, next) => {
      try {
        const { managerId } = req.params
        const startAt = moment().subtract(7, "d").utc().format()
        const endAt = moment().utc().format()
        const numberOfNotifications =
          await app.ManagerNotifications.getNumberOfNotifications(
            managerId,
            startAt,
            endAt
          )
        res.send({ numberOfNotifications })
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get(
    "/get_notification_settings/:managerId",
    async (req, res, next) => {
      try {
        const { managerId } = req.params
        const result = await app.ManagerNotificationSettings.getSettings(
          managerId
        )
        res.send({ result })
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.put(
    "/update_notification_settings/:managerId",
    async (req, res, next) => {
      try {
        const { managerId } = req.params
        const {
          notificationAlertStatus,
          overThresholdAlertStatus,
          wrongStructureAlertStatus,
          disconnectionAlertStatus,
        } = req.body
        await app.ManagerNotificationSettings.updateSettings(managerId, {
          notificationAlertStatus,
          overThresholdAlertStatus,
          wrongStructureAlertStatus,
          disconnectionAlertStatus,
        })
        res.sendStatus(200)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.get("/getInfo", async (req, res, next) => {
    try {
      console.log(req.headers.authorization)
      const token = req.headers.authorization
      const manager = await app.Manager.getManagerIdByToken(token)
      if (isEmpty(manager)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.user.access_token.invalid",
          messages: "Người dùng không tồn tại",
        }
      }
      const managerId = manager[0].managerId
      const managerInfo = await app.Manager.getManagerInfo(managerId)
      res.send(managerInfo)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
