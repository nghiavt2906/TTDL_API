import fs from "fs"
import { Router } from "express"
import Logger from "lib/logger"
import app from "app"
import config from "configs"

const router = Router()

export default expressRouter => {
  expressRouter.use("/file", router)
  router.get("/:file", function (req, res, next) {
    try {
      req.dir = `${config.publicDir}/${req.params.file}`
      // console.log(req.dir)
      if (fs.existsSync(req.dir)) {
        fs.createReadStream(req.dir).pipe(res)
      } else {
        res.end("File not found")
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/tongquan/:file", function (req, res, next) {
    try {
      req.dir = `${config.publicDir}/tongquan/${req.params.file}`
      // console.log(req.dir)
      if (fs.existsSync(req.dir)) {
        fs.createReadStream(req.dir).pipe(res)
      } else {
        res.end("File not found")
      }
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
