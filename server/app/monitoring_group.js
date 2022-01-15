import models from "models"

class MonitoringGroup {
  constructor() {}

  getMonitoringGroupName = (monitoringType) => {
    // return models.MonitoringGroup.findAll({ where: { monitoringType: [monitoringType] }, attributes: ["id", "name", "monitoringType", "symbol"] })
    return models.MonitoringGroup.findAll({
      where: { monitoringType: [monitoringType], isPublic: 1 },
      attributes: ["id", "name"],
    })
  }

  getPublicMonitoringGroup = (monitoringType) => {
    // return models.MonitoringGroup.findAll({ where: { monitoringType: [monitoringType] }, attributes: ["id", "name", "monitoringType", "symbol"] })
    return models.MonitoringGroup.findAll({
      where: { monitoringType: [monitoringType], isPublic: 1 },
      attributes: ["id", "name"],
    })
  }

  getMonitoringGroupInfo = (monitoringType) => {
    return models.MonitoringGroup.findAll({
      where: { monitoringType: [monitoringType], isPublic: 1 },
      attributes: ["id", "name", "monitoringType", "symbol", "description"],
    })
  }

  deleteMonitoringGroup = (id) => {
    return models.MonitoringGroup.destroy({ where: { id: [id] } })
  }

  updateMonitoringGroup = (id, info) => {
    return models.MonitoringGroup.update(
      {
        name: info.monitoringGroup,
        monitoringType: info.monitoringType,
        symbol: info.symbol,
        description: info.description,
      },
      { where: { id: [id] } }
    )
  }

  createMonitoringGroup = (id, info) => {
    // return models.MonitoringGroup.create({'id': '3dsadfgfdgsdfgf', 'name': 'Quan trắc nước sạch', 'monitoringType': 'QTN', 'symbol': 'QTNS', 'description': 'Nước sạch'})
    return models.MonitoringGroup.create({
      id: id,
      name: info.monitoringGroup,
      monitoringType: info.monitoringType,
      symbol: info.symbol,
      description: info.description,
      isPublic : 1
    })
  }

  getMonitoringGroupByType = (monitoringType) => {
    return models.MonitoringGroup.findAll({
      where: {monitoringType},
      attributes: ['id', 'name']
    })
  }
}

export default MonitoringGroup
