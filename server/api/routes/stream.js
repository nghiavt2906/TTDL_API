import fs from "fs"
import { Router } from "express"
import Logger from "lib/logger"
import app from "app"
import config from "configs"
import CameraService from 'services/camera'


const router = Router()

export default expressRouter => {
  expressRouter.use("/stream", router)
  router.get("/:camId/:file", async function(req, res, next) {
    try {
      const {camId, file} = req.params 
      req.dir = `${config.streamDir}/${camId}/${file}`
      if (fs.existsSync(req.dir)) {
        fs.createReadStream(req.dir).pipe(res)
      } else {
        const result = await app.Camera.getCameraById(camId)
        await CameraService.recreateStream(result)
        
        res.end("File not found")
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}

// api/v1/station/:stationId/stream

// api/v1/stream/1/s.m3u8
// api/v1/stream/2/s.m3u8
