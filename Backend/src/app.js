import express from "express";
import morgan from "morgan"
import authRoutes from "./routes/auth.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import cookieParser from "cookie-parser"
import cors from "cors"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(morgan("dev"))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/chat", chatRoutes)

export default app