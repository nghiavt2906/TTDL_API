import Platform from "./platform"
import schedule from "node-schedule"
// import {handleFtpServer} from 'utils/ftp_final'
import { testFTP } from "utils/ftp_v2"
import models from "models"
import app from "app"
import CameraService from "services/camera"
import BackgroundJobs from "background_jobs"
import configs from 'configs'

// models.sequelize
//   .sync({ force: true })
//   .then(() => console.log(`--------- sync models to database ok --------`))
//   .catch(err => console.log(err))

const platform = new Platform()

platform.init()

if (configs.nodeEnv === 'production') {
  const backgroundJobs = new BackgroundJobs()
  // backgroundJobs.checkSocketConnectionToCameraServer()
  backgroundJobs.checkSocketConnectionToFtpServer()
  backgroundJobs.cleanUpNotifications()
}
