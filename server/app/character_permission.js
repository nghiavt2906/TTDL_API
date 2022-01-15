import models from "models"
import { newId } from "models/utils"
import HttpStatus from "http-status-codes"
import app from "app"

class CharacterPermission {
  constructor() {}

  getCharacterPermissionById(characterId) {
    return models.CharacterPermission.findAll({
      where: { characterId: characterId },
      attributes: [
        "permissionId",
        "permissionStatus",
        [models.Sequelize.col("Permission.name"), "name"],
        [models.Sequelize.col("Permission.displayName"), "displayName"],
      ],
      include: [
        {
          model: models.Permission,
          attributes: [],
        },
      ],
    })
  }

  getCharacterPermission(characterId) {
    return models.CharacterPermission.findAll({
      raw: true,
      where: { characterId },
      attributes: ["permissionId", "permissionStatus"],
    })
  }

  createCharacterPermission = async (characterId, characterPermission) => {
    await models.CharacterPermission.destroy({ where: { characterId } })
    let submitPermistions = characterPermission.map((item) => {
      return item.permissionId
    })
    let unsubmitPermissions = await app.Permission.getUnsubmitPermission(
      submitPermistions
    )
    let newPermissions = unsubmitPermissions.map((item) => {
      return {
        permissionId: item.id,
        permissionStatus: 0,
      }
    })
    const finalPermissions = [...characterPermission, ...newPermissions]
    // console.log(finalPermissions)

    const characterPermissionData = finalPermissions.map((item) => ({
      id: newId(),
      characterId,
      ...item,
    }))
    return models.CharacterPermission.bulkCreate(characterPermissionData)
  }

  createNewCharacterPermission = async (characterId, permissionList) => {
    await models.CharacterPermission.destroy({ where: { characterId } })
    let submitPermisionIdList = permissionList.map((item) => {
      return item.permissionId
    })
    let unsubmitPermissionList = await app.Permission.getUnsubmitPermission(
      submitPermisionIdList
    )
    let newPermissionList = unsubmitPermissionList.map((item) => {
      return {
        permissionId: item.id,
        permissionStatus: 0,
      }
    })
    const finalPermissions = [...permissionList, ...newPermissionList]
    // console.log(finalPermissions)

    const characterPermissionData = finalPermissions.map((item) => ({
      id: newId(),
      characterId,
      ...item,
    }))
    return models.CharacterPermission.bulkCreate(characterPermissionData)
  }

  updatePermission = async (characterId, permissionId) => {
    const permission = await models.CharacterPermission.findOne({
      where: {
        characterId,
        permissionId,
      },
      attributes: ["permissionStatus"],
    })
    const value = permission.permissionStatus === 1 ? 0 : 1
    return models.CharacterPermission.update(
      {
        permissionStatus: value,
      },
      {
        where: { characterId, permissionId },
      }
    )
  }

  getAutoUpdateStationCharacter = () => {
    return models.CharacterPermission.findAll({
      where: {
        permissionId: "55qPomXM73PWqYKXzYwk",
        permissionStatus: 1,
      },
      attributes: ["characterId"],
    })
  }
}

export default CharacterPermission
