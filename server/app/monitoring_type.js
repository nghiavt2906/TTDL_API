import models from "models"

class MonitoringType {
  constructor() {}

  getMonitoringType = () => {
    // return models.MonitoringType.findAll({ attributes: ["id", "name", "symbol"] })
    return models.MonitoringType.findAll({ attributes: ["id", "name"] })
  }

  getPublicMonitoringType = () => {
    // return models.MonitoringType.findAll({ attributes: ["id", "name", "symbol"] })
    return models.MonitoringType.findAll({
      attributes: ["id", "name"],
      where: {
        isPublic: 1
      } 
    })
  }
}

export default MonitoringType
