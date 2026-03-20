import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// 🔥 fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ static serve
app.use(express.static("./public"));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);

// ✅ fallback route (React)
app.use("*name", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"))
})

export default app;