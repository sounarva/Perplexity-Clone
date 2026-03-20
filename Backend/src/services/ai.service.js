import { HumanMessage, AIMessage, SystemMessage, tool, createAgent } from "langchain"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import searchInternet from "./tavily.service.js";
import * as z from 'zod'

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-3-flash-preview",
    apiKey: process.env.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
    model: "mistral-small-latest",
    apiKey: process.env.MISTRAL_API_KEY
});

const searchTool = tool(
    searchInternet,
    {
        name: "search_internet",
        description: "Search for information on the web using Tavily.",
        schema: z.object({
            query: z.string().describe("The search query.")
        })
    }
)

const agent = createAgent({
    model: mistralModel,
    tools: [searchTool],
    systemPrompt: `
                    You are an AI assistant.

                    Rules:

                    1. If the user asks about real-time information like:
                    - weather
                    - current time
                    - news
                    - live data
                    - recent events

                    Use the search_internet tool.

                    2. For normal knowledge questions, answer directly without using tools.

                    3. Always respond clearly.
                    `,

})

// export const generateResponse = async (messages) => {
//     const response = await agent.invoke({
//         messages: messages.map((msg) => {
//             if (msg.type === "user") {
//                 return new HumanMessage(msg.content)
//             } else if (msg.type === "ai") {
//                 return new AIMessage(msg.content)
//             }
//         })
//     })
//     return response.messages[response.messages.length - 1].text
// }

export const generateStreamResponse = async (messages, callback) => {
    try {
        const stream = await agent.streamEvents({
            messages: messages.map((msg) => {
                if (msg.type === "user") {
                    return new HumanMessage(msg.content)
                } else if (msg.type === "ai") {
                    return new AIMessage(msg.content)
                }
            })
        }, { version: "v2" });
        
        let fullResponse = "";
        for await (const event of stream) {
            if (event.event === "on_chat_model_stream" && event.data.chunk && event.data.chunk.content) {
                const chunkText = event.data.chunk.content;
                callback(chunkText);
                fullResponse += chunkText;
            }
        }
        return fullResponse;
    } catch (error) {
        console.error("Error in AI Stream:", error);
        throw error;
    }
}

export const generateTitle = async (message) => {
    const response = await mistralModel.invoke([
        new SystemMessage(`You are a title generator for a chat application. Generate a concise and relevant title for the given chat message. Return only the title text, without any additional formatting or explanation.`),
        new HumanMessage(`Generate a title for this chat message: ${message}`)
    ])
    return response.text
}