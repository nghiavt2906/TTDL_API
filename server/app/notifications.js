import app from "app"
import models from "models"
import { newId } from "models/utils"

class Notifications {
  constructor() {}

  create = (type, dataId, contentNotification, detail, notiTime) => {
    console.log(contentNotification)
    return models.Notifications.create({
      id: newId(),
      type,
      dataId,
      contentNotification,
      detail,
      notiTime,
    })
  }
}

export default Notifications
