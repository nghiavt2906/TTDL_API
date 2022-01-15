import { Router } from "express"
import models from "models"
import * as func from "utils/functions"
const router = Router()
import bodyParser from "body-parser"
import app from "app"
import permission from "models/permission"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/nhomnguoidung", router)

  router.post("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "insert_user_group")

      const { name, permissionList, routeList } = req.body
      console.log(req.body)
      const result = await app.Character.createNewCharacter(
        name,
        permissionList,
        routeList
      )
      // const result = await app.Character.getCharacters()
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getRouteList/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, "insert_user_group")

      const result = await app.Character.getNewCharacterInfo()
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getInfo/:characterId/:managerId", async (req, res, next) => {
    try {
      const { managerId, characterId } = req.params
      // await app.Manager.checkManagerPermission(managerId, "update_user_group")

      const result = await app.Character.getNewCharacterInfoById(characterId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/", async (req, res, next) => {
    try {
      const characters = await app.Character.getCharacters()
      const permissions = await app.Permission.getPermission()
      res.send({
        characters,
        permissions,
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put(
    "/updatePermission/:managerId/:characterId/:permissionId",
    async (req, res, next) => {
      try {
        const { managerId, characterId, permissionId } = req.params
        await app.Manager.checkManagerPermission(managerId, "edit_user_group")

        await app.CharacterPermission.updatePermission(
          characterId,
          permissionId
        )
        res.sendStatus(200)
      } catch (error) {
        console.log(error)
        next(error)
      }
    }
  )

  router.delete("/:managerId/:characterId", async (req, res, next) => {
    try {
      const { managerId, characterId } = req.params
      await app.Manager.checkManagerPermission(managerId, "delete_user_group")

      await app.Character.deleteCharacter(characterId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:characterId/:managerId", async (req, res, next) => {
    try {
      const { managerId, characterId } = req.params
      await app.Manager.checkManagerPermission(managerId, "edit_user_group")

      const { name, permissionList, routeList } = req.body
      const result = await app.Character.updateCharacterInfo(
        characterId,
        name,
        permissionList,
        routeList
      )
      // const result = await app.Character.getCharacters()
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
