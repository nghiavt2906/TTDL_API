
import moment from 'moment'
import { newId } from "models/utils"
import app from 'app'

function getRandomArbitrary(min, max) {
  return (Math.random() * (max - min) + min).toFixed(3);
}

function randomSensorStatus() {
  const status = ['00', '01', '02']
  const random = Math.floor(Math.random() * status.length)
  return status[random]
}

export const fakeData = async (stationId, startAt) => {
  const indicators = await app.StationIndicators.findIndicator(stationId)
  const indicatorInfo = indicators.map(item => {
    return {
      indicator: item.name,
      upperValue: 100,
      lowerValue: 0,
      unit: item.unit,
      sensorStatus: randomSensorStatus()
    }
  })
  const stationInfo = {
    stationId: stationId,
    indicators: indicatorInfo
  }
  let data = []
  for(let i= 0; i< 288; i++){
    const monitoringData = stationInfo.indicators.map(item => {
      return {
        id: newId(),
        indicator: item.indicator,
        value: getRandomArbitrary(item.lowerValue, item.upperValue),
        unit: item.unit,
        sensorStatus: item.sensorStatus
      }
    })
    data.push({
      id: newId(),
      stationId: stationInfo.stationId, 
      isFtpData: 1, 
      monitoringContent: 'FAKE_DATA',
      sentAt: moment(startAt).utcOffset(0).add(5*i, "m").toDate(),
      MonitoringData: monitoringData
    })
  }
  await app.MonitoringDataInfo.createManualData(data)
  return data
}