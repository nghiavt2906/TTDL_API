import WebSocket from "ws"
import Logger from "lib/logger"
import HTTPService from "../http"
import { Server } from "socket.io"
import app from "app"

class WS {
  constructor() {
    this.io = null
  }

  async initialize(httpServer) {
    if (this.io) {
      Logger.error("Lỗi rồi T.T")
      return
    }
    await app.ManagerSocket.deleteAll()
    this.io = new Server(httpServer, {
      allowEIO3: true,
      cors: {
        origin: "http://localhost:8080",
        // methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        // credentials: true
      },
    })
    this.io.on("connection", async function (socket) {
      console.log(
        `Socket ${socket.id}, ${socket.handshake.auth.token} is connected`
      )
      const socketId = socket.id
      const managerId = socket.handshake.auth.token
      await app.ManagerSocket.create(managerId, socketId)
      await app.Manager.updateSocketStatus(managerId, 1)

      socket.on("syncNumberOfNotification", async function (managerId) {
        const sockets = await app.ManagerSocket.getByManagerId(managerId)
        const socketIds = sockets.map((socket) => socket.socketId)
        if (socketIds.length > 0) {
          socket.to(socketIds).emit("setNumberOfNotificationToZero")
        }
      })

      socket.on("sendNotificationToManager", async function (managerId) {})

      socket.on("sendNotificationToManager", async function (managerId) {
        const sockets = await app.ManagerSocket.getByManagerId(managerId)

        const socketIds = sockets.map((socket) => socket.socketId)
        if (socketIds.length > 0) {
          socket.to(socketIds).emit("notification", "notification")
        }
      })

      socket.on("disconnect", async (reason) => {
        const { managerId } = await app.ManagerSocket.getManagerIdBySocketId(
          socket.id
        )
        await app.ManagerSocket.delete(socket.id)
        const status = await app.ManagerSocket.checkManagerConnectSocket(
          socket.id
        )
        await app.Manager.updateSocketStatus(managerId, status)
        console.log(reason, socket.id) // "ping timeout"
      })
    })
  }

  async emit(managerId, data) {
    const sockets = await app.ManagerSocket.getByManagerId(managerId)
    const socketIds = sockets.map((socket) => socket.socketId)
    if (socketIds.length > 0) {
      this.io.to(socketIds).emit("notification", data)
    }
  }

  emitUpdateCamera(camId){
    this.io.emit('updateCamera', camId)
  }

  emitCreateCamera(camId){
    this.io.emit('createCamera', camId)
  }

  emitDeleteCamera(camId){
    this.io.emit('deleteCamera', camId)
  }
}

export default new WS()
