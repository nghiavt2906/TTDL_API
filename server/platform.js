import Logger from "lib/logger"
import HTTPService from "services/http"
import CameraService from "services/camera"
import WS from "services/websocket"

export default class Platform {
  constructor() {
    this.HTTPService = HTTPService
    // this.CameraService =CameraService
    this.WS = WS
  }

  init() {
    this.manageProcess()
    this.HTTPService.initialize()
    // this.CameraService.initialize()
    this.WS.initialize(this.HTTPService.httpServer)
  }

  manageProcess() {
    process.on("uncaughtException", (err) => {
      console.log(err)
      Logger.error("Uncaught Exception occured!")
    })

    // [CTRL] + [C] = exit
    process.on("SIGINT", () => {
      Logger.info("Platform is exiting...")
      process.exit()
    })
  }

  shutdown() {
    process.exit(1)
  }
}
