import app from "app"
import models from "models"
import { newId } from "models/utils"
import { Op } from "sequelize"
import _ from "lodash"

class ManagerNotifications {
  constructor() {}

  create = (managerId, notificationId) => {
    return models.ManagerNotifications.create({
      id: newId(),
      managerId,
      notificationId,
    })
  }

  updateReadNotification = (managerId, notificationId) => {
    console.log(managerId, notificationId)
    return models.ManagerNotifications.update(
      {
        isRead: 1,
      },
      {
        where: {
          managerId,
          notificationId,
        },
      }
    )
  }

  updateSeenNotification = (managerId, startAt, endAt) => {
    return models.ManagerNotifications.update(
      {
        isSeen: 1,
      },
      {
        where: {
          managerId,
          createdAt: { [Op.between]: [startAt, endAt] },
        },
      }
    )
  }

  deleteNotification = (managerId) => {
    return models.ManagerNotifications.destroy({
      where: {
        managerId,
      },
    })
  }

  listNotification = (managerId, startAt, endAt) => {
    return models.ManagerNotifications.findAll({
      attributes: ["notificationId", "isSeen", "isRead"],
      where: {
        managerId,
        createdAt: { [Op.between]: [startAt, endAt] },
      },
    })
  }

  getNumberOfNotifications = (managerId, startAt, endAt) => {
    return models.ManagerNotifications.count({
      where: {
        managerId,
        isSeen: 0,
        createdAt: { [Op.between]: [startAt, endAt] },
      },
    })
  }

  getNotifications = async (managerId, startAt, endAt, page, limit) => {
    const managerNotifications = await models.ManagerNotifications.findAll({
      raw: true,
      order: [["createdAt", "DESC"]],
      separate: true,
      offset: page * limit,
      limit: limit,
      attributes: ["notificationId", "isRead", "isSeen"],
      where: {
        managerId,
        createdAt: { [Op.between]: [startAt, endAt] },
      },
    })
    const notificationIds = managerNotifications.map(
      (value) => value.notificationId
    )
    const notifications = await models.Notifications.findAll({
      raw: true,
      where: {
        id: notificationIds,
      },
      attributes: ["id", "type", "contentNotification", "detail", "notiTime"],
    })
    let result = managerNotifications.map((item) => {
      const index = _.findIndex(
        notifications,
        (notification) => notification.id === item.notificationId
      )
      return {
        ...item,
        type: notifications[index]?.type,
        contentNotification: notifications[index]?.contentNotification,
        detail: notifications[index]?.detail,
        createdAt: notifications[index]?.notiTime,
        // createdAt: notifications[index]?.createdAt,
      }
    })
    return result
  }

  markAllReadNotifications = (managerId, startAt, endAt) => {
    return models.ManagerNotifications.update(
      { isRead: 1 },
      {
        where: {
          managerId,
          // createdAt: {
          //   [Op.between]: [startAt, endAt],
          // },
        },
      }
    )
  }

  cleanUpNotifications = async () => {
    const MAX_NOTIFICATIONS = 500
    const managers = await models.Manager.findAll({
      raw: true,
      attributes: ["id"],
    })
    // console.log(managers)
    for (let manager of managers) {
      const numberOfNotifications = await models.ManagerNotifications.count({
        where: { managerId: manager.id },
      })
      if (numberOfNotifications <= MAX_NOTIFICATIONS) continue
      const result = await models.ManagerNotifications.findAll({
        raw: true,
        offset: MAX_NOTIFICATIONS,
        order: [['createdAt', 'DESC']],
        attributes: ["id"],
        where: { managerId: manager.id },
      })
      const notificationIds = result.map(item => item.id)
      // console.log(notificationIds)
      await models.ManagerNotifications.destroy({where: {id: notificationIds}})
    }
  }
}

export default ManagerNotifications
