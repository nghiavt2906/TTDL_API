import http from 'http'
import express from "express"
import path from 'path'
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import cors from "cors"

// load config
import config from "configs"
import routes from "api"

import Logger from "lib/logger"
import timeout from 'connect-timeout'

class HTTPService {
  constructor() {
    this.httpServer = null
  }

  initialize() {
    const app = express()
    app.use(express.static(path.join(__dirname, '../../../static')))
    app.use(cors())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.json())
    // app.use(bodyParser.json())
    app.use(cookieParser())
    app.use(morgan("dev"))
    // app.use(timeout(120000));
    // app.use(haltOnTimedout);

    app.use(config.api.prefix, routes())

    app.use(`${config.api.prefix}/*`, (req, res, next) => {
      next({ status: 404, id: 'api.route_not_found', messages: 'Route not found' })
    })

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../../../static/index.html'))
    })

    app.use((err, req, res, next) => {
      if (err) {
        res.status(err.status || 500)
        res.json({
          id: err.id || "system errors",
          messages: err.messages || "Lỗi hệ thống"
        })
        Logger.error(err)
      }
      next()
    })
    this.httpServer = http.createServer(app)
    this.httpServer.listen(config.server.port, err => {
      if (err) {
        Logger.error(`Start HTTP Sever error: ${err}`)
        return
      }
      Logger.info(`Server is running at port ${config.server.port}`)
    })
  }
}

export default new HTTPService()