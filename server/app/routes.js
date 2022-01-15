import models from "models"
import { Op } from "sequelize"

class Route {
  constructor() {}

  getRouteList() {
    return models.Route.findAll({
      where: { isVisible: 1 },
      order: [["routeOrder", "ASC"]],
      attributes: ["id", ["displayName", "name"], "isRequired"],
      include: [
        {
          model: models.Permission,
          attributes: ["id", ["displayName", "name"], "isRequired"],
        },
      ],
    })
  }

  async getUnsubmitRoute(routeIdList) {
    return models.Route.findAll({
      where: {
        id: {
          [Op.not]: routeIdList,
        },
      },
      attributes: ["id"],
    })
  }
}

export default Route
