import { generateStreamResponse, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js"
import messageModel from "../models/message.model.js"
import { getIO } from "../sockets/server.socket.js";

export const sendMessage = async (req, res) => {
    try {
        const { message, chatID } = req.body
        const userID = req.user._id
        let title = null, chat = null

        if (!message) {
            return res.status(400)
                .json({
                    success: false,
                    message: "Message and ChatID is required"
                })
        }

        if (!chatID) {
            title = await generateTitle(message)
            chat = await chatModel.create({
                user: userID,
                title
            })
        }

        const userMessgae = await messageModel.create({
            chat: chatID || chat._id,
            content: message,
            type: "user"
        })

        const messages = await messageModel.find({
            chat: chatID || chat._id
        })

        // Create an empty AI message immediately
        const aiMessage = await messageModel.create({
            chat: chatID || chat._id,
            content: " ", // empty placeholder
            type: "ai"
        })

        // Respond early and unblock the frontend
        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: {
                chat,
                aiMessage
            }
        })

        // Asynchronous Streaming
        const finalAiContent = await generateStreamResponse(messages, (chunk) => {
            getIO().to((chatID || chat._id).toString()).emit("chat_stream", {
                chunk,
                messageId: aiMessage._id,
                chatId: (chatID || chat._id).toString()
            });
        });

        // Update the aiMessage in the DB with the complete output
        await messageModel.findByIdAndUpdate(aiMessage._id, {
            content: finalAiContent
        });

    } catch (error) {
        console.log(error)
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

export const getChats = async (req, res) => {
    try {
        const userID = req.user._id
        const chats = await chatModel.find({
            user: userID
        })

        return res.status(200)
            .json({
                success: true,
                message: "Chats fetched successfully",
                data: chats
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

export const getMessages = async (req, res) => {
    try {
        const chatId = req.params.chatID
        const userID = req.user._id

        const chat = await chatModel.findOne({
            _id: chatId,
            user: userID
        })

        if (!chat) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Chat not found"
                })
        }

        const messages = await messageModel.find({
            chat: chat._id
        })

        return res.status(200)
            .json({
                success: true,
                message: "Messages fetched successfully",
                data: messages
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}

export const editChat = async (req, res) => {
    try {
        const { chatID, title } = req.body
        const userID = req.user._id

        if (!chatID || !title) {
            return res.status(400)
                .json({
                    success: false,
                    message: "ChatID and title is required"
                })
        }

        const chat = await chatModel.findOneAndUpdate({
            _id: chatID,
            user: userID
        }, {
            title
        })

        if (!chat) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Chat not found"
                })
        }

        return res.status(200)
            .json({
                success: true,
                message: "Chat edited successfully"
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal server error"
            })
    }
}

export const deleteChat = async (req, res) => {
    try {
        const chatId = req.params.chatID
        const userID = req.user._id

        const chat = await chatModel.findOneAndDelete({
            _id: chatId,
            user: userID
        })

        if (!chat) {
            return res.status(404)
                .json({
                    success: false,
                    message: "Chat not found"
                })
        }

        await messageModel.deleteMany({
            chat: chat._id
        })

        return res.status(200)
            .json({
                success: true,
                message: "Chat deleted successfully"
            })
    } catch (error) {
        return res.status(500)
            .json({
                success: false,
                message: "Internal Server Error"
            })
    }
}