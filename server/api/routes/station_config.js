import { Router } from "express"
import models from 'models'
import * as func from "utils/functions"
const router = Router()
import bodyParser from 'body-parser'
import multer from 'multer'
import { newId } from "models/utils"
import app from 'app'
import HttpStatus from "http-status-codes"
import { isEmpty } from 'utils/functions'
import { getStationIndicators } from 'app/utils'
import asyncMiddleware from 'lib/asyncMiddleware'

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public')
  },
  filename: function (req, file, cb) {
    // cb(null, Date.now() + '-' +file.originalname )
    cb(null, newId() + '-' + file.originalname)
  }
})

var upload = multer({ storage: storage }).single('file')
var multiUpload = multer({ storage }).array('files')

export default expressRouter => {
  expressRouter.use("/quanlytram", router)


  router.get("/", async (req, res, next) => {
    // console.log(req.query)
    const { monitoringType } = req.query
    let data = {}
    let stationIndicatorsData = []
    let stationInfo = []

    let monitoringTypeData = await app.MonitoringType.getMonitoringType()
    monitoringTypeData = func.changeToArrayFilter(monitoringTypeData, 'id', 'name')

    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
    monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
    monitoringGroupData.unshift({ id: 'ALL', key: 'ALL', value: 'Tất cả' })

    let stationNameData = await app.Station.findStationNameByMonitoringType(monitoringType)
    if (stationNameData.length > 0) {
      stationInfo = await app.Station.findOneStationInfo({ id: stationNameData[0].id })
      stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')
    }

    // let monitoringGroupId = monitoringGroupData[1].key 
    // let stationInfo = await app.Station.findOneStationInfo({monitoringGroupId : monitoringGroupId}) 

    if (stationInfo.length > 0) {
      stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationInfo[0]['id'])
      stationIndicatorsData = func.eleminateNestedField(stationIndicatorsData, ['Indicator'])
    }


    let indicatorData = await app.Indicator.getIndicatorByCondition({ monitoringType: monitoringType }, ['id', 'name', 'symbol'])
    indicatorData = func.changeToArrayReactSelect(indicatorData, 'id', 'name')
    // console.log({indicatorData})

    data.monitoringType = monitoringTypeData
    data.monitoringGroup = monitoringGroupData
    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    data.indicatorsName = indicatorData
    res.send(data)
  })

  router.get("/group", async (req, res, next) => {

    // console.log('------------------> Here')
    // console.log(req.query)
    const { monitoringGroup } = req.query
    let data = {}
    let stationIndicatorsData = []
    let stationNameData = await app.Station.findStationNameByMonitoringGroup(monitoringGroup)
    stationNameData = func.changeToArrayFilter(stationNameData, 'id', 'name')

    let stationInfo = await app.Station.findOneStationInfo({ monitoringGroupId: monitoringGroup })
    if (stationInfo.length > 0) {
      stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationInfo[0]['id'])
    }

    data.stationName = stationNameData
    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    res.send(data)
  })

  router.get("/station", async (req, res, next) => {
    // console.log(req.query)
    const { stationName } = req.query
    let data = {}
    let stationInfo = await app.Station.findOneStationInfo({ id: stationName })
    // console.log('stationId',stationInfo[0]['id'] )
    let stationIndicatorsData = await app.StationIndicators.findIndicatorByIdStation(stationInfo[0]['id'])

    data.stationInfo = stationInfo
    data.stationIndicators = stationIndicatorsData
    res.send(data)
  })

  router.get("/getinfo", async (req, res, next) => {
    // console.log(req)
    const { monitoringType } = req.query
    let data = {}
    let monitoringGroupData = await app.MonitoringGroup.getMonitoringGroupName(monitoringType)
    monitoringGroupData = func.changeToArrayFilter(monitoringGroupData, 'id', 'name')
    let indicatorData = await app.Indicator.getIndicatorByType(monitoringType)
    indicatorData = func.changeToArrayReactSelect(indicatorData, 'id', 'name')

    data.monitoringGroup = monitoringGroupData
    data.indicatorData = indicatorData
    res.send(data)
  })

  router.put("/testUpdate/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

      // console.log(req)
      const { idStation, infoStation } = req.body
      // console.log({idStation,infoStation})

      let stationFields = {
        'monitoringType': infoStation.monitoringType,
        'name': infoStation.name,
        'monitoringGroupId': infoStation.monitoringGroup,
        'symbol': infoStation.symbol,
        'address': infoStation.address,
        'phone': infoStation.phone,
        'image': infoStation.image,
        'rootLocation': infoStation.rootLocation,
        // 'updateLocationStatus': func.changeBoleanToTinyInt(infoStation.updateLocationStatus),
        // 'installedAt': infoStation.installedAt,
        'verifiedAt': infoStation.verifiedAt,
        'verificationOrganization': infoStation.verificationOrganization,
        // 'emittedFrequency': infoStation.emittedFrequency,
        // 'ftpFolder': infoStation.ftpFolder,
        // 'ftpFilename': infoStation.ftpFilename,
        'alertThresholdStatus': func.changeBoleanToTinyInt(infoStation.alertThresholdStatus),
        'alertStructureStatus': func.changeBoleanToTinyInt(infoStation.alertStructureStatus),
        'alertDisconnectionStatus': func.changeBoleanToTinyInt(infoStation.alertDisconnectionStatus),
        'activityStatus': func.changeBoleanToTinyInt(infoStation.activityStatus),
        'publicStatus': func.changeBoleanToTinyInt(infoStation.publicStatus),
        // 'disconnectionTime': infoStation.disconnectionTime
      }

      let stationFtp = {
        hostFtp: infoStation.hostFtp,
        usernameFtp: infoStation.usernameFtp,
        passwordFtp: infoStation.passwordFtp,
        portFtp: infoStation.portFtp,
        ftpFilename: infoStation.ftpFilename
      }
      let updateStation = await app.Station.updateStationById(stationFields, idStation)

      await createFtpStation(idStation, stationFtp)
      if (updateStation.length > 0) {
        // console.log('======> Here')
        let deleteData = await app.StationIndicators.deleteStationIndicator(idStation)
        if (deleteData >= 0) {
          let arrayStationIndicator = func.renderStationIndicatorData(idStation, infoStation.indicators)
          await app.StationIndicators.createStationIndicator(arrayStationIndicator)
        }
      }
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'insert_station')

      let id = newId()
      // console.log(req.body)
      let insetStation = await app.Station.createStation(id, req.body)
      // test lại
      await app.StationFtp.createStationFtp(id, req.body)
      let arrayStationIndicator = func.renderStationIndicatorData(id, req.body.indicators)
      await app.StationIndicators.createStationIndicator(arrayStationIndicator)
      // if(insetStation.length){

      //   await app.StationIndicators.createStationIndicator(arrayStationIndicator)

      // }
      res.send(id)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/image", async (req, res, next) => {
    try {
      upload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
          console.log('err1', err)
          return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
          console.log('err2', err)
          return res.status(500).json(err)
          // An unknown error occurred when uploading.
        }

        return res.status(200).send(req.file)
        // Everything went fine.
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.put("/images", async (req, res, next) => {
    try {
      multiUpload(req, res, function (err) {

        if (err instanceof multer.MulterError) {
          console.log('err1', err)
          return res.status(500).json(err)
          // A Multer error occurred when uploading.
        } else if (err) {
          console.log('err2', err)
          return res.status(500).json(err)
          // An unknown error occurred when uploading.
        }

        return res.status(200).send(req.files)
        // Everything went fine.
      })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/info/:stationId", async (req, res, next) => {
    const { stationId } = req.params
    const result = await app.Station.getStationConfigById(stationId)
    res.send(result)
  })

  router.post("/createStation/:managerId", async (req, res, next) => {
    try {
      const { data } = req.body
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'insert_station')
      const stationId = await app.Station.createNewStation(data)
      // console.log('=====>', stationId)
      await app.ManagerStation.addNewStationManager(managerId, stationId)

      const result = await app.ManagerStation.getStationManagement(managerId, { id: stationId })
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.delete("/:managerId/:stationId", async (req, res, next) => {
    try {
      const { managerId, stationId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'delete_station')
      await app.Station.deleteStation(stationId)
      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getData/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      const { monitoringType, monitoringGroup, district, station } = req.query
      if (isEmpty(monitoringType) || isEmpty(monitoringGroup) || isEmpty(district) || isEmpty(station)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.route.invalid",
          messages: "Route not found!"
        }
      }
      const condition = analyzeCondition(monitoringType, monitoringGroup, district, station)
      // console.log(condition)
      const result = await app.ManagerStation.getStationManagement(managerId, condition)
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getDataById/:stationId/:managerId", async (req, res, next) => {
    try {
      const { managerId, stationId } = req.params
      if (isEmpty(managerId) || isEmpty(stationId)) {
        throw {
          status: HttpStatus.BAD_REQUEST,
          id: "api.route.invalid",
          messages: "Route not found!"
        }
      }
      const stationInfo = await app.Station.getStationById(stationId)
      const indicators = await app.StationIndicators.getStationIndicatorsByStationId(stationId)
      res.send({ stationInfo, indicators })
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  // router.put("/updateStation/:stationId/:managerId", async (req, res, next) => {
  //   try {
  //     const {managerId, stationId} = req.params
  //     await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

  //     const {data} = req.body
  //     if(isEmpty(managerId) || isEmpty(stationId)){
  //       throw {
  //         status: HttpStatus.BAD_REQUEST,
  //         id: "api.route.invalid",
  //         messages: "Route not found!"
  //       }
  //     }
  //     await app.Station.updateStation(stationId, data)
  //     const result = await app.ManagerStation.getStationManagement(managerId, {id : stationId})
  //     res.send(result)
  //   } catch (error) {
  //     console.log(error)
  //     next(error)
  //   }
  // })

  router.put("/updateStation/:stationId/:managerId", asyncMiddleware(updateStation))

  router.put("/getIndicators/:stationId", async (req, res, next) => {
    try {
      const { stationId } = req.params
      let stationIndicators = await app.StationIndicators.findIndicator(stationId)
      stationIndicators = getStationIndicators(selectedIndicator)
      res.send(stationIndicators)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.get("/getListStation/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      let result = await app.ManagerStation.getListStation(managerId, { monitoringType: 'QTN' })
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  router.post("/getInfo/:managerId", async (req, res, next) => {
    try {
      const { managerId } = req.params
      await app.Manager.checkManagerPermission(managerId, 'edit_station_config')
      const { stationId } = req.body

      const result = await app.Station.getStationConfiguration({ id: stationId })
      res.send(result)
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

}

const updateStation = async (req, res, next) => {
  const { managerId, stationId } = req.params
  await app.Manager.checkManagerPermission(managerId, 'edit_station_config')

  const { data } = req.body
  if (isEmpty(managerId) || isEmpty(stationId)) {
    throw {
      status: HttpStatus.BAD_REQUEST,
      id: "api.route.invalid",
      messages: "Route not found!"
    }
  }
  await app.Station.updateStation(stationId, data)
  const result = await app.ManagerStation.getStationManagement(managerId, { id: stationId })
  res.send(result)
}

async function createFtpStation(stationId, ftpStation) {
  let checkFtp = await app.StationFtp.findStationFtp(stationId)
  if (checkFtp.length > 0) {
    await app.StationFtp.updateStationFtp(stationId, ftpStation)
  } else {
    await app.StationFtp.createStationFtp(stationId, ftpStation)
  }
}

function analyzeCondition(monitoringType, monitoringGroup, district, station) {
  let condition = {}
  if (station !== 'ALL') {
    condition = { id: station }
  } else {
    if (monitoringGroup !== 'ALL') {
      if (district === 'ALL') {
        condition = { monitoringGroupId: monitoringGroup }
      } else {
        condition = { monitoringGroupId: monitoringGroup, districtId: district }
      }
    } else {
      if (district === 'ALL') {
        condition = { monitoringType: monitoringType }
      } else {
        condition = { monitoringType: monitoringType, districtId: district }
      }
    }
  }

  return condition
}