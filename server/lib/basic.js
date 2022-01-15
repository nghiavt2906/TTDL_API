import fs from 'fs'
import { exec } from "child_process"
import Logger from "lib/logger"
import PsList from "ps-list"
import _ from "lodash"
class Basic {
  constructor() {}

  async ffmpegKill() {
    Logger.info("Killing all ffmpeg process...")
    exec("pkill -9 ffmpeg", (error, stdout, stderr) => {
      if(error){
        Logger.error(`Kill ffmpeg processes fail: ${JSON.stringify(error)}`)
        return
      }
      Logger.info("Kill all ffmpeg processes success!")
    })
  }

  async killProcess(pid) {
    // Logger.info("Killing all ffmpeg process...")
    exec(`kill -9 ${pid}`, (error, stdout, stderr) => {
      if(error){
        Logger.error(`Kill processes fail: ${JSON.stringify(error)}`)
        return
      }
      Logger.info(`Kill process ${pid} success!`)
    })
  }

  handleFolderError(err){
    if(err){
      switch(err.code){
        case "EEXIST":
          break;
        default:
          Logger.error(`Create Folder Error: ${err}`)
          break
      }
    }
  }

  file(type, directory, callback){
    switch(type){
      case 'deleteFolder':
        if(!directory) return false
        fs.rmdir(directory, {recursive: true}, (err) => {
          callback(err)
        })
    }
  }

  listProcesses = async () => {
    const processes = await PsList()
    const ffmpegProcesses = []
    processes.forEach(item => {
      if(item.name.includes('ffmpeg')){
        ffmpegProcesses.push(item)
      }
    })
    // console.log(ffmpegProcesses)
    return ffmpegProcesses
  }

  checkExistedProcess = (list, name, pid) => {
    const index = _.findIndex(list, {name, pid})
    console.log(index, pid)
    return (index > -1) ? true : false
  }
  
  checkExistedProcessByCmd = (list, camId) => {
    let result = {status: false, pid: ''}
    list.forEach(item => {
      if(item.cmd.includes(camId)){
        result = {status: true, pid: item.pid}
        return
      }
    })
    return result
  }
  
}

export default new Basic()
