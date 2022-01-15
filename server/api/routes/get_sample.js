import { Router } from "express"
const router = Router()
import bodyParser from "body-parser"
import app from "app"
import http from "http"
import queryString from "querystring"

// import {getFilterStationMobile, getFilterStationByTypeMobile, getFilterStationByGroupMobile} from 'api/routes/utils'

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

export default (expressRouter) => {
  expressRouter.use("/laymautudong1", router)

  router.post("/getSample/:stationId", async (req, res, next) => {
    try {
      // const {managerId} = req.params
      // await app.Manager.checkManagerPermission(managerId, 'insert_user_group')

      const stationSample = await app.Station.getStationSampleInfo(stationId)

      let responseString = ''
      const data = queryString.stringify({
        username: stationSample.username,
        password: stationSample.password,
      })

      const options = {
        host: stationSample.host,
        port: stationSample.port,
        path: "/getSample",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(data),
        },
      }

      const request = http.request(options, function (response) {
        response.setEncoding("utf8")
        response.on("data", function (chunk) {
          // console.log("body: " + chunk)
          responseString += chunk
        })
        response.on("end", function () {
          // console.log(responseString)
          res.send('OK')
        })
      })
      request.write(data)
      request.end()
    } catch (error) {
      console.log(error)
      next(error)
    }
  })
}
