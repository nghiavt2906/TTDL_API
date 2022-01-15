import { spawn } from "child_process"
import fs from "fs"
import async from "async"
import config from "configs"
import app from "app"
import Logger from "lib/logger"
import Basic from "lib/basic"
import FFmpeg from "lib/ffmpeg"
import PsList from 'ps-list'


let centic = {}

class CameraService {
  constructor() {
    this.cameras = {}
    // this.startCameraInQuere = async.queue(function(action, callback) {
    //   setTimeout(function() {
    //     action(callback)
    //   }, 2000)
    // }, 1)
  }

  initialize() {
    Logger.info("Starting Cameras... Please Wait...")
    try {
      this.loadCameras()
    } catch (error) {
      console.log(error)
    }
  }

  initiateCameraObject(cam) {
    if (!centic[cam.id]) centic[cam.id] = {}
    if( !centic[cam.id]) centic[cam.id].isStarted = false
  }

  loadCameras() {
    Logger.info("Load all camera from database")
    app.Camera.getAllCamera()
      .then(cameras => {
        for (let cam of cameras) {
          this.loadCamera(cam)
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  loadCamera(cam) {
    try {
      this.initiateCameraObject(cam)
      this.createStreamDirectory(cam, async function (camObject) {
        // console.log(camObject)
        const ffmpegProcess = FFmpeg.createFFmpegProcess(camObject)
        const processesList = await Basic.listProcesses()
        const checkExistedProcess = Basic.checkExistedProcessByCmd(processesList, cam.id)
        if(checkExistedProcess.status){
          const srcCam = camObject.srcCam
          const pid = checkExistedProcess.pid
          console.log({pid, srcCam})
          await app.Camera.updateStationCamera(camObject.id, {srcCam, pid, status: 0})
        }
        centic[camObject.id].spawn = ffmpegProcess
        centic[camObject.id].spawn.stderr.on("data", data => {
          // console.log(`Stderr: ${data}`)
        })

        centic[camObject.id].spawn.on('close', code => {
          // console.log(`child process exited with code ${code}`)
        })
      })
    } catch (error) {}
  }

  syncCamera = async () => {
    try {
      const cameraList = await app.Camera.getAllCamera()
      const processesList = await Basic.listProcesses()
      cameraList.forEach(cam => {
        const checkExistedProcess = Basic.checkExistedProcessByCmd(processesList, cam.id)
        if(cam.status === 0 && checkExistedProcess.status) {
          if(this.checkStreamFile(cam.id)){
            console.log('===> PROCESSE EXISTED')
          } else {
            console.log('===> RECREATE CAM PROCESS')
            this.recreateStream(cam)
          }
        } else {
          console.log('===> PROCESSE DOES NOT EXISTED')
          this.loadCamera(cam)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  recreateStream = async (cam) => {
    await this.killCameraProcess(cam.pid)
    this.loadCamera(cam)
  }

  killCameraProcess = async (pid) => {
    await Basic.killProcess(pid)
    // await app.Camera.updateStationCamera(camObject.id, {srcCam : '', pid : '', status: 3})
  }

  updateCamera = async (cam) => {
    await this.killCameraProcess(cam.pid)
    this.loadCamera(cam)
  }

  deleteCamera = async (cam) => {
    console.log({cam})
    await this.killCameraProcess(cam.pid)
    await app.Camera.updateStationCamera(cam.id, {srcCam : null, pid : null, status: 3})

  }

  handleFolderError(err) {
    if (err) {
      switch (err.code) {
        case "EEXIST":
          break
        default:
          Logger.error(`Create Stream Directory Fail: ${err}`)
          break
      }
    }
  }

  createStreamDirectory(cam, callback) {
    const directory = `${config.streamDir}/${cam.id}/`
    try {
      fs.mkdir(directory, err => {
        if (err) {
          Basic.handleFolderError(err)
          Basic.file("deleteFolder", directory, err => {
            if (err) {
              // Logger.error(`Delete Folder Error: ${err}`)
            } else {
              // Logger.info(`Delete Folder ${directory} Success`)
              fs.mkdirSync(directory)
              Logger.info(`Create Camera ${cam.id} Folder Success`)
              cam.srcCam = `http://${config.server.host}:${config.server.port}/api/stream/${cam.id}/s.m3u8`
              callback(cam)
            }
          })
        } else {
          cam.srcCam = `http://${config.server.host}:${config.server.port}/api/stream/${cam.id}/s.m3u8`
          Logger.info(`Create Camera ${cam.id} Folder`)
          callback(cam)
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  addCamera(cam){
    this.loadCamera(cam)
  }

  checkStreamFile = (camId) => {
    const streamPath = `${config.streamDir}/${camId}/s.m3u8`
    if (fs.existsSync(streamPath)) {
      return true
    } else {
      return false
    }
  }

  destroyCamera(cam){
    try {
      const directory = `${config.streamDir}/${cam.id}/`
      Basic.processKill(cam.pid)
      Basic.file("deleteFolder", directory, err => {
        if (err) {
          Logger.error(`Delete Folder Error: ${err}`)
        }
      })
    } catch (error) {
      console.log(error)
    }
    // if(centic[cam.id].spawn) centic[cam.id].spawn.kill()
    // delete centic[cam.id]

  }

  fatalCameraError(){

  }

  getRawSnapshotFromCamera(){
    const ffmpegCmd = `loglevel quiet -re -probesize -analyzeduration 1000000` 
    const cmd =`ffmpeg -y -i "rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov" -vframes 1 do.jpg`
  }


}

export default new CameraService()
