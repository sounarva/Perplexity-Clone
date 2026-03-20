import { Server } from "socket.io"

let io
export const initializeSocketIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URI,
            credentials: true
        }
    })

    io.on("connection", (socket) => {
        socket.on("join_chat", (chatId) => {
            socket.join(chatId)
        })
    })
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized")
    }
    return io
}