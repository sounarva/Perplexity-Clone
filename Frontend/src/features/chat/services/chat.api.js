import axios from "axios"
const chatAPI = axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: true
})

export const sendMessgae = async ({ message, chatId }) => {
    const response = await chatAPI.post("/api/v1/chat/message", {
        message,
        chatID: chatId
    })
    return response.data
}

export const getChats = async () => {
    const response = await chatAPI.get("/api/v1/chat/get-chats")
    return response.data
}

export const getMessages = async ({ chatId }) => {
    const response = await chatAPI.get(`/api/v1/chat/get-messages/${chatId}`)
    return response.data
}

export const editChat = async ({ chatId, title }) => {
    const response = await chatAPI.put(`/api/v1/chat/edit-chat`, {
        chatID: chatId,
        title
    })
    return response.data
}

export const deleteChat = async ({ chatId }) => {
    const response = await chatAPI.delete(`/api/v1/chat/delete-chat/${chatId}`)
    return response.data
}