import { Router } from "express"

const router = Router()

export default expressRouter => {
  expressRouter.use("/checkService", router)

  router.get("/ftp", async (req, res, next) => {
    try {
      res.send('OK')
    } catch (error) {
      next(error)
    }
  })

  router.get("/camera", async (req, res, next) => {
    try {
      res.send('OK')
    } catch (error) {
      next(error)
    }
  })
}

