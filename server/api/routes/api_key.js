import { Router } from "express"
import bodyParser from "body-parser"

import app from "app"
import { newId } from "models/utils"
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
			await app.ApiKey.createApiKey(id, req.body)

			if (req.body.type === ApiTypes.DATA_SHARING) {
				const sharedStationArray = func.renderSharedStationData(id, req.body.stationIds)
				await app.ApiSharedStation.createSharedStations(sharedStationArray)
			}

			res.send(id)
		} catch (error) {
			console.log(error)
			next(error)
		}
	})

	router.post('/taomoiapikey/:managerId', async (req, res, next) => {

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
				const deletedNumber = await app.ApiSharedStation.deleteSharedStations(apiSharedStationIds)
				if (deletedNumber === 0) return res.sendStatus(404)
			}

			const deletedNumber = await app.ApiKey.deleteApiKey(apiKeyId)
			if (deletedNumber === 0) return res.sendStatus(404)

			res.sendStatus(200)
		} catch (error) {
			console.log(error)
			next(error)
		}
	})
}