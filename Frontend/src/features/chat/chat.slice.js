import { createSlice } from "@reduxjs/toolkit"

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chats: {},
        currentChatId: null,
        isDarkMode: true,
        loading: false,
        error: null,
    },
    reducers: {
        addNewChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId] = {
                id: chatId,
                title,
                messages: [],
                lastUpdatedAt: new Date().toISOString()
            }
        },
        addNewMessage: (state, action) => {
            const { chatId, content, type } = action.payload
            state.chats[chatId].messages.push({
                content,
                type
            })
        },
        appendMessageChunk: (state, action) => {
            const { chatId, chunk } = action.payload
            if (state.chats[chatId] && state.chats[chatId].messages.length > 0) {
                const lastMessageIndex = state.chats[chatId].messages.length - 1;
                state.chats[chatId].messages[lastMessageIndex].content += chunk;
            }
        },
        addMessages: (state, action) => {
            const { chatId, messages } = action.payload
            state.chats[chatId].messages = messages
        },
        modifyChat: (state, action) => {
            const { chatId, title } = action.payload
            state.chats[chatId].title = title
            state.chats[chatId].lastUpdatedAt = new Date().toISOString()
        },
        removeChat: (state, action) => {
            const { chatId } = action.payload
            delete state.chats[chatId]
            if (state.currentChatId === chatId) {
                state.currentChatId = null
            }
        },
        setChats: (state, action) => {
            state.chats = action.payload
        },
        setCurrentChatId: (state, action) => {
            state.currentChatId = action.payload
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setError: (state, action) => {
            state.error = action.payload
        },
        toggleDarkMode: (state) => {
            state.isDarkMode = !state.isDarkMode
        }
    }
})

export const {
    addNewChat,
    addNewMessage,
    appendMessageChunk,
    addMessages,
    modifyChat,
    removeChat,
    setChats,
    setCurrentChatId,
    setLoading,
    setError,
    toggleDarkMode
} = chatSlice.actions
export default chatSlice.reducer

/*
chats: {
    chatId:{
        id: "",
        title:"",
        messages: [
            {
                type: "user",
                content: ""
            },
            {
                type: "ai",
                content: ""
            },
        ]
    }
}
*/