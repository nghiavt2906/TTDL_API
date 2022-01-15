import dotenv from "dotenv"
import Joi from "@hapi/joi"
import Logger from "lib/logger"

dotenv.config()

const envVarsSchema = Joi.object({
  // Node environment
  NODE_ENV: Joi.string().required(),

  USE_DEV_SERVER: Joi.bool().required(),
  
  API_PREFIX: Joi.string().required(),

  // Production server
  PORT: Joi.number().required(),
  WEB_HOST: Joi.string().required(),

  DB_CONNECTION: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),

  DB_HOST_SLAVE: Joi.string(),
  DB_PORT_SLAVE: Joi.number(),
  DB_USERNAME_SLAVE: Joi.string(),
  DB_PASSWORD_SLAVE: Joi.string(),
  DB_DATABASE_SLAVE: Joi.string(),

  CAMERA_SERVER_HOST : Joi.string().required(),
  CAMERA_SERVER_PORT : Joi.number().required(),

  FTP_SERVER_HOST : Joi.string().required(),
  FTP_SERVER_PORT : Joi.number().required(),

  FILE_SERVER_HOST: Joi.string().required(),
  FILE_SERVER_PORT: Joi.number().required(),
  FILE_SERVER_USERNAME: Joi.string().required(),
  FILE_SERVER_PASSWORD: Joi.string().required(),

  // Dev server
  DEV_PORT: Joi.number().required(),
  DEV_WEB_HOST: Joi.string().required(),

  DEV_DB_CONNECTION: Joi.string().required(),
  DEV_DB_HOST: Joi.string().required(),
  DEV_DB_PORT: Joi.number().required(),
  DEV_DB_USERNAME: Joi.string().required(),
  DEV_DB_PASSWORD: Joi.string().required(),
  DEV_DB_DATABASE: Joi.string().required(),

  DEV_DB_HOST_SLAVE: Joi.string(),
  DEV_DB_PORT_SLAVE: Joi.number(),
  DEV_DB_USERNAME_SLAVE: Joi.string(),
  DEV_DB_PASSWORD_SLAVE: Joi.string(),
  DEV_DB_DATABASE_SLAVE: Joi.string(),

  DEV_CAMERA_SERVER_HOST : Joi.string().required(),
  DEV_CAMERA_SERVER_PORT : Joi.number().required(),

  DEV_FTP_SERVER_HOST : Joi.string().required(),
  DEV_FTP_SERVER_PORT : Joi.number().required(),

  DEV_FILE_SERVER_HOST: Joi.string().required(),
  DEV_FILE_SERVER_PORT: Joi.number().required(),
  DEV_FILE_SERVER_USERNAME: Joi.string().required(),
  DEV_FILE_SERVER_PASSWORD: Joi.string().required(),

  STREAM_FOLDER: Joi.string().required(),
  PUBLIC_FOLDER: Joi.string().required()
})
  .unknown()
  .required()

const { error, value } = envVarsSchema.validate(process.env)

if (error) {
  console.log(`Config validation error: ${error.message}`)
}

const isDevEnv = value.USE_DEV_SERVER

Logger.info(value.NODE_ENV === 'development' ? '=*= Server running in Development Environment =*=' : '=*= Server running is Production Environment =*=')

const config = {
  nodeEnv: value.NODE_ENV,
  isDevServer : value.USE_DEV_SERVER,

  api: {
    prefix: value.API_PREFIX
  },

  server: {
    host: isDevEnv ? value.DEV_WEB_HOST: value.WEB_HOST,
    port: isDevEnv ? value.DEV_PORT : value.PORT
  },

  db: {
    connection: isDevEnv ? value.DEV_DB_CONNECTION : value.DB_CONNECTION,
    host: isDevEnv ? value.DEV_DB_HOST : value.DB_HOST,
    port: isDevEnv ? value.DEV_DB_PORT: value.DB_PORT,
    username: isDevEnv ? value.DEV_DB_USERNAME : value.DB_USERNAME,
    password: isDevEnv ? value.DEV_DB_PASSWORD : value.DB_PASSWORD,
    database: isDevEnv ? value.DEV_DB_DATABASE : value.DB_DATABASE
  },

  dbSlave : {
    connection: isDevEnv ? value.DEV_DB_CONNECTION : value.DB_CONNECTION,
    host: isDevEnv ? value.DEV_DB_HOST_SLAVE : value.DB_HOST_SLAVE,
    port: isDevEnv ? value.DEV_DB_PORT_SLAVE : value.DB_PORT_SLAVE,
    username: isDevEnv ? value.DEV_DB_USERNAME_SLAVE : value.DB_USERNAME_SLAVE,
    password: isDevEnv ? value.DEV_DB_PASSWORD_SLAVE : value.DB_PASSWORD_SLAVE,
    database: isDevEnv ? value.DEV_DB_DATABASE_SLAVE : value.DB_DATABASE_SLAVE
  },

  cameraServer: {
    host: isDevEnv ? value.DEV_CAMERA_SERVER_HOST : value.CAMERA_SERVER_HOST,
    port: isDevEnv ? value.DEV_CAMERA_SERVER_PORT : value.CAMERA_SERVER_PORT
  },

  ftpServer: {
    host: isDevEnv ? value.DEV_FTP_SERVER_HOST : value.FTP_SERVER_HOST,
    port: isDevEnv ? value.DEV_FTP_SERVER_PORT : value.FTP_SERVER_PORT
  },

  fileServer: {
    host: isDevEnv ? value.DEV_FILE_SERVER_HOST : value.FILE_SERVER_HOST,
    username: isDevEnv ? value.DEV_FILE_SERVER_USERNAME : value.FILE_SERVER_USERNAME,
    password: isDevEnv ? value.DEV_FILE_SERVER_PASSWORD : value.FILE_SERVER_PASSWORD,
    port: isDevEnv ? value.DEV_FILE_SERVER_PORT : value.FILE_SERVER_PORT
  },
  
  // streamDir: process.cwd() + '\\' + value.STREAM_FOLDER,
  streamDir: value.STREAM_FOLDER,
  publicDir: process.cwd() + '/' + value.PUBLIC_FOLDER
}

export default config
