import { Server } from "socket.io"
import http from "http"
import express from "express"
import "dotenv/config"
import { socketAuthMiddleware } from "../middleware/socket.middleware.js"
import User from "../models/user.model.js"
import Message from "../models/message.model.js"

const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL, 
];

const app = express()


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
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

    socket.on("markAsRead", async ({ fromUserId }) => {
        try {
            await Message.updateMany(
                { senderId: fromUserId, receiverId: userId, status: { $ne: "read" } },
                { $set: { status: "read" } }
            );

            const senderSocketId = getReceiverSocketId(fromUserId);
            if (senderSocketId) {
                io.to(senderSocketId).emit("messagesRead", { readerId: userId });
            }
            io.to(userSocketMap[userId]).emit("messagesRead", { readerId: userId })
        } catch (err) {
            console.error("Erro ao marcar como lida:", err);
        }
    })
    socket.on("editMessage", async ({ messageId, text, image }) => {
        try {
            let message = await Message.findById(messageId);
            if (!message) return;

            // só o remetente pode editar
            if (message.senderId.toString() !== userId.toString()) return;

            if (text !== undefined) message.text = text;
            if (image !== undefined) message.image = image;
            message.edited = true;
            await message.save();

            const payload = { messageId, text: message.text, image: message.image, edited: true };

            // enviar atualização para remetente e destinatário
            const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
            if (receiverSocketId) io.to(receiverSocketId).emit("messageEdited", payload);
            io.to(socket.id).emit("messageEdited", payload);
        } catch (err) {
            console.error("Erro ao editar mensagem:", err);
        }
    });

    socket.on("deleteMessage", async ({ messageId }) => {
        try {
            let message = await Message.findById(messageId);
            if (!message) return;

            if (message.senderId.toString() !== userId.toString()) return;

            message.deleted = true;
            message.text = null;
            message.image = null;
            await message.save();

            const payload = { messageId, deleted: true };

            const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
            if (receiverSocketId) io.to(receiverSocketId).emit("messageDeleted", payload);
            io.to(socket.id).emit("messageDeleted", payload);
        } catch (err) {
            console.error("Erro ao deletar mensagem:", err);
        }
    });

    
    socket.on("typing", ({ toUserId }) => {
        const receiverSocketId = getReceiverSocketId(toUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userTyping", { fromUserId: userId });
        }
    });

    
    socket.on("stopTyping", ({ toUserId }) => {
        const receiverSocketId = getReceiverSocketId(toUserId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("userStoppedTyping", { fromUserId: userId });
        }
    });


    socket.on("disconnect", async () => {
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