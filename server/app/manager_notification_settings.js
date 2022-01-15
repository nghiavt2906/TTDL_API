import models from "models"
import { newId } from "models/utils"

class ManagerNotificationSettings {
  constructor() {}

  update = (data, condition) => {
    return models.ManagerNotificationSettings.update(data, {
      where: condition,
    })
  }

  create = (managerId, type, status) => {
    console.log(managerId, type, status)
    return models.ManagerNotificationSettings.create({
      id: newId(),
      managerId,
      type: type,
      status,
    })
  }

  getSettingsByAtrributes = (managerId, attributes) => {
    return models.ManagerNotificationSettings.findOne({
      raw: true,
      where: {
        managerId,
      },
      attributes: [...attributes],
    })
  }

  getSettings = (managerId) => {
    return models.ManagerNotificationSettings.findOne({
      raw: true,
      where: {
        managerId,
      },
      attributes: [
        "notificationAlertStatus",
        "overThresholdAlertStatus",
        "wrongStructureAlertStatus",
        "disconnectionAlertStatus",
      ],
    })
  }

  updateSettings = (managerId, data) => {
    return models.ManagerNotificationSettings.update(
      { ...data },
      { where: { managerId } }
    )
  }
}

export default ManagerNotificationSettings
