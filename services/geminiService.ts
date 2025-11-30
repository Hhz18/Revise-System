import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  let apiKey = '';
  try {
    apiKey = process.env.API_KEY || '';
  } catch (e) {
    console.error("Environment variable access error:", e);
  }

  if (!apiKey) {
    console.error("API_KEY is missing.");
    return null;
  }
  return new GoogleGenAI({ apiKey: apiKey });
};

export const translateWord = async (word: string): Promise<string> => {
  try {
    const ai = getClient();
    if (!ai) return "配置错误：未找到 API_KEY";
    
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

    return response.text?.trim() || "翻译失败";
  } catch (error) {
    console.error("Translation error details:", error);
    return "翻译失败";
  }
};

export const translateBatch = async (words: string[]): Promise<Record<string, string>> => {
  if (words.length === 0) return {};

  try {
    const ai = getClient();
    if (!ai) return {};

    const model = 'gemini-2.5-flash';
    // Create a JSON schema-like prompt logic manually or imply it via system instructions
    // Since we want a map of Word -> Translation
    const prompt = `
      You are a translation engine. 
      Translate the following English words to Chinese.
      Return a raw JSON object where the key is the English word and the value is the Chinese translation.
      Concise meanings only. Separate multiple meanings with commas.
      Do not use Markdown code blocks. Just the raw JSON string.
      
      Words to translate:
      ${JSON.stringify(words)}
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text || "{}";
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse batch JSON", e);
      return {};
    }
  } catch (error) {
    console.error("Batch translation error:", error);
    return {};
  }
};