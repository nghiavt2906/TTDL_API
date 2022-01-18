import models from "models"

class ApiSharedStation {
	constructor() { }

	getApiSharedStationIdsByApiId = apiKeyId => models.ApiSharedStation.findAll({
		attributes: ['id'],
		where: {
			apiKeyId
		}
	})

	getStationIdsByApiId = apiKeyId => models.ApiSharedStation.findAll({
		attributes: ['stationId'],
		where: {
			apiKeyId
		}
	})

	createSharedStations = data => models.ApiSharedStation.bulkCreate(data)

	deleteSharedStations = ids => models.ApiSharedStation.destroy({ where: { id: ids } })
}

export default ApiSharedStation