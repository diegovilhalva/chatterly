import { Server } from "socket.io"
import http from "http"
import express from "express"
import "dotenv/config"
import { socketAuthMiddleware } from "../middleware/socket.middleware.js"
import User from "../models/user.model.js"


const app = express()


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL],
        credentials: true
    },

})

io.use(socketAuthMiddleware)

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}

const userSocketMap = {}


io.on("connection", (socket) => {
   
    const userId = socket.userId
    userSocketMap[userId] = socket.id

    io.emit("getOnlineUsers", Object.keys(userSocketMap))


    socket.on("disconnect", async() => {
        delete userSocketMap[userId]
          try {
            await User.findByIdAndUpdate(userId, { lastSeen: new Date() })
        } catch (err) {
            console.error("Erro ao atualizar lastSeen:", err)
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })
})


export { io, app, server }