// @ts-check
import Logger from "../lib/logger"
import cls from "continuation-local-storage"
import config from "../configs"
import { Sequelize } from "sequelize"

import MonitoringType from "./monitoring_type"
import MonitoringGroup from "./monitoring_group"
import Districts from "./districts"
import Indicator from "./indicator"
import IndicatorThreshold from "./indicator_threshold"
import MonitoringDataInfo from "./monitoring_data_info"
import MonitoringData from "./monitoring_data"
import Role from "./role"
import Notification from "./notification"
import Firmware from "./firmware"
import System from "./system"
import Permission from "./permission"
import RolePermission from "./role_permission"
import SampleHistory from "./sample_history"
import Station from "./station"
import StationCamera from "./station_camera"
import StationFtp from "./station_ftp"
import StationGroup from "./station_group"
import StationIndicators from "./station_indicators"
import User from "./user"
import UserPermission from "./user_permission"
import UserRole from "./user_role"
import UserStation from "./user_station"
import UserManagement from "./user_management"
import UserNotification from "./user_notification"
import UserAccessToken from "./user_access_token"
import AlertHistory from "./alert_history"
import Citizen from "./citizens"
import CitizenStation from "./citizen_stations"
import CitizenAccessToken from "./citizen_access_token"
import CitizenNotification from "./citizen_notification"
import News from "./news"
import FirebaseToken from "./firebase_token"
import Character from "./character"
import CharacterPermission from "./character_permission"
import Manager from "./manager"
import ManagerAccessToken from "./manager_access_token"
import ManagerStation from "./manager_station"
import CitizenPasswordRecovery from "./citizen_password_recovery"
import CitizenSocialLogin from "./citizen_social_login"
import StationAutoParameter from "./station_auto_parameter"
import ActivityLog from "./activity_logs"
import StationSample from "./station_sample"
import ManagerNotificationSettings from "./manager_notification_settings"
import ManagerNotifications from "./manager_notifications"
import Notifications from "./notifications"
import ManagerSocket from "./manager_sockets"
import ApiKey from "./api_key"
import ApiSharedStation from "./api_shared_station"
import LatestData from "./latest_data"
// import Route from "./routes"
// import MainRoute from "./main_routes"
// import CharacterRoute from "./character_route"

const namespace = cls.createNamespace("centic")
Sequelize.useCLS(namespace)

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.password,
  {
    host: config.db.host,
    dialect: config.db.connection,
    logging: false,
    dialectOptions: {
      connectTimeout: 60000,
      options: {
        requestTimeout: 2000000,
        trustedconnection: false,
        encrypt: false,
        trustServerCertificate: false,
        enableArithAbort: false,
      },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 90000,
      idle: 10000,
    },
    // timezone: "+07:00",
  }
)

// const sequelize = new Sequelize(
//   config.db.database,
//   null,
//   null,
//   {
//     // host: config.db.host,
//     dialect: config.db.connection,
//     // logging: false,
//     dialectOptions: {
//       connectTimeout: 60000
//     },
//     replication: {
//       read: [{
//         host: config.dbSlave.host,
//         username: config.dbSlave.username,
//         password: config.dbSlave.password,
//         port: config.dbSlave.port
//       }],
//       write: {
//         host: config.db.host,
//         username: config.db.username,
//         password: config.db.password,
//         port: config.db.port
//       }
//     },
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 90000,
//       idle: 10000,
//     },
//     // timezone: "+07:00",
//   }
// );

sequelize
  .authenticate()
  .then(() => {
    Logger.info("Connect to database ok !")
  })
  .catch((err) => {
    console.log(err)
  })

