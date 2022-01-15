import app from "app"
import models from "models"
import { newId } from "models/utils"

class Notification {
  constructor() {}

  async countUnread(userId) {
    const unRead = await models.UserNotification.count({
      where: { userId, isRead: false },
    })
    return { unRead }
  }

  async markRead(id) {
    await models.UserNotification.update(
      { isRead: true },
      { where: { id: [id] } }
    )
  }

  async addNotification(station, notificationType) {
    let contentNotification
    const type = notificationType
    let stationId = station.id
    switch (notificationType) {
      case "DISCONNECT":
        contentNotification = `Trạm ${station.name} không gửi dữ liệu`
        break
      case "":
        break
      default:
        break
    }

    const notification = await models.Notification.create({
      id: newId(),
      type,
      stationId,
      contentNotification,
      notiTime: Date.now(),
      endTime: Date.now(),
    })

    const users = await models.UserStation.findAll({
      where: { stationId },
      attributes: ["userId"],
    })
    let data = []
    users.forEach((user) => {
      data.push({
        id: newId(),
        receiverId: user.userId,
        notificationId: notification.id,
      })
    })
    models.UserNotification.bulkCreate(data)
  }

  async updateNotification(id, attributes) {
    await models.Notification.update(attributes, { where: { id: [id] } })
  }

  async findLatestState(stationId) {
    let latestState = await models.Notification.findAll({
      where: { stationId },
      limit: 1,
      order: [["createdAt", "DESC"]],
    })
    return latestState
  }
}

export default Notification
