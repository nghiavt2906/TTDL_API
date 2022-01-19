import models from "models"
import { generateSecret } from "models/utils"
import HttpStatus from "http-status-codes"

import ApiTypes from 'constant/api_type'

class ApiKey {
	constructor() { }

	getApiKeyById = id => models.ApiKey.findOne({ where: { id } })

	getAllApiKeysByType = type => models.ApiKey.findAll({
		where: {
			isReceptionApi: type === ApiTypes.DATA_RECEPTION
		},
		include: [
			{
				model: models.Station,
				attributes: ["name"]
			}
		]
	})

	validateApiSecretKey = async (secret, apiType) => {
		if (secret === undefined)
			throw {
				status: HttpStatus.BAD_REQUEST,
				id: "api.api_key.empty",
				messages: "Vui lòng cung cấp API key!",
			}

		const result = await models.ApiKey.findOne({
			where: { secret, isReceptionApi: apiType === ApiTypes.DATA_RECEPTION }
		})

		if (result === null)
			throw {
				status: HttpStatus.BAD_REQUEST,
				id: "api.api_key.invalid_api_key",
				messages: "API key không hợp lệ!",
			}

		return result
	}

	createApiKey = async (id, apiKeyInfo) => {
		if (apiKeyInfo.type === ApiTypes.DATA_RECEPTION) {
			const apiKeyInDb = await models.ApiKey.findOne({
				where: {
					receivedStationId: apiKeyInfo.stationId
				}
			})
			if (apiKeyInDb !== null)
				throw {
					status: HttpStatus.BAD_REQUEST,
					id: "api.api_key.existing_reception_api",
					messages: "API nhận dữ liệu của trạm đã tồn tại!",
				}
		}

		return models.ApiKey.create(
			{
				id,
				name: apiKeyInfo.name,
				description: apiKeyInfo.description,
				secret: (await generateSecret({ byteLength: 20 })).substring(0, 40),
				isReceptionApi: apiKeyInfo.type === ApiTypes.DATA_RECEPTION ? true : false,
				receivedStationId: apiKeyInfo.type === ApiTypes.DATA_RECEPTION ? apiKeyInfo.stationId : null
			}
		)
	}

	deleteApiKey = id => models.ApiKey.destroy({ where: { id: [id] } })
}

export default ApiKey
