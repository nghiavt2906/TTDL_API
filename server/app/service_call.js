import http from 'http'
import config from 'configs'
import app from 'app'
import { newId } from "models/utils"
import queryString from 'querystring'
import moment from 'moment'

export default class ServiceCall {
  constructor() {}

  callFtpService = () => {
    return new Promise((resolve, reject) => {
      let responseString = ''
      const options = {
        host: config.ftpServer.host,
        // host: '103.101.76.241',
        port: config.ftpServer.port,
        // port: 4000,
        path: `/api/checkService/ftp`,
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
      const request = http.request(options, function (response) {
        response.setEncoding("utf8")
        response.on("data", function (chunk) {
          responseString += chunk
        })
        response.on("end", function () {
          if(responseString.includes('OK')){
            resolve(true)
          }
          resolve(false)
        })
        
      })
      request.on('error', (e) => {
        // app.Email.handleDisconnectFtpService()
        // console.log(e)
        resolve(false)
      });
      request.write(responseString)
      request.end()
      // resolve(true)
    })
  }

  callCameraService = () => {
    return new Promise((resolve, reject) => {
      let responseString = ''
      const options = {
        host: config.cameraServer.host,
        port: config.cameraServer.port,
        path: `/api/checkService/camera`,
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
      const request = http.request(options, function (response) {
        response.setEncoding("utf8")
        response.on("data", function (chunk) {
          responseString += chunk
        })
        response.on("end", function () {
          if(responseString.includes('OK')){
            resolve(true)
          }
          resolve(false)
        })
      })
      request.on('error', (e) => {
        resolve(false)
      });
      request.write(responseString)
      request.end()
    })
  }

  callGetSampleService = (sampleInfo, stationId, managerId) => {
    return new Promise((resolve, reject) => {
      try{
        const sampleId = newId()
        let responseString = ''
        const data = queryString.stringify({
          username: sampleInfo.username,
          password: sampleInfo.password,
          id: sampleId
        })
  
        const options = {
          host: sampleInfo.host,
          port: sampleInfo.port,
          path: "/getSample",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(data),
          },
        }
  
        // console.log({data, options})
        const request = http.request(options, function (response) {
          response.setEncoding("utf8")
          response.on("data", function (chunk) {
            responseString += chunk
          })
          response.on("end", async function () {
            console.log( responseString)
            const responseBody = JSON.parse(responseString)
            if(responseBody.data === 'GET SAMPLE SUCCESS'){
              const sampleAt = moment().utc(7).format()
              await app.SampleHistory.createHistory(stationId, managerId, sampleId, sampleAt)
              resolve(true)
            } else {
              resolve(false)
            }
          })
        })
        request.on("error", function (error) {
          resolve(false)
        })
        request.write(data)
        request.end()
      } catch(err){
        console.log('No nhay zo day')
        resolve(false)
      }
    })
  }
}