const models = {
  sequelize,
  Sequelize,
  MonitoringType: sequelize.import("MonitoringType", MonitoringType),
  MonitoringGroup: sequelize.import("MonitoringGroup", MonitoringGroup),
  District: sequelize.import("Districts", Districts),
  Indicator: sequelize.import("Indicator", Indicator),
  IndicatorThreshold: sequelize.import(
    "IndicatorThreshold",
    IndicatorThreshold
  ),
  MonitoringDataInfo: sequelize.import(
    "MonitoringDataInfo",
    MonitoringDataInfo
  ),
  MonitoringData: sequelize.import("MonitoringData", MonitoringData),
  Role: sequelize.import("Role", Role),
  // Token: sequelize.import("./token"),
  Notification: sequelize.import("Notification", Notification),
  Firmware: sequelize.import("Firmware", Firmware),
  System: sequelize.import("System", System),
  Permission: sequelize.import("Permission", Permission),
  RolePermission: sequelize.import("RolePermission", RolePermission),
  SampleHistory: sequelize.import("SampleHistory", SampleHistory),
  Station: sequelize.import("Station", Station),
  StationCamera: sequelize.import("StationCamera", StationCamera),
  StationSample: sequelize.import("StationSample", StationSample),
  StationFtp: sequelize.import("StationFtp", StationFtp),
  StationGroup: sequelize.import("StationGroup", StationGroup),
  StationIndicators: sequelize.import("StationIndicators", StationIndicators),
  User: sequelize.import("User", User),
  UserPermission: sequelize.import("UserPermission", UserPermission),
  UserRole: sequelize.import("UserRole", UserRole),
  UserStation: sequelize.import("UserStation", UserStation),
  UserManagement: sequelize.import("UserManagement", UserManagement),
  UserNotification: sequelize.import("UserNotification", UserNotification),
  UserAccessToken: sequelize.import("UserAccessToken", UserAccessToken),
  AlertHistory: sequelize.import("AlertHistory", AlertHistory),
  Citizen: sequelize.import("Citizen", Citizen),
  CitizenStation: sequelize.import("CitizenStation", CitizenStation),
  CitizenAccessToken: sequelize.import(
    "CitizenAccessToken",
    CitizenAccessToken
  ),
  CitizenNotification: sequelize.import(
    "CitizenNotification",
    CitizenNotification
  ),
  News: sequelize.import("News", News),
  FirebaseToken: sequelize.import("FirebaseToken", FirebaseToken),
  Character: sequelize.import("Character", Character),
  CharacterPermission: sequelize.import(
    "CharacterPermission",
    CharacterPermission
  ),
  Manager: sequelize.import("Manager", Manager),
  ManagerAccessToken: sequelize.import(
    "ManagerAccessToken",
    ManagerAccessToken
  ),
  ManagerStation: sequelize.import("ManagerStation", ManagerStation),
  CitizenPasswordRecovery: sequelize.import(
    "CitizenPasswordRecovery",
    CitizenPasswordRecovery
  ),
  StationAutoParameter: sequelize.import(
    "StationAutoParameter",
    StationAutoParameter
  ),
  CitizenSocialLogin: sequelize.import(
    "CitizenSocialLogin",
    CitizenSocialLogin
  ),
  ActivityLog: sequelize.import("ActivityLog", ActivityLog),
  ManagerNotificationSettings: sequelize.import(
    "ManagerNotificationSettings",
    ManagerNotificationSettings
  ),
  ManagerNotifications: sequelize.import(
    "ManagerNotifications",
    ManagerNotifications
  ),
  Notifications: sequelize.import("Notifications", Notifications),
  ManagerSocket: sequelize.import("ManagerSocket", ManagerSocket),
  ApiKey: sequelize.import("ApiKey", ApiKey),
  ApiSharedStation: sequelize.import("ApiSharedStation", ApiSharedStation),
  LatestData: sequelize.import("LatestData", LatestData),
  // Route: sequelize.import("Route", Route),
  // MainRoute: sequelize.import("MainRoute", MainRoute),
  // CharacterRoute: sequelize.import("CharacterRoute", CharacterRoute),
}

// Object.values(models)
//   .filter(model => typeof model.associate === "function")
//   .forEach(model => {
//     // console.log(model)
//     return model.associate(models)
//   })

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models)
  }
})

export default models
