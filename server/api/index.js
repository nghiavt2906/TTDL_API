import { Router } from "express"
import users from "./routes/users"
import auth from "./routes/auth"
import indicator from "./routes/indicators"
import station_info from "./routes/station_info"
import monitoring_group from "./routes/monitoring_group"
import indicator_threshold from "./routes/indicator_threshold"
import system from "./routes/system"
import data_reception from "./routes/data_reception"
import latest_data from "./routes/latest_data"
import station_map from "./routes/station_map"
import station_config from "./routes/station_config"
import camera from "./routes/camera"
import stream from "./routes/stream"
import station_tracking from "./routes/station_tracking"
import table_data from "./routes/table_data"
import chart_data from "./routes/chart_data"
import notification from "./routes/notification"
import file from './routes/file'
import role from './routes/role'
import environment_index from './routes/environtment_index'
import envIndex_ranking from './routes/envIndex_ranking'
import public_station_map from './routes/public_station_map'
import filter from './routes/filter'
import public_citizen from './routes/public_citizen'
import public_auth from './routes/public_auth'
import news from './routes/news'
import public_station_data from './routes/public_station_data'
import manual_data from './routes/manual_data'
import character from './routes/character'
import manager from './routes/manager'
import report from './routes/report'
import data from './routes/data'
import approvedData from './routes/approved_latest_data'
import stationSample from './routes/station_sample'
import serviceCall from './routes/service_call'

export default () => {
  const app = Router()
  auth(app)
  users(app)
  indicator(app)
  station_info(app)
  monitoring_group(app)
  indicator_threshold(app)
  system(app)
  data_reception(app)
  latest_data(app)
  station_map(app)
  station_config(app)
  camera(app)
  stream(app)
  station_tracking(app)
  table_data(app)
  chart_data(app)
  notification(app)
  file(app)
  role(app)
  environment_index(app)
  envIndex_ranking(app)
  public_station_map(app)
  filter(app)
  public_citizen(app)
  public_auth(app)
  news(app)
  public_station_data(app)
  manual_data(app)
  character(app)
  manager(app)
  report(app)
  data(app)
  approvedData(app)
  stationSample(app)
  serviceCall(app)
  
  return app
}
