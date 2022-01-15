import models from "models"
import { newId } from "models/utils"
import app from "app"
import HttpStatus from "http-status-codes"
import _ from "lodash"

class Character {
  constructor() {}

  async checkUniqueCharacter(name) {
    const character = await models.Character.findAll({ where: { name } })
    if (character.length) return false
    return true
  }

  async createCharacter(name, characterPermission) {
    const isExistedCharacter = await this.checkUniqueCharacter(name)
    if (!isExistedCharacter) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.character.non_unique_character",
        messages: "Nhóm người dùng đã tồn tại!",
      }
    }
    const character = await models.Character.create({
      id: newId(),
      name,
    })
    await app.CharacterPermission.createCharacterPermission(
      character.id,
      characterPermission
    )
    return this.getCharacterById(character.id)
  }

  async createNewCharacter(name, permissionsList, routeList) {
    const isExistedCharacter = await this.checkUniqueCharacter(name)
    if (!isExistedCharacter) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.character.non_unique_character",
        messages: "Nhóm người dùng đã tồn tại!",
      }
    }
    const character = await models.Character.create({
      id: newId(),
      name,
    })
    await app.CharacterPermission.createNewCharacterPermission(
      character.id,
      permissionsList
    )

    await app.CharacterRoute.createNewCharacterRoute(character.id, routeList)
    return this.getCharacterById(character.id)
  }

  getCharacters() {
    return models.Character.findAll({
      attributes: ["id", "name", "isDefault"],
      include: [
        {
          model: models.CharacterPermission,
          attributes: [["permissionId", "id"], "permissionStatus"],
          where: {
            permissionId: [
              models.sequelize.literal(
                `select id from permissions  where isVisible = 1`
              ),
            ],
          },
        },
      ],
    })
  }

  getSelectCharacters() {
    return models.Character.findAll({
      attributes: ["id", "name", "isDefault"],
    })
  }

  getCharacterById(characterId) {
    return models.Character.findAll({
      where: { id: characterId },
      attributes: ["id", "name", "isDefault"],
      include: [
        {
          model: models.CharacterPermission,
          attributes: [["permissionId", "id"], "permissionStatus"],
          where: {
            permissionId: [
              models.sequelize.literal(
                `select id from permissions  where isVisible = 1`
              ),
            ],
          },
        },
      ],
    })
  }

  deleteCharacter(characterId) {
    return models.Character.destroy({
      where: { id: characterId },
    })
  }

  async updateCharacter(characterId, name, characterPermission) {
    // await this.deleteCharacter(characterId)
    const character = await models.Character.update(
      {
        name,
      },
      {
        where: {
          id: characterId,
        },
      }
    )
    await app.CharacterPermission.createCharacterPermission(
      characterId,
      characterPermission
    )
    return this.getCharacterById(characterId)
  }

  async updateCharacterInfo(characterId, name, permissionList, routeList) {
    // await this.deleteCharacter(characterId)
    const character = await models.Character.update(
      {
        name,
      },
      {
        where: {
          id: characterId,
        },
      }
    )
    await app.CharacterPermission.createNewCharacterPermission(
      characterId,
      permissionList
    )

    await app.CharacterRoute.createNewCharacterRoute(characterId, routeList)
    return this.getCharacterById(characterId)
  }

  getCharacterListByPermission(permission) {
    return models.Character.findAll({
      raw: true,
      attributes: ["id"],
      include: [
        {
          model: models.CharacterPermission,
          attributes: [],
          where: {
            permissionStatus: 1,
          },
          include: [
            {
              model: models.Permission,
              attributes: [],
              where: {
                name: permission,
              },
            },
          ],
        },
      ],
    })
  }

  async syncCharacterPermission() {
    const characterIdList = await models.Character.findAll({
      attributes: ["id"],
      raw: true,
    })
    const permissionIdList = await models.Permission.findAll({
      attributes: ["id"],
      raw: true,
    })
    for (let character of characterIdList) {
      for (let permission of permissionIdList) {
        const result = await models.CharacterPermission.findAll({
          where: { characterId: character.id, permissionId: permission.id },
          raw: true,
        })
        if (result.length === 0) {
          // console.log(character.id, permission.id)
          await models.CharacterPermission.create({
            id: newId(),
            characterId: character.id,
            permissionId: permission.id,
            permissionStatus: 1,
          })
        }
      }
    }
  }

  async syncCharacterRoute() {
    const characterIdList = await models.Character.findAll({
      attributes: ["id"],
      raw: true,
    })

    const permissionIdList = await models.Permission.findAll({
      attributes: ["id"],
      raw: true,
    })

    const routeIdList = await models.Route.findAll({
      attributes: ["id"],
      raw: true,
    })

    const permissionList = permissionIdList.map(permission => ({permissionId: permission.id, permissionStatus: 1}))
    const routeList = routeIdList.map(route => ({routeId: route.id, routeStatus: 1}))

    // console.log(permissionList, routeList)
    //Delete Character Permission
    for(let character of characterIdList){
      // console.log(character.id)
      await models.CharacterPermission.destroy({where: {characterId: character.id}})
      await app.CharacterPermission.createNewCharacterPermission(character.id, permissionList)
      await models.CharacterRoute.destroy({where: {characterId: character.id}})
      await app.CharacterRoute.createNewCharacterRoute(character.id, routeList)
    }
  }

  async getNewCharacterInfo() {
    let routeList = await app.Route.getRouteList()
    routeList = routeList.map((route) => {
      let permissions = route.dataValues.Permissions
      permissions = permissions.map((permission) => {
        return {
          ...permission.dataValues,
          permissionStatus: route.dataValues.isRequired ? true : false,
          isRequired: permission.dataValues.isRequired ? true : false,
        }
      })
      return {
        id: route.dataValues.id,
        name: route.dataValues.name,
        isRequired: route.dataValues.isRequired ? true : false,
        routeStatus: route.dataValues.isRequired ? true : false,
        permissions,
      }
    })
    return { routeList }
  }

  async getNewCharacterInfoById(characterId) {
    const { name } = await models.Character.findOne({
      where: { id: characterId },
      attributes: ["name"],
    })
    let routeList = await app.Route.getRouteList()
    let characterPermission =
      await app.CharacterPermission.getCharacterPermission(characterId)
    let characterRoute = await app.CharacterRoute.getCharacterRouteById(
      characterId
    )
    routeList = routeList.map((route) => {
      const routeIndex = _.findIndex(characterRoute, (item) => {
        return item.routeId === route.id
      })

      let permissions = route.dataValues.Permissions
      permissions = permissions.map((permission) => {
        const permissionIndex = _.findIndex(characterPermission, (item2) => {
          return item2.permissionId === permission.id
        })
        return {
          ...permission.dataValues,
          permissionStatus: characterPermission[permissionIndex]
            .permissionStatus
            ? true
            : false,
          isRequired: permission.dataValues.isRequired ? true : false,
        }
      })
      return {
        id: route.dataValues.id,
        name: route.dataValues.name,
        isRequired: route.dataValues.isRequired ? true : false,
        routeStatus: characterRoute[routeIndex].routeStatus ? true : false,
        permissions,
      }
    })
    return { id: characterId, name, routeList }
  }
}

export default Character
