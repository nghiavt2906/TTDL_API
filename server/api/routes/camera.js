import fs from "fs"
import { Router } from "express"
import { isIP, isNumeric, isEmpty } from "validator"
import _ from "lodash"
import models from "models"
import { newId } from "models/utils"
import * as func from "utils/functions"
import HttpStatus from "http-status-codes"
import app from "app"
import { getIdDataByField } from "utils/functions"
import Logger from "lib/logger"
import http from 'http'
import config from 'configs'
import CameraService from 'services/camera'
import WS from "services/websocket"

const router = Router()

export default expressRouter => {
  expressRouter.use("/cameras", router)

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
      let result = await app.Camera.getStationCamera(arrayStationId)
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
      await checkSocketConnectionToCameraServer()
      const { name, stationId, rtspLink } = req.body
      validateCameraData(name, stationId, rtspLink)
      await app.Camera.updateStationCamera(id, {name, stationId, rtspLink, status: 2})
      
      WS.emitUpdateCamera(id)

      const result = await app.Camera.getStationCameraById(id)
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
      await checkSocketConnectionToCameraServer()

      const { name, stationId, rtspLink } = req.body
      validateCameraData(name, stationId, rtspLink)
      const data = await app.Camera.createStationCamera({name, stationId, rtspLink})
      WS.emitCreateCamera(data.id)

      const result = await app.Camera.getStationCameraById(data.id)
      res.json(result)
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
      await checkSocketConnectionToCameraServer()

      await app.Camera.deleteStationCamera(id)

      WS.emitDeleteCamera(id)

      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/reloadCamera/:id/:managerId", async (req, res, next) => {
    try {
      const {managerId,id } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')
      await checkSocketConnectionToCameraServer()
      WS.emitUpdateCamera(id)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStream/:stationId/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId,stationId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      const result = await app.Camera.getStreamCamera(stationId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getStreamOneCamera/:camId/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId,camId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      const result = await app.Camera.getStreamOneCamera(camId)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/sync/create/:camId", async (req, res, next) => {
    try {
      const {camId } = req.params

      const result = await app.Camera.getCameraById(camId)
      console.log(result)
      CameraService.loadCamera(result)
      res.send('OK')
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/sync/update/:camId", async (req, res, next) => {
    try {
      const {camId } = req.params

      const result = await app.Camera.getCameraById(camId)
      console.log(result)
      await CameraService.updateCamera(result)
      res.send('OK')
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/sync/delete/:camId", async (req, res, next) => {
    try {
      const {camId} = req.params

      const result = await app.Camera.getCameraById(camId)
      console.log(result)
      await CameraService.deleteCamera(result)
      res.send('OK')
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/reloadCamera/:id/:managerId", async (req, res, next) => {
    try {
      // const {manager, stations} = req.body
      // console.log(req.body)
      const {managerId, id} = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')
      await checkSocketConnectionToCameraServer()

      // await app.Camera.updateCamera(id, name, stationId, rtspLink)
      await app.Camera.updateStationCamera(id, {name, stationId, rtspLink, status: 2})
      let responseString = ''
  
      const options = {
        host: config.cameraServer.host,
        port: config.cameraServer.port,
        path: `/api/cameras/sync/update/${id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
      const request = http.request(options, function (response) {
        response.setEncoding("utf8")
        response.on("data", function (chunk) {
          responseString += chunk
        })
        response.on("end", async function () {
          // const responseBody = JSON.parse(responseString)
          // console.log(responseString)
        })
      })
      request.write(responseString)
      request.end()

      const result = await app.Camera.getStationCameraById(id)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}


function validateCameraData(name, stationId, rtspLink) {
  if (isEmpty(name)){
    throw { status: HttpStatus.BAD_REQUEST, id: "api.camera", messages: "Tên Camera là trường bắt buộc. Vui lòng kiểm tra lại!" }
  }
  if (isEmpty(rtspLink)) {
    throw { status: HttpStatus.BAD_REQUEST, id: "api.camera", messages: "RTSP Link là trường bắt buộc. Vui lòng kiểm tra lại!" }
  }
  if (!rtspLink.includes('rtsp://')) {
    throw { status: HttpStatus.BAD_REQUEST, id: "api.camera", messages: "RTSP Link không đúng. Vui lòng kiểm tra lại!" }
  } 
}

async function checkSocketConnectionToCameraServer() {
  const result = await models.ManagerSocket.findAll({where: {managerId: 'CAMERA_SOCKET_CLIENT'}})
  if(result.length === 0){
    throw { status: HttpStatus.BAD_REQUEST, id: "api.camera", messages: "Không thể kết nối đến hệ thống Camera. Hãy kiểm tra lại!" }
  }
}
