import schedule from "node-schedule"
import app from "app"
import configs from "configs"

let SOCKET_CONNECTION_CHECK = 0
let FTP_SOCKET_CONNECTION_CHECK = 0

class BackgroundJobs {
  checkSocketConnectionToCameraServer() {
    schedule.scheduleJob("*/5 * * * *", async function () {
      SOCKET_CONNECTION_CHECK = SOCKET_CONNECTION_CHECK + 1
      const result = await app.ManagerSocket.getByManagerId(
        "CAMERA_SOCKET_CLIENT"
      )
      if (result.length > 0) {
        FTP_SOCKET_CONNECTION_CHECK = 0
        return
      }
      console.log("Camera Server mat ket noi")
      if (SOCKET_CONNECTION_CHECK % 12 === 0) {
        const receiverList = await app.Email.getReceiverByPermission(
          "get_system_error_alert"
        )
        let emailStatus = await app.System.findSystemInfo("1", [
          "emailAlertStatus",
        ])
        emailStatus = emailStatus[0].value
        if (receiverList !== null && emailStatus === "1") {
          app.Email.sendMail({
            subject: "Mất connect đến server Camera",
            content: `<p>Kính gửi: anh/chị phụ trách theo dõi hệ thống Quan trắc môi trường Đà Nẵng</p>\
                       </br>\
                       <p>Hiện tại, Server App (IP: ${configs.server.host}) mất kết nối đến Server Camera (IP: ${configs.cameraServer.host}). Xin anh/chị hãy kiểm tra hệ thống!</p>\
                       </br>\
                       <p>Trân trọng,</p>\
                       <p>Trung tâm Quan trắc môi trường Đà Nẵng.</p>`,
            receiver: receiverList,
          })
        }
      }
    })
  }

  checkSocketConnectionToFtpServer() {
    schedule.scheduleJob("*/5 * * * *", async function () {
      FTP_SOCKET_CONNECTION_CHECK = FTP_SOCKET_CONNECTION_CHECK + 1
      const result = await app.ManagerSocket.getByManagerId("FTP_SOCKET_CLIENT")
      if (result.length > 0) {
        FTP_SOCKET_CONNECTION_CHECK = 0
        return
      }
      console.log("FTP Server mat ket noi")
      if (FTP_SOCKET_CONNECTION_CHECK % 6 === 0) {
        const receiverList = await app.Email.getReceiverByPermission(
          "get_system_error_alert"
        )
        let emailStatus = await app.System.findSystemInfo("1", [
          "emailAlertStatus",
        ])
        emailStatus = emailStatus[0].value
        if (receiverList !== null && emailStatus === "1") {
          app.Email.sendMail({
            subject: "Mất connect đến server FTP",
            content: `<p>Kính gửi: anh/chị phụ trách theo dõi hệ thống Quan trắc môi trường Đà Nẵng</p>\
                       </br>\
                       <p>Hiện tại, Server App (IP: ${configs.server.host}) mất kết nối đến Server FTP (IP: ${configs.ftpServer.host}). Xin anh/chị hãy kiểm tra hệ thống!</p>\
                       </br>\
                       <p>Trân trọng,</p>\
                       <p>Trung tâm Quan trắc môi trường Đà Nẵng.</p>`,
            receiver: receiverList,
          })
        }
      }
    })
  }

  cleanUpNotifications() {
    schedule.scheduleJob("*/5 * * * *", async function () {
      await app.ManagerNotifications.cleanUpNotifications()
    })
  }
}

export default BackgroundJobs
