import path from "path"
import winston from "winston"
import 'winston-daily-rotate-file'

function getStackInfo() {
  const stacklist = new Error().stack.split("\n")
  // console.log(stacklist)
  let stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
  let stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

  let s = stacklist[0]
  let sp = stackReg.exec(s) || stackReg2.exec(s)

  if (sp && sp.length === 5) {
    let relativePath = path.relative(path.join(__dirname, "../../"), sp[2]),
      line = sp[3]
    let filename_line = relativePath + ":" + line
    return filename_line
  }
}

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  if(typeof message === 'object' ){
    message = JSON.stringify(message, null, ' ')
  }
  return `[${timestamp}][${level}] ${message}`
})

const Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json(),
    customFormat
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename: path.join(__dirname, '..', 'logs', `%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      prepend: true,
      json: false
    })
  ]
})

export default Logger
