import express from "express";
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import cookieParser from "cookie-parser"
import path from "path"

const app = express()
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())
app.use(express.static('./public'))
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chat", chatRoutes)
app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

export default app