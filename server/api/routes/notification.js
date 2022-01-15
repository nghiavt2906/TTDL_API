import _ from "lodash"
import HttpStatus from "http-status-codes"
import { Router } from "express"
import app from "app"
import bodyParser from "body-parser"
import moment from "moment"

const router = Router()
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/notifications", router)

  router.post("/firebase", async (req, res, next) => {
    try {
      const { citizenId, tokenDevice } = req.body
      let errors = {}
      if (_.isEmpty(citizenId)) errors.citizenId = "citizenId is empty"
      if (_.isEmpty(tokenDevice)) errors.tokenDevice = "token is empty"

      if (!_.isEmpty(errors))
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.notification.firebase_token_invalid",
          messages: errors,
        }

      await app.Firebase.addToken(citizenId, tokenDevice)
      res.json({ result: "ok" })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/firebase", async (req, res, next) => {
    try {
      const { citizenId, tokenDevice } = req.body
      // console.log(req.body)
      let errors = {}
      if (_.isEmpty(citizenId)) errors.citizenId = "citizenId is empty"
      if (_.isEmpty(tokenDevice)) errors.tokenDevice = "token is empty"

      if (!_.isEmpty(errors))
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.notification.firebase_token_invalid",
          messages: errors,
        }

      await app.Firebase.deleteToken(citizenId, tokenDevice)
      res.json({ result: "ok" })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/citizen/:citizenId/unread", async (req, res, next) => {
    try {
      const { citizenId } = req.params
      const result = await app.CitizenNotification.countUnread(citizenId)
      res.json({ result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/user/:userId/unread", async (req, res, next) => {
    try {
      const { userId } = req.params
      const result = await app.UserNotification.countUnread(userId)
      res.json({ result })
    } catch (error) {
      next(error)
    }
  })

  router.get("/citizen/:citizenId/messages", async (req, res, next) => {
    try {
      const { citizenId } = req.params
      const { page, limit } = req.query
      const result = await app.CitizenNotification.getNotifications(
        citizenId,
        parseInt(page) - 1,
        parseInt(limit)
      )
      res.json({ data: result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/user/:userId/messages", async (req, res, next) => {
    try {
    } catch (error) {
      next(error)
    }
  })

  router.get("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
      const startAt = moment().subtract(30, "d").utc().format()
      const endAt = moment().utc().format()
      const result = await app.ManagerNotifications.getNotifications(
        managerId,
        startAt,
        endAt,
        page,
        limit
      )
      await app.ManagerNotifications.updateSeenNotification(
        managerId,
        startAt,
        endAt
      )
      res.send(result)
    } catch (error) {
      next(error)
    }
  })

  router.get(
    "/get_number_of_notifications/:managerId",
    async (req, res, next) => {
      try {
        const { managerId } = req.params
        const startAt = moment().subtract(30, "d").utc().format()
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

  router.put(
    "/read_notification/:managerId/:notificationId",
    async (req, res, next) => {
      try {
        const { managerId, notificationId } = req.params
        await app.ManagerNotifications.updateReadNotification(
          managerId,
          notificationId
        )
        res.sendStatus(200)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.put(
    "/mark_all_read_notifications/:managerId",
    async (req, res, next) => {
      try {
        const { managerId } = req.params
        const endAt = moment(req.query?.startAt)
          .add(1, "seconds")
          .utc()
          .format()
        const startAt = moment(endAt).subtract(30, "d").utc().format()
        await app.ManagerNotifications.markAllReadNotifications(
          managerId,
          startAt,
          endAt
        )
        res.sendStatus(200)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )
}
