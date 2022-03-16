import HttpStatus from "http-status-codes"
import { Op } from "sequelize"
import models from "models"
import { newId, generateToken } from "models/utils"
import app from "app"
import _ from "lodash"
class Manager {
  constructor() { }

  async checkManagerPermission(managerId, permission) {
    const result = await models.Manager.findAll({
      where: { id: managerId },
      attributes: ["id"],
      include: [
        {
          model: models.Character,
          attributes: ["id"],
          required: true,
          include: [
            {
              attributes: ["id"],
              model: models.CharacterPermission,
              where: { permissionStatus: 1 },
              include: [
                {
                  model: models.Permission,
                  where: { name: permission },
                },
              ],
            },
          ],
        },
      ],
    })

    if (result.length === 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.permission.invalid_permission",
        messages: "Bạn không có quyền để thực hiện chức năng này!",
      }
    }
    return true
  }

  async checkUniqueEmail(email) {
    const managers = await models.Manager.findAll({ where: { email } })
    if (managers.length) return false
    return true
  }

  async createManager(manager, station) {
    // console.log('check manager', manager , station)
    // check email is registered
    const isExistedEmail = await this.checkUniqueEmail(manager.email)
    if (!isExistedEmail) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.register.non_unique_email",
        messages: "Email đã được đăng ký!",
      }
    }

    // check character
    const character = await app.Character.getCharacterById(manager.characterId)
    if (!character) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.register.invalid_character",
        messages: "Quyền không hợp lệ!",
      }
    }

    if (station !== undefined && station.length <= 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.register.invalid_station",
        messages: "Trạm theo dõi là trường bắt buộc!",
      }
    }

    // transaction ???
    // save manager to database
    const newManager = await models.Manager.create(
      {
        id: newId(),
        ...manager,
        password: manager.phoneNumber,
        isActive: true,
        isDefault: 0,
        ManagerAccessToken: { token: generateToken(40) },
      },
      { include: [models.ManagerAccessToken] }
    )
    // add manager t
    const managerStation = station.map((item, index) => ({
      id: newId(),
      managerId: newManager.id,
      stationId: item,
      orderStation: index,
    }))
    await models.ManagerStation.bulkCreate(managerStation)
    await app.ManagerNotificationSettings.create(
      newManager.id,
      "WRONGSTRUCTURE",
      1
    )
    await app.ManagerNotificationSettings.create(
      newManager.id,
      "OVERTHRESHOLD",
      1
    )
    await app.ManagerNotificationSettings.create(newManager.id, "DISCONNECT", 1)

    return this.getManagerById(newManager.id)
  }

  async getManagerById(id) {
    return models.Manager.findAll({
      where: { id },
      attributes: [
        "id",
        "characterId",
        "password",
        "name",
        "email",
        "phoneNumber",
        "address",
        "workplace",
        "isActive",
        "isDefault",
      ],
      include: [
        {
          model: models.ManagerStation,
          attributes: ["stationId"],
          order: [["orderStation", "DESC"]],
          include: [
            {
              model: models.Station,
              attributes: ["name"],
            },
          ],
        },
        {
          model: models.Character,
          attributes: ["name"],
        },
      ],
    })
  }

  async getManagers() {
    return models.Manager.findAll({
      attributes: [
        "id",
        "characterId",
        "name",
        "email",
        "phoneNumber",
        "address",
        "workplace",
        "isActive",
        "isDefault",
      ],
      include: [
        {
          model: models.ManagerStation,
          attributes: ["stationId"],
          order: [["orderStation", "DESC"]],
          include: [
            {
              model: models.Station,
              attributes: ["name"],
            },
          ],
        },
        {
          model: models.Character,
          attributes: ["name"],
        },
      ],
    })
  }

  async getManagerInfoById(managerId) {
    return models.Manager.findOne({
      attributes: ["id", "characterId"],
      where: { id: managerId },
    })
  }

  async updateManager(accountId, manager, station) {
    // console.log('check manager', manager , station)

    // check character
    const character = await app.Character.getCharacterById(manager.characterId)
    if (!character) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.register.invalid_character",
        messages: "Quyền không hợp lệ!",
      }
    }

    if (station !== undefined && station.length <= 0) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.register.invalid_station",
        messages: "Trạm theo dõi là trường bắt buộc!",
      }
    }

    // transaction ???
    // save manager to database
    await models.Manager.update({ ...manager }, { where: { id: accountId } })
    // add manager t
    await models.ManagerStation.destroy({ where: { managerId: accountId } })
    const managerStation = station.map((item, index) => ({
      id: newId(),
      managerId: accountId,
      stationId: item,
      orderStation: index,
    }))
    await models.ManagerStation.bulkCreate(managerStation)

    return this.getManagerById(accountId)
  }

  async deleteManagerById(id) {
    const managers = await models.Manager.findByPk(id)
    if (!managers) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.manager.delete.not_found_manager",
        messages: "Không tìm thấy manager",
      }
    } else if (managers.isDefault) {
      throw {
        status: HttpStatus.BAD_REQUEST,
        id: "api.manager.delete.invalid",
        messages: "Không thể xóa tài khoản này!",
      }
    }

    // await managers.destroy({ cascade: true })
    await models.Manager.destroy({ where: { id: id } })
    await models.ManagerNotificationSettings.destroy({
      where: { managerId: id },
    })
  }

  async findManagerByEmail(email) {
    return models.Manager.findAll({
      raw: true,
      where: { email },
      attributes: [
        "id",
        "email",
        "name",
        "password",
        "address",
        "workplace",
        "phoneNumber",
        [models.Sequelize.col("ManagerAccessToken.token"), "token"],
      ],
      include: [
        {
          model: models.ManagerAccessToken,
          attributes: [],
        },
      ],
    })
  }

  getStationByManagerId(managerId) {
    return models.Manager.findAll({
      where: { managerId: managerId },
      include: [
        {
          model: models.Station,
          attributes: [["name", "stationName"]],
          required: true,
        },
      ],
    })
  }

  updateManagerInfo(managerId, info) {
    return models.Manager.update(
      {
        name: info.name,
        phoneNumber: info.phoneNumber,
        address: info.address,
        workplace: info.workplace,
      },
      {
        where: { id: managerId },
      }
    )
  }

  async changePassword(managerId, oldPassword, newPassword) {
    try {
      const manager = await models.Manager.findOne({ where: { id: managerId } })
      const isMatch = models.Manager.comparePassword(
        oldPassword,
        manager.password
      )
      if (!isMatch) {
        throw {
          status: HttpStatus.UNAUTHORIZED,
          id: "api.manager.change_password.wrong_password",
          message: "Mật khẩu không đúng!",
        }
      }
      await models.Manager.update(
        { password: newPassword },
        { where: { id: managerId } }
      )
    } catch (error) {
      throw error
    }
  }


  async getAutoUpdateStationManager() {
    const { id } = await models.Permission.findOne({ raw: true, attributes: ['id'], where: { name: 'auto_update_station' } })
    return models.Manager.findAll({
      where: {
        characterId: [
          models.sequelize.literal(
            `select characterId from character_permission where permissionId = '${id}' and permissionStatus = 1`
          ),
        ],
      },
      attributes: ["id"],
    })
  }

  updateSocketStatus(managerId, status) {
    return models.Manager.update(
      { socketStatus: status },
      {
        where: {
          id: managerId,
        },
      }
    )
  }

  getManagerByPermission(permission) {
    return models.Manager.findAll({
      raw: true,
      attributes: ["id", "email"],
      include: [
        {
          model: models.Character,
          attributes: [],
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
        },
      ],
    })
  }

  getManagerByCharacterId(characterIdList) {
    return models.Manager.findAll({
      raw: true,
      attributes: ["id", "email"],
      where: {
        characterId: characterIdList,
      },
    })
  }

  getManagerIdByToken(token) {
    return models.ManagerAccessToken.findAll({
      raw: true,
      where: {
        token,
      },
      attributes: ["managerId"],
    })
  }

  async getManagerInfo(managerId) {
    const info = await models.Manager.findOne({
      where: { id: managerId },
      attributes: [
        "characterId",
        "name",
        "email",
        "phoneNumber",
        "workplace",
        "address",
      ],
    })
    const routeList = await models.CharacterRoute.findAll({
      where: { characterId: info.characterId, routeStatus: 1 },
      attributes: [
        [models.Sequelize.col("Route.name"), "routeSymbol"],
        [models.Sequelize.col("Route.displayName"), "routeDisplayName"],
        [models.Sequelize.col("Route.routeOrder"), "routeOrder"],
        [models.Sequelize.col("Route.MainRoute.name"), "mainRouteSymbol"],
        [
          models.Sequelize.col("Route.MainRoute.displayName"),
          "mainRouteDisplayName",
        ],
      ],
      order: [[models.Sequelize.col("Route.routeOrder"), "ASC"]],
      include: [
        {
          model: models.Route,
          attributes: [],
          where: {
            isVisible: 1,
          },
          include: [
            {
              model: models.MainRoute,
              attributes: [],
            },
          ],
        },
      ],
    })
    return {
      info,
      routeList,
    }
  }
}

export default Manager
