import { Router } from "express"
import HttpStatus from "http-status-codes"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import app from "app"
import {reformatManagerInfo} from "app/utils"
import _ from "lodash"
import queryString from 'querystring'
import http from 'http'

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

export default expressRouter => {
  expressRouter.use("/quanlycamera", router)

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
      let result = await app.StationCamera.getStationCamera(arrayStationId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/:id/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId, id} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      await app.StationCamera.updateStationCamera(id, req.body)
      const result = await app.StationCamera.getStationCameraById(id)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      let newData = await app.StationCamera.createStationCamera(req.body)
      const result = await app.StationCamera.getStationCameraById(newData.id)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:id/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId,id } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      await app.StationCamera.deleteCameraById(id)
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

  router.get("/getSample/:managerId", async (req, res, next) => {
    try {
      // const {managerId} = req.params
      // await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      const data = queryString.stringify({
        username: 'vip',
        password: `i don't tell`
      })

      const options = {
        host: 'xlntkcnhoakhanhmorong.envitech.com.vn',
        port: 3100,
        path: '/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
        }
      }

      const optionsGetSample = {
        host: 'xlntkcnhoakhanhmorong.envitech.com.vn',
        port: 3100,
        path: '/vipgetsample',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
        }
      }

      let request = http.request(options, function (response) {
        let responseString = "";
      
        response.on("data", function (data) {
          responseString += data;
          // save all the data from response
        });
        response.on("end", function () {
          // console.log(responseString); 
          // print to console when response ends
          // res.send('ok')

          let request1 = http.request(optionsGetSample, async (response1) => {
            let responseString1 = "";
            await sleep(1000)
            response1.on("data", function (data) {
              responseString1 += data;
              // save all the data from response
            });

            response1.on("end", function () {
              // console.log(responseString1); 
              res.send('ok')
            })
          })
          request1.write(data)
          request1.end()
        });
      })
      request.write(data)
      request.end()

    } catch (error) {
      next(error)
      console.log(error)
    }
  })

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}