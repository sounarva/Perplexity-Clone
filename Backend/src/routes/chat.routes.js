import { Router } from "express"
import { authMiddleware } from "../middlewares/auth.middleware.js"
import { sendMessage, getChats, getMessages, deleteChat, editChat } from "../controllers/chat.controller.js"
const router = Router()

router.post("/message", authMiddleware, sendMessage)
router.get("/get-chats", authMiddleware, getChats)
router.get("/get-messages/:chatID", authMiddleware, getMessages)
router.put("/edit-chat", authMiddleware, editChat)
router.delete("/delete-chat/:chatID", authMiddleware, deleteChat)

export default router