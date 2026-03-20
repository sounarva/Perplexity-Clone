import { io } from "socket.io-client"

export let socket = null;

export const initializeSocketConnection = () => {
    if (socket) return socket;
    
    socket = io("http://localhost:3000", {
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO client")
    })
    
    return socket;
}