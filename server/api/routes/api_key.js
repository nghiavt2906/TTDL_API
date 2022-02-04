import { Router } from "express"
import bodyParser from "body-parser"

import app from "app"
import { newId, generateSecret } from "models/utils"
import * as func from "utils/functions"

import ApiTypes from 'constant/api_type'

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
	expressRouter.use("/quanlyapi", router)

	router.get("/:managerId", async (req, res, next) => {
		const { apiType } = req.query
		const { managerId } = req.params

		try {
			await app.Manager.checkManagerPermission(managerId, 'insert_station')
		} catch (error) {
			console.log(error)
			next(error)
		}

		const apiKeyData = await app.ApiKey.getAllApiKeysByType(apiType)

		res.json(apiKeyData)
	})

	router.post("/:managerId", async (req, res, next) => {
		try {
			const { managerId } = req.params
			await app.Manager.checkManagerPermission(managerId, 'insert_station')

			const id = newId()
			const result = await app.ApiKey.createApiKey(id, req.body)

			if (req.body.type === ApiTypes.DATA_SHARING) {
				const sharedStationArray = func.renderSharedStationData(id, req.body.stationIds)
				await app.ApiSharedStation.createSharedStations(sharedStationArray)
			}

			const data = { id, secret: result.dataValues.secret }
			res.json(data)
		} catch (error) {
			console.log(error)
			next(error)
		}
	})

	router.get('/taomoiapikey/:managerId', async (req, res, next) => {
		const secret = (await generateSecret({ byteLength: 20 })).substring(0, 40)
		res.send(secret)
	})

	router.put('/:managerId', async (req, res, next) => {
		try {
			const { managerId } = req.params
			await app.Manager.checkManagerPermission(managerId, 'insert_station')
			const { apiKeyId, apiKeyInfo } = req.body
			await app.ApiKey.updateApiKey(apiKeyId, apiKeyInfo)

			if (apiKeyInfo.type === ApiTypes.DATA_SHARING) {
				// delete old shared-api stations
				const results = await app.ApiSharedStation.getApiSharedStationIdsByApiId(apiKeyId)
				const apiSharedStationIds = results.map(r => r.dataValues.id)
				await app.ApiSharedStation.deleteSharedStations(apiSharedStationIds)

				// put new shared-api stations
				const sharedStationArray = func.renderSharedStationData(apiKeyId, apiKeyInfo.stationIds)
				await app.ApiSharedStation.createSharedStations(sharedStationArray)
			}

			res.sendStatus('200')
		} catch (error) {
			console.log(error)
			next(error)
		}
	})

	router.delete('/:managerId/:apiKeyId', async (req, res, next) => {
		const { managerId, apiKeyId } = req.params

		try {
			await app.Manager.checkManagerPermission(managerId, 'insert_station')

			const apiKeyInDb = await app.ApiKey.getApiKeyById(apiKeyId)

			if (apiKeyInDb === null) return res.sendStatus(404)

			if (!apiKeyInDb.dataValues.isReceptionApi) {
				const results = await app.ApiSharedStation.getApiSharedStationIdsByApiId(apiKeyId)
				const apiSharedStationIds = results.map(r => r.dataValues.id)
				await app.ApiSharedStation.deleteSharedStations(apiSharedStationIds)
			}

			await app.ApiKey.deleteApiKey(apiKeyId)

			res.sendStatus(200)
		} catch (error) {
			console.log(error)
			next(error)
		}
	})
}