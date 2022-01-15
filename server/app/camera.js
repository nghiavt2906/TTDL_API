import HttpStatus from "http-status-codes"
import models from "models"
import { newId } from "models/utils"
import onvif from "lib/onvif/node-onvif"
import CameraService from "services/camera"
import { Op } from "sequelize"
import ping from "ping"

export default class Camera {
  constructor() {}

  createCamera(name, stationId, host, port, camUser, camPass) {}

  async getCurrentCameraProfileViaOnvif(host, port, camUser, camPass) {
    try {
      let device = new onvif.OnvifDevice({
        xaddr: `http://${host}:${port}/onvif/device_service`,
        user: camUser,
        pass: camPass,
      })
      await device.init()
      const profile = device.getCurrentProfile()
      return profile
    } catch (error) {
      throw error
    }
  }

  async insertCamera(name, stationId, rtspLink) {
    // const profile = await this.getCurrentCameraProfileViaOnvif(host, port, camUser, camPass)
    // const rtspLink = new URL(profile.stream.rtsp)
    // rtspLink.username = camUser
    // rtspLink.password = camPass

    const result = await models.StationCamera.create({
      id: newId(),
      stationId,
      name,
      host: "",
      port: 80,
      camUser: "",
      camPass: "",
      // rtspLink: rtspLink.toString(),
      rtspLink,
      // rtspLink: '',
      mode: "start",
      // stationId,
    })
    CameraService.addCamera(result)

    return result
  }

  async updateCamera(camId, name, stationId, rtspLink) {
    // ping to camera ???
    try {
      // const testConnection = await ping.promise.probe(host, { timeout: 5 })
      // if (!testConnection || !testConnection.alive) {
      //   throw { status: HttpStatus.BAD_REQUEST, id: "api.camera.cannot_connect_to_camera", messages: `Không thể kết nối tới camera ${host}` }
      // }
      // const profile = await this.getCurrentCameraProfileViaOnvif(host, port, camUser, camPass)
      // const rtspLink = new URL(profile.stream.rtsp)
      // rtspLink.username = camUser
      // rtspLink.password = camPass

      const result = await models.StationCamera.update(
        {
          stationId,
          name,
          rtspLink,
        },
        { where: { id: camId } }
      )

      return result
    } catch (error) {
      if (
        error.message &&
        error.message.includes("Failed to initialize the device")
      ) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.camera.authentication_camera_error",
          messages: `Kiểm tra lại thông tin camera`,
        }
      } else {
        throw error
      }
    }
  }
  async deleteCameraById(id) {
    await models.StationCamera.destroy({ where: { id } })
    CameraService.stopCamera(id)
  }

  getAllCamerasFromDatabase() {
    return models.StationCamera.findAll({
      include: [
        {
          model: models.Station,
          attributes: [["name", "stationName"]],
          required: true,
        },
      ],
    })
  }

  getAllCamerasByIds(stationIds) {
    // console.log(stationIds)
    return models.StationCamera.findAll({
      attributes: ["id", "stationId", "name", "rtspLink"],
      where: {
        stationId: {
          [Op.or]: stationIds,
        },
      },
      include: [
        {
          model: models.Station,
          attributes: [["name", "stationName"]],
          required: true,
        },
      ],
    })
  }

  getAllCamera() {
    return models.StationCamera.findAll({
      raw: true,
      where: {
        status: {
          [Op.lt] : 3
        }
      },
      attributes: [
        "id",
        "stationId",
        "name",
        "rtspLink",
        "srcCam",
        "pid",
        "status",
        [models.Sequelize.col("Station.name"), "stationName"],
      ],
      include: [{ model: models.Station, attributes: [], required: true }],
    })
  }

  getCameraById(cameraId) {
    return models.StationCamera.findOne({
      raw: true,
      where: {
        id: cameraId
      },
      attributes: [
        "id",
        "stationId",
        "name",
        "rtspLink",
        "srcCam",
        "pid",
        "status",
        [models.Sequelize.col("Station.name"), "stationName"],
      ],
      include: [{ model: models.Station, attributes: [], required: true }],
    })
  }

  getStationCamera = (stationId) => {
    return models.StationCamera.findAll({
      raw: true,
      order: [[models.Sequelize.col("Station.name"), 'ASC']],
      where: {
        stationId: stationId,
        status: {
          [Op.lt] : 3
        }
      },
      attributes: [
        "id",
        "stationId",
        "name",
        // "host",
        // "port",
        // "camUser",
        // "camPass",
        "rtspLink",
        [models.Sequelize.col("Station.name"), "stationName"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
          order: [["name", "ASC"]],
        },
      ],
    })
  }

  getStationCameraById = (id) => {
    return models.StationCamera.findAll({
      raw: true,
      where: {
        id: id,
        status: {
          [Op.lt] : 3
        }
      },
      attributes: [
        "id",
        "stationId",
        "name",
        // "host",
        // "port",
        // "camUser",
        // "camPass",
        "rtspLink",
        [models.Sequelize.col("Station.name"), "stationName"],
      ],
      include: [
        {
          model: models.Station,
          attributes: [],
          order: [["name", "ASC"]],
        },
      ],
    })
  }

  updateStationCamera = (id, data) => {
    return models.StationCamera.update(data, { where: { id: id } })
  }

  createStationCamera = (data) => {
    return models.StationCamera.create({
      id: newId(),
      ...data,
      status: 1
    })
  }

  deleteStationCamera = (id) => {
    return models.StationCamera.update({ status: 3 }, { where: { id } })
    // return models.StationCamera.destroy({
    //   where: {
    //     id: id
    //   }
    // })
  }

  getStreamCamera = (stationId) => {
    return models.StationCamera.findAll({
      raw: true,
      where: {
        stationId: stationId,
        status: {
          [Op.lt] : 3
        }
      },
      attributes: ["id", "name", "rtspLink", "srcCam", "pid", "status"],
    })
  }

  getStreamOneCamera = (camId) => {
    return models.StationCamera.findAll({
      raw: true,
      where: {
        id: camId,
        status: {
          [Op.lt] : 3
        }
      },
      attributes: ["id", "name", "rtspLink", "srcCam", "pid", "status"],
    })
  }
}
