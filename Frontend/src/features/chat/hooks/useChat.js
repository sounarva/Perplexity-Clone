import { initializeSocketConnection, socket } from "../services/chat.socket";
import { setChats, setCurrentChatId, setLoading, setError, addNewChat, addNewMessage, appendMessageChunk, addMessages, modifyChat, removeChat } from "../chat.slice"
import { sendMessgae, getChats, getMessages, deleteChat, editChat } from "../services/chat.api"
import { useDispatch } from "react-redux";

export const useChat = () => {
    const dispatch = useDispatch()

    const setupStreamListener = () => {
        if (!socket) return;
        socket.off("chat_stream");
        socket.on("chat_stream", (data) => {
            const { chunk, chatId } = data;
            dispatch(appendMessageChunk({ chatId, chunk }));
        });
    };

    const sendMessageAPI = async ({ message, chatId, tempChatId }) => {
        try {
            dispatch(setLoading(true))
            const response = await sendMessgae({ message, chatId })
            const { chat, aiMessage } = response.data

            if (tempChatId) {
                dispatch(removeChat({ chatId: tempChatId }))
                dispatch(addNewChat({
                    chatId: chat._id,
                    title: chat.title
                }))
                dispatch(addNewMessage({
                    chatId: chat._id,
                    content: message,
                    type: "user"
                }))
                dispatch(addNewMessage({
                    chatId: chat._id,
                    content: aiMessage.content,
                    type: aiMessage.type
                }))
                dispatch(setCurrentChatId(chat._id))
                socket?.emit("join_chat", chat._id)
            } else {
                dispatch(addNewMessage({
                    chatId: chatId,
                    content: aiMessage.content,
                    type: aiMessage.type
                }))
                dispatch(setCurrentChatId(chatId))
            }
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const getChatsAPI = async () => {
        try {
            dispatch(setLoading(true))
            const response = await getChats()
            const chats = response.data
            dispatch(setChats(chats.reduce((acc, chat) => {
                acc[chat._id] = {
                    id: chat._id,
                    title: chat.title,
                    messages: [],
                    lastUpdatedAt: chat.updatedAt
                }
                return acc
            }, {})))
        } catch (error) {
            dispatch(setError(error.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

    const getMessagesAPI = async ({ chatId }) => {
        try {
            const response = await getMessages({ chatId })
            const messages = response.data
            const formattedMessages = messages.map((msg) => {
                return {
                    content: msg.content,
                    type: msg.type
                }
            })
            dispatch(addMessages({
                chatId,
                messages: formattedMessages
            }))
            dispatch(setCurrentChatId(chatId))
            socket?.emit("join_chat", chatId)
        } catch (error) {
            dispatch(setError(error.message))
        }
    }

    const editChatAPI = async ({ chatId, title }) => {
        try {
            await editChat({ chatId, title })
            dispatch(modifyChat({
                chatId,
                title
            }))
        } catch (error) {
            console.log(error)
        }
    }

    const deleteChatAPI = async ({ chatId }) => {
        try {
            await deleteChat({ chatId })
            dispatch(removeChat({
                chatId
            }))
        } catch (error) {
            console.log(error)
        }
    }

    return {
        initializeSocketConnection,
        setupStreamListener,
        sendMessageAPI,
        getChatsAPI,
        getMessagesAPI,
        editChatAPI,
        deleteChatAPI
    }
}