import { GoogleGenAI } from "@google/genai";

// Initialize the client
// NOTE: In a production app, never expose API keys on the client. 
// This is a demo environment where process.env is assumed safe or local.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const translateWord = async (word: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Translate the English word "${word}" to Chinese. 
    Provide ONLY the concise Chinese meaning(s). 
    Do not include the English word in the output. 
    If it has multiple common meanings, separate them with commas.
    Example output: 社会学`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return "翻译失败，请重试";
  }
};
