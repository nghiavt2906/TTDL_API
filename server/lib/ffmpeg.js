import { spawn, exec } from "child_process"
import ffmpegStatic from "ffmpeg-static"
import Logger from "lib/logger"
import config from "configs"

class FFmpeg {
  constructor() {
    this.ffmpegStaticPath = ffmpegStatic.path
  }

  createFFmpegProcess(cam) {
    // Logger.info(`Spawn ffmpeg process for camera ${cam.id}`)
    // console.log(cam.id, cam.rtspLink)
    const ffmpegCommand = [
      "-loglevel",
      "warning",
      "-progress",
      "pipe:5",
      "-analyzeduration",
      1000000,
      "-probesize",
      1000000,
      "-fflags",
      "+igndts",
      "-rtsp_transport",
      "tcp",
      "-i",
      `${cam.rtspLink}`,
      "-preset",
      "ultrafast",
      "-an",
      "-c:v",
      "copy",
      "-f",
      "hls",
      "-strict",
      "-2",
      "-hls_time",
      2,
      "-hls_list_size",
      3,
      "-start_number",
      0,
      "-hls_allow_cache",
      0,
      "-hls_flags",
      "+delete_segments+omit_endlist",
      `${config.streamDir}/${cam.id}/s.m3u8`
    ]
    // console.log('==>', this.ffmpegStaticPath)
    return spawn(this.ffmpegStaticPath, ffmpegCommand)
  }

  listProcess = () => {
    exec('tasklist', (err, stdout, stderr) => {
      // console.log(stdout)
    })
  }

  isRunning = (query, cb) => {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32' : cmd = `tasklist`; break;
        case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        case 'linux' : cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
  }
}

export default new FFmpeg()