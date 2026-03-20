import { io } from "socket.io-client"

export let socket = null;

export const initializeSocketConnection = () => {
    if (socket) return socket;
    
    socket = io("", {
        withCredentials: true
    })

    socket.on("connect", () => {
        console.log("Connected to Socket.IO client")
    })
    
    return socket;
}