import { GoogleGenAI } from "@google/genai";
import env from "../config/env";

export async function getShortTitle(reddittTitle: string, subreddit: string) {
    const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `for this ${reddittTitle} reddit post from ${subreddit} just give only one catchy title without bolding preferably make it resemble the given reddit title, the title should be aimed to get more views`,
    });
    return response.text

}


