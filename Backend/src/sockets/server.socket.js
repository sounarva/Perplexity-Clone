import { Server } from "socket.io"

let io
export const initializeSocketIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    })

    console.log("Socket.IO initialized")

    io.on("connection", (socket) => {
        console.log("A user connected", socket.id)

        socket.on("join_chat", (chatId) => {
            socket.join(chatId)
            console.log(`User ${socket.id} joined chat: ${chatId}`)
        })
    })
}

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized")
    }
    return io
}