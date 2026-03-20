import "dotenv/config"
import app from "./src/app.js"
import connectToDatabase from "./src/config/database.js"
import http from "http"
import { initializeSocketIO } from "./src/sockets/server.socket.js"

const httpServer = http.createServer(app)
initializeSocketIO(httpServer)

connectToDatabase()
    .then(() => {
        httpServer.listen(3000, () => {
            console.log("Server is running on port 3000")
        })
    })
    .catch((error) => {
        console.log("Failed to connect to database", error)
    })