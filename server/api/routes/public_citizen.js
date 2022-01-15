import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import _ from 'lodash'

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/citizen_station", router)
  
  router.get("/getListStation/:citizenId/:typeId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, typeId} = req.params
      // console.log(token, citizenId)

      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      let result = await app.CitizenStation.getCitizenStation(citizenId, typeId)
      res.json({ data: result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/updateStation/:citizenId/:typeId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, typeId} = req.params
      const {stationData} = req.body
      // console.log(stationData[0].stationId)
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      // if(!stationData.length){
      //   res.status(200)
      // }

      let result = await app.CitizenStation.updateCitizenStation(citizenId, typeId, stationData)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getUnfollowStation/:citizenId/:typeId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, typeId} = req.params
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      let result = await app.Station.getUnfollowStation(citizenId, typeId)
      res.json({ data: result })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/deleteStation/:citizenId/:stationId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, stationId} = req.params 
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      await app.CitizenStation.deleteStation(citizenId, stationId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/updateNotification/:citizenId/:stationId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, stationId} = req.params 
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      await app.CitizenStation.updateNotification(citizenId, stationId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/addStation/:citizenId/:stationId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId, stationId} = req.params 
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      let result = await app.CitizenStation.addStation(citizenId, stationId)
      res.json({data : result})
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/updateOrderStation/:citizenId", async (req, res, next) => {
    try {
      const {token} = req.headers
      const {citizenId} = req.params 
      const {arrayStationId} = req.body
      // console.log(req.body)
      await app.CitizenAccessToken.checkAccessToken(citizenId, token)
      await app.CitizenStation.updateOrderStation(citizenId, arrayStationId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
