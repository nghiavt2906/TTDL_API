import { Router } from "express"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import moment from 'moment'
import _ from "lodash"
import queryString from 'querystring'
import http from 'http'
import { newId } from "models/utils"
import HttpStatus from "http-status-codes"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/laymautudong", router)

  router.get("/all/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      let arrayStationId = []
      let stationId = await app.ManagerStation.getStationIdByManagerId(managerId)
      if(stationId.length){
        arrayStationId = stationId.map(station => {
          return station.stationId
        })
      }
      let result = await app.StationSample.getStationSample(arrayStationId)
      result = reformatSampleInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:id/:managerId", async (req, res, next) => {
    try {
      const {managerId, id} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      await app.StationSample.updateStationSample(id, req.body)
      let result = await app.StationSample.getStationSampleById(id)
      result = reformatSampleInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/createSample/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      let newData = await app.StationSample.createStationSample(req.body)
      let result = await app.StationSample.getStationSampleById(newData.id)
      result = reformatSampleInfo(result)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:id/:managerId", async (req, res, next) => {
    try {
      const {managerId,id } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      await app.StationSample.deleteStationSample(id)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })


  router.get("/getSelect/:managerId", async (req, res, next) => {
    try {
      const {managerId} = req.params
      const characters = await app.Character.getSelectCharacters()
      const stations = await app.ManagerStation.getListStationByManagerId(managerId, {})
      res.send({
        characters, stations
      })
    } catch (error) {
      next(error)
      console.log(error)
    }
  })

  router.post("/result", async (req, res, next) => {
    try {
      let {username, password, id, finishAt, bottle} = req.body
      finishAt = moment(finishAt).utc(7).format()
      validateSampleResult(id, finishAt, bottle)
      await app.SampleHistory.updateHistory(id, finishAt, bottle)
      res.send({data: "SUCCESS"})
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/history/:stationId/:managerId", async (req, res, next) => {
    try {
      const {stationId, managerId} = req.params
      const result = await app.SampleHistory.getSampleHistoryBySampleId(stationId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/getSample/:stationId/:managerId", async (req, res, next) => {
    try {
      const {stationId, managerId} = req.params
      // await app.Manager.checkManagerPermission(managerId, 'insert_user_group')

      const stationSample = await app.StationSample.getStationSample([stationId])
      if(stationSample.length === 0) {
        res.sendStatus(400)
        return
      }
      const sampleInfo = stationSample[0]
      let result = await app.ServiceCall.callGetSampleService(sampleInfo, stationId, managerId)
      if(result === true){
        res.sendStatus(200)
      } else {
        res.sendStatus(400)
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

}

const reformatSampleInfo = (data) => {
  const newData = data.map(item => {
    let newItem = item.dataValues
    if(newItem.Station.SampleHistories.length > 0){
      newItem.latestSampleAt = item.Station.SampleHistories[0].finishAt
      newItem.bottle = item.Station.SampleHistories[0].bottle
      delete newItem.Station
    } else {
      newItem.latestSampleAt = null
      newItem.bottle = null
      delete newItem.Station
    }
    return newItem
  })
  return newData
}

const validateSampleResult = (id, finishAt, bottle) => {
  console.log(typeof bottle)
  if(finishAt === "Invalid date") {
    throw { status: HttpStatus.BAD_REQUEST, id: "sample.invalid", messages: "finishAt không đúng!" }
  }
  if(isNaN(bottle)) {
    throw { status: HttpStatus.BAD_REQUEST, id: "sample.invalid", messages: "bottle không đúng!" }
  }
}