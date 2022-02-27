import models from "models"
import Client from "ftp"
import _, { result } from "lodash"
import chalk from "chalk"
import validator from "validator"
import { reformatSystemInfo } from "./utils"
import * as sms from "utils/sms"
import app from "app"
import * as func from "utils/functions"
import { newId } from "models/utils"
import moment from "moment"
import async from "async"
import configs from "configs"
import WS from 'services/websocket'


const config = {
  // host: "210.2.92.238",
  // user: "admin_",
  // password: "@quantrac123",
  // port: 21,

  host: configs.fileServer.host,
  user: configs.fileServer.username,
  password: configs.fileServer.password,
  port: configs.fileServer.port,
}

class FtpSyncData {
  constructor() { }

  handleFtpServerRealtime = () => {
    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        // console.log('\n************* Start Sync Ftp ************')
        let systemInfo = await app.System.findSystemInfo("1", [
          "dirReceiveFtp",
          "dirSaveFtp",
          "dirWrongFtp",
        ])
        systemInfo = reformatSystemInfo(systemInfo)
        const stationInfo = await app.Station.getInfo()
        const arrivedFolder = await this.listFolder(ftp, "/BackUpFiles", "d")
        const activedStation = this.findActiveStation(
          arrivedFolder,
          stationInfo
        )

        async.mapSeries(
          activedStation,
          async (station) => {
            // console.log(chalk.yellow(`\n*********** Starting Sync Station ${station.name} ***********`))
            const dateFolders = await this.listFolder(
              ftp,
              `/BackUpFiles/${station.ftpFolder}`,
              "d"
            )
            const lastFolder = func.getLastFolder(dateFolders)
            // console.log(lastFolder)
            if (dateFolders.length === 0) return true

            const files = await this.listFilesFtp(
              ftp,
              `/BackUpFiles/${station.ftpFolder}/${lastFolder}`,
              systemInfo
            )
            // console.log(files)
            if (files.length === 0) return true
            await async.mapLimit(files, 20, async (file) => {
              const filePath = `/BackUpFiles/${station.ftpFolder}/${lastFolder}/${file}`
              // console.log(filePath)
              // return this.readFileFtp(ftp, file, station, systemInfo, filePath)
            })

            return true
          },
          (err, result) => {
            // console.log('+++++++ ERR', err)
            // console.log('=======> RESULT', result)
          }
        )
      } catch (err) {
        console.log(chalk.red(err))
        throw err
      }
    })
    ftp.connect(config)
  }

  handleFtpServer = () => {
    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        // console.log('\n************* Start Sync Ftp ************')
        let systemInfo = await app.System.findSystemInfo("1", [
          "dirReceiveFtp",
          "dirSaveFtp",
          "dirWrongFtp",
          "syncFtpStatus",
          "numberOfFiles",
        ])
        // console.log('DM NO', systemInfo)
        systemInfo = reformatSystemInfo(systemInfo)
        if (systemInfo.syncFtpStatus === "0") return
        const numberOfFiles = parseInt(systemInfo.numberOfFiles)
        const stationInfo = await app.Station.getInfo()
        const arrivedFolder = await this.listFolder(ftp, "/BackUpFiles", "d")
        const activedStation = this.findActiveStation(
          arrivedFolder,
          stationInfo
        )
        // console.log(activedStation.length, activedStation, systemInfo)
        // console.log(stationInfo, activedStation)
        async.mapSeries(
          activedStation,
          async (station) => {
            // console.log(chalk.yellow(`\n*********** Starting Sync Station ${station.name} ***********`))
            const dateFolders = await this.listFolder(
              ftp,
              `/BackUpFiles/${station.ftpFolder}`,
              "d"
            )
            // console.log(dateFolders)

            if (dateFolders.length === 0) return true

            async.mapSeries(dateFolders, async (folder) => {
              let pathDir = `/BackUpFiles/${station.ftpFolder}/${folder}`
              const files = await this.listFilesFtp(ftp, pathDir, systemInfo)
              // console.log(files)
              if (files.length === 0) {
                // console.log(chalk.yellow(pathDir))
                await this.deleteDirectory(ftp, pathDir)
                return true
              }
              async.mapLimit(files, numberOfFiles, async (file) => {
                const filePath = `/BackUpFiles/${station.ftpFolder}/${folder}/${file}`
                return this.readFileFtp(
                  ftp,
                  file,
                  station,
                  systemInfo,
                  filePath
                )
              })
            })

            return true
          },
          (err, result) => {
            // console.log('+++++++ ERR', err)
            // console.log('=======> RESULT', result)
          }
        )
      } catch (err) {
        console.log(chalk.red(err))
        throw err
      }
    })
    ftp.connect(config)
  }

  testFtpServer = () => {
    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        let systemInfo = await app.System.findSystemInfo("1", [
          "dirReceiveFtp",
          "dirSaveFtp",
          "dirWrongFtp",
          "syncFtpStatus",
          "numberOfFiles",
        ])
        systemInfo = reformatSystemInfo(systemInfo)
        if (systemInfo.syncFtpStatus === "0") return
        const numberOfFiles = parseInt(systemInfo.numberOfFiles)
        const stationInfo = await app.Station.getInfo()
        const arrivedFolder = await this.listFolder(ftp, "/DataFiles", "d")
        const activedStation = this.findActiveStation(
          arrivedFolder,
          stationInfo
        )
        // console.log(activedStation.length, activedStation, systemInfo)
        // console.log(stationInfo, activedStation)
        async.each(
          activedStation,
          async (station) => {
            const dateFolders = await this.listFolder(
              ftp,
              `/DataFiles/${station.ftpFolder}`,
              "d"
            )
            // console.log(dateFolders)

            if (dateFolders.length === 0) return true

            await async.mapSeries(dateFolders, async (folder) => {
              let pathDir = `/DataFiles/${station.ftpFolder}/${folder}`
              const files = await this.listFilesFtp(ftp, pathDir, systemInfo)
              console.log(chalk.red(pathDir))
              if (files.length === 0) {
                // console.log(chalk.yellow(pathDir))
                // await this.deleteDirectory(ftp, pathDir)
                return true
              }
              await async.mapSeries(files, async (file) => {
                const filePath = `/DataFiles/${station.ftpFolder}/${folder}/${file}`
                console.log(chalk.yellow(filePath))
                return this.readFileFtp(
                  ftp,
                  file,
                  station,
                  systemInfo,
                  filePath
                )
              })
              // async.mapLimit(files, numberOfFiles, async (file) => {
              //   const filePath = `/DataFiles/${station.ftpFolder}/${folder}/${file}`
              //   console.log(filePath)
              //   // return this.readFileFtp(
              //   //   ftp,
              //   //   file,
              //   //   station,
              //   //   systemInfo,
              //   //   filePath
              //   // )
              // })
            })

            return true
          },
          (err, result) => {
            // console.log('+++++++ ERR', err)
            // console.log('=======> RESULT', result)
          }
        )
      } catch (err) {
        console.log(chalk.red(err))
        throw err
      }
    })
    ftp.connect(config)
  }


  syncLatestFtpData = () => {
    var ftp = new Client()
    ftp.on("ready", async () => {
      try {
        // console.log('\n************* Start Sync Ftp ************')
        let systemInfo = await app.System.findSystemInfo("1", [
          "dirReceiveFtp",
          "dirSaveFtp",
          "dirWrongFtp",
          "syncFtpStatus",
          "numberOfFiles",
        ])
        systemInfo = reformatSystemInfo(systemInfo)
        // console.log({systemInfo})
        if (systemInfo.syncFtpStatus === "0") return

        const numberOfFiles = parseInt(systemInfo.numberOfFiles)
        const stationInfo = await app.Station.getInfo()
        const arrivedFolder = await this.listFolder(
          ftp,
          systemInfo.dirReceiveFtp,
          "d"
        )
        const activedStation = this.findActiveStation(
          arrivedFolder,
          stationInfo
        )

        if (activedStation.length === 0) return

        async.mapSeries(
          activedStation,
          async (station) => {
            let pathDir = `${systemInfo.dirReceiveFtp}/${station.ftpFolder}`
            const files = await this.listFilesFtp(ftp, pathDir, systemInfo)
            // console.log(files)

            async.mapLimit(files, numberOfFiles, async (file) => {
              const filePath = `${systemInfo.dirReceiveFtp}/${station.ftpFolder}/${file}`
              return this.readFileFtp(ftp, file, station, systemInfo, filePath)
            })

            return true
          },
          (err, result) => {
            // console.log('+++++++ ERR', err)
            // console.log('=======> RESULT', result)
          }
        )
      } catch (err) {
        // console.log(chalk.red(err))
        throw err
      }
    })
    ftp.connect(config)
  }

  listFolder = (ftp, folderDir, type) => {
    return new Promise((resolve, reject) => {
      ftp.list(folderDir, (err, result) => {
        if (err) {
          // console.log(chalk.red(`Error At listFolder`), err)
          reject(err)
        }
        let listFiles = []
        if (result !== undefined) {
          result.forEach((folder) => {
            if (folder.type === type) {
              listFiles.push(folder.name)
            }
          })
        }
        resolve(listFiles)
      })
    })
  }

  findActiveStation = (arrayFtpFolder, arrayStationInfo) => {
    try {
      let activeStation = []
      arrayStationInfo.forEach((station) => {
        let index = _.findIndex(arrayFtpFolder, (folder) => {
          return folder === station.ftpFolder
        })
        if (index > -1) {
          activeStation.push(station)
        }
      })
      return activeStation
    } catch (error) {
      // console.log(chalk.red(`Error in findActiveStation`))
      throw error
    }
  }

  listFilesFtp = (ftp, dataDir, systemInfo) => {
    return new Promise((resolve, reject) => {
      // let dirStation = `${systemInfo.dirReceiveFtp}/${station.ftpFolder}`
      ftp.list(dataDir, (err, result) => {
        // console.log(result)
        if (err) {
          // console.log(err)
          // console.log(chalk.red(`Error in listFilesFtp`))
          reject(err)
        }
        let listFiles = []
        if (result === undefined || !result.length) {
          resolve([])
        } else {
          result.forEach((file) => {
            if (file.type === "-") {
              listFiles = [...listFiles, file.name]
            }
          })
          resolve(listFiles)
        }
      })
    })
  }

  readFileFtp = async (ftp, fileName, station, systemInfo, filePath) => {
    try {
      // const filePath = `${systemInfo.dirReceiveFtp}/${station.ftpFolder}/${fileName}`
      const fileInfo = this.analyzeFile(fileName)
      let sentTime = func.convertTimeToISOFormat(fileInfo.time)
      let dataInfo = {}

      // sentTime = new Date(sentTime)
      sentTime = moment(sentTime).utc(7).format()
      dataInfo.id = newId()
      dataInfo.stationId = station.id
      dataInfo.sentAt = sentTime
      dataInfo.isFtpdata = 1

      let streamData = await this.streamDataFtp(ftp, filePath)
      let data = await this.convertStreamData(streamData)

      let latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(station.id)
      console.log(chalk.blue(fileName, latestSentAt))
      // Check isValid file, if false do backup file in wrong format filename
      const isValidFilename = this.compareFormatFile(
        fileName,
        station.ftpFilename
      )
      if (!isValidFilename) {
        const backupWrongDir = await this.checkFtpFileFolder(
          ftp,
          fileName,
          station,
          systemInfo.dirWrongFtp
        )
        if (backupWrongDir) {
          await this.putFileFTP(ftp, data, `${backupWrongDir}/${fileName}`)
        }
        // await this.deleteFtpFile(ftp, filePath)

        return
      }

      dataInfo.monitoringContent = data
      // console.log(dataInfo)

      const monitoringData = this.splitData(data, "kjhadkjfhka")
      const finalData = {
        ...dataInfo,
        MonitoringData: monitoringData,
      }
      // console.log(finalData)
      // console.log(result)

      // Save file right format
      let backupRightDir = await this.checkFtpFileFolder(
        ftp,
        fileName,
        station,
        systemInfo.dirSaveFtp
      )
      if (backupRightDir) {
        await this.putFileFTP(ftp, data, `${backupRightDir}/${fileName}`)
      }
      await app.MonitoringDataInfo.createData(finalData)
      // await this.deleteFtpFile(ftp, filePath)
    } catch (error) {
      // console.log(chalk.red(error))
      ftp.end()
      throw error
    }
  }

  analyzeFile(fileName) {
    try {
      var file = {}
      var formatFile = _.split(fileName, ".")
      var splittingFile = _.split(formatFile[0], "_")

      file.type = formatFile[1]
      if (splittingFile.length > 3) {
        file.symbol = splittingFile[2]
        file.time = splittingFile[3]
        file.name = _.split(formatFile[0], file.time)[0]
        file.year = file.time.substr(0, 4)
        file.month = file.time.substr(4, 2)
        file.day = file.time.substr(6, 2)
        file.hour = file.time.substr(8, 2)
        file.min = file.time.substr(10, 2)
        file.sec = file.time.substr(12, 2)
      } else {
        file.symbol = splittingFile[0]
        file.time = splittingFile[1]
        file.name = formatFile[0].replace(file.time, "")
        file.year = file.time.substr(0, 4)
        file.month = file.time.substr(4, 2)
        file.day = file.time.substr(6, 2)
        file.hour = file.time.substr(8, 2)
        file.min = file.time.substr(10, 2)
        file.sec = file.time.substr(12, 2)
      }
      // // console.log({file})
      return file
    } catch (error) {
      // console.log(chalk.red(`Error in analyzeFile`), error)
      throw error
    }
  }

  streamDataFtp = (ftp, filePath) => {
    return new Promise((resolve, reject) => {
      ftp.get(filePath, (err, streamData) => {
        // console.log(`Stream data ${filePath}`)
        if (err) {
          // console.log('Stream data error', err)
          reject(err)
        }
        resolve(streamData)
      })
    })
  }

  convertStreamData(streamData) {
    return new Promise((resolve, reject) => {
      let data = ""
      streamData
        .on("data", (chunk) => {
          data += chunk
        })
        .on("end", () => {
          // console.log(`convert Stream Data`)
          resolve(data)
        })
    })
  }

  deleteFtpFile = (ftp, path) => {
    return new Promise((resolve, reject) => {
      ftp.delete(path, (err) => {
        if (err) {
          // console.log(`Delete ${path} error`, err)
          reject(err)
        }
        // console.log('Delete file ftp success', path)
        resolve()
      })
    })
  }

  deleteDirectory = (ftp, dirPath) => {
    return new Promise((resolve, reject) => {
      ftp.rmdir(dirPath, (err) => {
        if (err) {
          // console.log(`Delete directory ${dirPath} error`, err)
          reject(err)
        }
        // console.log('Delete directory success', dirPath)
        resolve()
      })
    })
  }

  checkFtpFileFolder = async (ftp, fileName, station, rootFolder) => {
    try {
      let fileInfo = this.analyzeFile(fileName)
      let typeFolder = ""
      if (station.monitoringType == "QTN") {
        typeFolder = "nuoc"
      } else {
        typeFolder = "khi"
      }

      let folderStation = `${rootFolder}/${station.ftpFolder}`
      let folderRootType = `${folderStation}/${typeFolder}`
      let dirMonthFolder = `${folderRootType}/${fileInfo.year}/Thang${fileInfo.month}`
      let dirTimeFolder = `${fileInfo.day}${fileInfo.month}${fileInfo.year}`
      let dirFileFolder = `${dirMonthFolder}/${dirTimeFolder}`

      this.mkdirFtp(ftp, dirFileFolder)
      return dirFileFolder
    } catch (error) {
      // console.log(chalk.red("Error at checkFtpFileFolder"))
      throw error
    }
  }

  putFileFTP = (ftp, content, destDir) => {
    return new Promise((resolve, reject) => {
      ftp.put(content, destDir, (err) => {
        if (err) {
          // console.log(chalk.red(`Error At putFileFTP ${destDir}`))
          reject(err)
        }
        console.log(`Put file at ${destDir}`)
        resolve()
      })
    })
  }

  mkdirFtp = (ftp, dirFolder) => {
    return new Promise((resolve, reject) => {
      ftp.mkdir(dirFolder, [true], (err) => {
        if (err) {
          // console.log('Create folder error', err)
          reject(err)
        }
        // // console.log(`==> Đã tạo thành công folder ${dirFolder}`)
        resolve()
      })
    })
  }

  compareFormatFile = (sentFileName, defaultFileName) => {
    try {
      var sentFile = this.analyzeFile(sentFileName)
      var defaultFile = this.analyzeFile(defaultFileName)
      // console.log({sentFile,defaultFile})
      if (
        sentFile.type !== "txt" ||
        sentFile.name !== defaultFile.name ||
        !this.validateTime(sentFile.time) ||
        isNaN(sentFile.time)
      ) {
        return false
      }
      return true
    } catch (error) {
      // console.log(chalk.red(`Error in compareFormatFile`))
      throw error
    }
  }

  validateTime = (time) => {
    try {
      if (!validator.isNumeric(time) || time.length !== 14) {
        return false
      }
      var year = parseInt(time.substr(0, 4))
      var month = parseInt(time.substr(4, 2))
      var day = parseInt(time.substr(6, 2))
      var hour = parseInt(time.substr(8, 2))
      var min = parseInt(time.substr(10, 2))
      var sec = parseInt(time.substr(12, 2))
      if (month > 12 || day > 31) {
        return false
      }
      if (hour > 24 || min > 60 || sec > 60) {
        return false
      }
      return true
    } catch (error) {
      // console.log(chalk.red(`Error in validateTime`))
      throw error
    }
  }

  splitData = (data, idData) => {
    try {
      let dataArray = []
      data = _.split(data, "\n")
      // console.log({data})
      //Cắt string data thành các mảng array
      data.forEach((smallData) => {
        smallData = _.split(smallData, "\t")
        if (isNaN(parseFloat(smallData[0]))) {
          if (!isNaN(parseFloat(smallData[1]))) {
            dataArray.push(smallData)
          }
        } else {
          dataArray.push(smallData)
        }
      })
      // console.log({dataArray})
      return this.convertArrayToObject(dataArray, idData)
    } catch (error) {
      // console.log(chalk.red(`Error At splitData`), error)
      throw error
    }
  }

  convertArrayToObject = (data, idData) => {
    return data.map((smalldata) => {
      let newData = {}
      if (smalldata.length > 4 && smalldata[smalldata.length - 1] !== "\r") {
        let index = smalldata.indexOf("\r")
        if (index !== -1) smalldata.splice(index, 1)
      }
      // Kiểm tra dữ liệu thuộc form cũ hay form mới
      if (isNaN(parseFloat(smalldata[0]))) {
        // console.log('case 1')
        newData.id = newId()
        // newData.idData = idData
        newData.indicator = smalldata[0].replace("﻿", "")
        newData.value = smalldata[1]
        newData.unit = smalldata[2].split("\r").join("")
        // newData.time = smalldata[3]
        newData.sensorStatus = smalldata[4].split("\r").join("")
      } else {
        // console.log('case 2')
        newData.id = newId()
        // newData.idData = idData
        newData.indicator = smalldata[1].replace("﻿", "")
        newData.value = smalldata[2]
        newData.unit = smalldata[3].split("\r").join("")
        // newData.time = smalldata[0]
        newData.sensorStatus = "01"
      }
      return newData
    })
  }

  sendDisconnectionAlert = async (stationId) => {
    const notification = await app.Notifications.create(
      "DISCONNECT",
      stationId,
      `Trạm ${stationId} mất kết nối.`
    )
    const managers = await app.ManagerStation.getManagerByStationId(stationId)

    for (let manager of managers) {
      await this.sendDisconnectAlertToManager(manager, notification.id)
    }
  }

  sendDisconnectAlertToManager = async (manager, notificationId) => {
    const disconnectSetting =
      await app.ManagerNotificationSettings.getSettingsByType(
        manager.managerId,
        "DISCONNECT"
      )
    const { maximumNumberOfSendingTimes, currentNumberOfSendingTimes, status } =
      disconnectSetting
    if (!status) return

    if (maximumNumberOfSendingTimes > currentNumberOfSendingTimes) {
      // app.Email.handleStationDisconnect(
      //   { name: "Tin", symbol: "ABC", monitoringGroup: "QTN" },
      //   manager.email
      // )
      await app.ManagerNotifications.create(manager.managerId, notificationId)
      // await app.ManagerNotificationSettings.update(
      //   { currentNumberOfSendingTimes: currentNumberOfSendingTimes + 1 },
      //   { managerId: manager.managerId, type: "DISCONNECT" }
      // )
      console.log('Nhay zo day may lan')
      await WS.emit(manager.managerId, 'notification')
    }
  }

  sendWrongStructureAlert = async (stationId) => {
    const notificationId = await app.Notifications.create(
      "WRONGSTRUCTURE",
      stationId,
      `Trạm <b></b>${stationId} sai cấu trúc.`
    )
    const managers = await app.ManagerStation.getManagerByStationId(stationId)

    for (let manager of managers) {
      const { managerId } = manager
      await this.sendWrongStructureAlertToManager(managerId, notificationId)
    }
  }

  sendWrongStructureAlertToManager = async (managerId, notificationId) => {
    const wrongStructureSetting =
      await app.ManagerNotificationSettings.getSettingsByType(
        managerId,
        "WRONGSTRUCTURE"
      )
    const { maximumNumberOfSendingTimes, currentNumberOfSendingTimes, status } =
      wrongStructureSetting

    if (!status) return

    if (maximumNumberOfSendingTimes > currentNumberOfSendingTimes) {
      sendWrongStructureMail()
      await app.ManagerNotifications.create(managerId, notificationId)
      await app.ManagerNotificationSettings.update(
        { currentNumberOfSendingTimes: currentNumberOfSendingTimes + 1 },
        { managerId, type: "WRONGSTRUCTURE" }
      )
      await app.ManagerNotificationSettings.update(
        { currentNumberOfSendingTimes: 0 },
        { managerId, type: "DISCONNECT" }
      )
      sendSocket()
    }
  }

  sendOverThresholdAlert = async (stationId, overThresholdIndicators, sentAt) => {
    const station = await models.Station.findOne({
      attributes: ["name"],
      raw: true,
      where: { id: stationId },
    })

    if (configs.nodeEnv === "development") {
      console.log(`Trạm ${station.name} vượt ngưỡng cảnh báo.`)
    }

    const title = `Trạm ${station.name} vượt ngưỡng cảnh báo.`
    const content = `Những chỉ số quan trắc vượt ngưỡng là ${overThresholdIndicators}`
    const notification = await app.Notifications.create(
      "OVERTHRESHOLD",
      stationId,
      title,
      content,
      moment(sentAt).utc().format()
    )
    const managers = await app.ManagerStation.getManagerByStationId(stationId)

    for (let manager of managers) {
      manager.mailTitle = title
      manager.mailContent = content
      await this.sendOverThresholdAlertToManager(manager, notification.id)
    }
  }

  sendOverThresholdAlertToManager = async (manager, notificationId) => {
    const { managerId, name, email, mailTitle, mailContent } = manager
    const overThresholdSetting = await app.ManagerNotificationSettings.getSettingsByAtrributes(manager.managerId, [
      "overThresholdAlertStatus",
      "notificationAlertStatus",
      "emailAlertStatus",
    ])
    if (!overThresholdSetting) return

    const { overThresholdAlertStatus, notificationAlertStatus, emailAlertStatus } = overThresholdSetting
    if (!overThresholdAlertStatus) return

    if (notificationAlertStatus) {
      await app.ManagerNotifications.create(managerId, notificationId)
      WS.emit(managerId)
    }

    // Check should send Alert to Email
    if (emailAlertStatus) {
      app.Email.sendMail({
        subject: mailTitle,
        content: `<p>Kính gửi: anh(chị) ${name}</p>\
                    </br>\
                    <p>${mailTitle} ${mailContent}. Xin hãy kiểm tra lại trạm!</p>\
                    </br>\
                    <p>Trân trọng,</p>\
                    <p>Trung tâm dữ liệu Đà Nẵng.</p>`,
        receiver: email,
      })
    }
  }

  resetNotificationSettings = async (stationId) => {
    const managers = await app.ManagerStation.getManagerByStationId(stationId)

    for (let manager of managers) {
      const { managerId } = manager
      await this.resetNotificationSettingOfManager(managerId)
    }
  }

  resetNotificationSettingOfManager = async (managerId) => {
    await app.ManagerNotificationSettings.update(
      { currentNumberOfSendingTimes: 0 },
      { managerId, type: "OVERTHRESHOLD" }
    )
    await app.ManagerNotificationSettings.update(
      { currentNumberOfSendingTimes: 0 },
      { managerId, type: "WRONGSTRUCTURE" }
    )
    await app.ManagerNotificationSettings.update(
      { currentNumberOfSendingTimes: 0 },
      { managerId, type: "DISCONNECT" }
    )
  }

  checkOverThreshold = async (stationId, data, sentAt) => {
    const NORMAL_STATUS = "00"
    const { monitoringGroupId } = await models.Station.findOne({
      where: { id: stationId },
      attributes: ["monitoringGroupId"],
    })

    const thresholds = await app.IndicatorThreshold.getIndicatorThresholdByGroupId(monitoringGroupId)
    const result = data.map((item) => {
      const index = _.findIndex(thresholds, (threshold) => {
        return threshold.name === item.indicator
      })

      if (index < 0) {
        return false
      }


      if (item.sensorStatus !== NORMAL_STATUS) {
        return false
      }

      if (thresholds[index].lowerLimit > item.value || thresholds[index].upperLimit < item.value) {
        return true
      }

      return false
    })

    let overThresholdIndicators = ""

    let isFirstIndicator = true
    result.forEach((item, index) => {
      if (item === true) {
        overThresholdIndicators =
          overThresholdIndicators + (isFirstIndicator ? '' : ', ') + `${data[index].indicator}: ${data[index].value} ${data[index].unit}`
        isFirstIndicator = false
      }
    })

    if (result.includes(true)) {
      let isNewUpdate = true
      const overThresholdSettings = await app.StationAutoParameters.getOverThresholdSettings(stationId)

      const latestSentAt = await app.MonitoringDataInfo.getLatestSentAt(stationId)

      if (latestSentAt === null) {
        isNewUpdate = true
      } else {
        Math.abs(new Date(sentAt) - new Date(latestSentAt)) > 0 ? (isNewUpdate = true) : (isNewUpdate = false)
      }

      const { numberOfAlertThreshold, alertThresholdStatus } = overThresholdSettings
      await models.StationAutoParameter.update(
        { isOverThreshold: 1, isDisconnect: 0, isWrongStructure: 0 },
        { where: { stationId } }
      )
      if (alertThresholdStatus === 1 && isNewUpdate) {
        this.sendOverThresholdAlert(stationId, overThresholdIndicators, sentAt)
        await models.StationAutoParameter.update(
          {
            numberOfAlertStructure: 0,
            numberOfDisconnection: 0,
            numberOfAlertThreshold: numberOfAlertThreshold + 1,
          },
          { where: { stationId } }
        )
      }
    }
  }
}

export default FtpSyncData
