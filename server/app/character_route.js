import models from "models"
import { newId } from "models/utils"
import HttpStatus from "http-status-codes"
import app from "app"

class CharacterRoute {
  constructor() {}

  createNewCharacterRoute = async (characterId, routeList) => {
    await models.CharacterRoute.destroy({ where: { characterId } })
    let submitRouteIdList = routeList.map((item) => {
      return item.routeId
    })
    let unsubmitRouteList = await app.Route.getUnsubmitRoute(submitRouteIdList)
    let newRouteList = unsubmitRouteList.map((item) => {
      return {
        routeId: item.id,
        routeStatus: 0,
      }
    })
    const finalRoutes = [...routeList, ...newRouteList]
    // console.log(finalRoutes)

    const characterRouteData = finalRoutes.map((item) => ({
      id: newId(),
      characterId,
      ...item,
    }))

    // console.log(characterRouteData)
    return models.CharacterRoute.bulkCreate(characterRouteData)
  }

  getCharacterRouteById = (characterId) => {
    return models.CharacterRoute.findAll({
      where: { characterId },
      raw: true,
      attributes: ["characterId", "routeId", "routeStatus"],
    })
  }
}

export default CharacterRoute
