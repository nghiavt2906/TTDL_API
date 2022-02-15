import { Router } from "express"
import bodyParser from "body-parser"

import { reformatStationInfo, getStationId, reformatLatestData } from 'app/utils'

import ApiTypes from 'constant/api_type'

import app from "app"

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default expressRouter => {
	expressRouter.use("/chiasedulieu", router)

	router.get("/dulieumoinhat", async (req, res, next) => {
		const { apiKey } = req.query

		try {
			const apiKeyInDb = await app.ApiKey.validateApiSecretKey(apiKey, ApiTypes.DATA_SHARING)
			const stations = await app.ApiSharedStation.getStationIdsByApiId(apiKeyInDb.dataValues.id)

			let data = await app.Station.getLatestStationData(stations.map(station => station.dataValues.stationId))
			data = reformatLatestData(data)
			res.json(data)
		} catch (error) {
			console.log(error)
			next(error)
		}
	})
}