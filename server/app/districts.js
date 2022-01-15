
import models from "models"

class District {
  constructor() {}

  getDistrictName = () => {
    // return models.District.findAll({ where: { monitoringType: [monitoringType] }, attributes: ["id", "name", "monitoringType", "symbol"] })
    return models.District.findAll({ attributes: ["id", "name"] })
  }

}

export default District
