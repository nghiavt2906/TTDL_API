import { io } from "socket.io-client"
import store from "src/store"
import {
  handleNewNotification,
  syncNumberOfNotification,
} from "src/store/actions/action_noti_info_user"

const SOCKET_SERVER = "http://localhost:4000"
const RECONNECTION_ATTEMPTS = 10
const RECONNECTION_DELAY = 1000
const RECONNECTION_DELAY_MAX = 5000

console.log(store.getState())
class WS {
  constructor() {
    this.io = null
  }

  initialize() {
    this.io = io(SOCKET_SERVER, {
      reconnectionAttempts: RECONNECTION_ATTEMPTS,
      reconnectionDelay: RECONNECTION_DELAY,
      reconnectionDelayMax: RECONNECTION_DELAY_MAX,
      auth: {
        token: "FTP_CLIENT_SOCKET",
      },
    })

    this.listen()
  }

  listen() {
    this.io.on("notification", (args) => {
      store.dispatch(handleNewNotification())
    })

    this.io.on("setNumberOfNotificationToZero", () => {
      store.dispatch(syncNumberOfNotification())
    })
  }

  syncNumberOfNotification(userId) {
    this.io.emit("syncNumberOfNotification", userId)
  }



  disconnect() {
    this.io.disconnect()
  }
}

export default WS
