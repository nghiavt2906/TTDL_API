import { Router } from "express"
import bodyParser from "body-parser"

import app from "app"

const router = Router()

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
	expressRouter.use("/quanlyapi", router)

	router.get("/", async (req, res, next) => {

	})
}