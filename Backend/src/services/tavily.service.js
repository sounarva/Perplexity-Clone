import { tavily } from "@tavily/core";

const tvly = tavily({
    apiKey: process.env.TAVILY_API_KEY,
});

const searchInternet = async ({ query }) => {
    try {
        console.log("Searching the internet for:", query);
        const response = await tvly.search(query, {
            max_results: 5,
            searchDepth: "advanced"
        });
        return JSON.stringify(response);
    } catch (error) {
        console.error("Error searching the internet:", error);
        throw error;
    }
}

export default searchInternet