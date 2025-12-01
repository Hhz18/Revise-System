import { GoogleGenAI } from "@google/genai";
import { LLM_PROVIDERS, LS_KEYS } from '../constants';

const getGeminiClient = () => {
  let apiKey = '';
  try {
    apiKey = process.env.API_KEY || '';
  } catch (e) {
    console.error("Environment variable access error:", e);
  }
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey: apiKey });
};

const getThirdPartyKey = (provider: string): string => {
  if (provider === 'deepseek') return localStorage.getItem(LS_KEYS.API_KEY_DEEPSEEK) || '';
  if (provider === 'moonshot') return localStorage.getItem(LS_KEYS.API_KEY_MOONSHOT) || '';
  return '';
};

const callOpenAICompatible = async (
  endpoint: string, 
  apiKey: string, 
  model: string, 
  messages: any[], 
  jsonMode: boolean = false
): Promise<string> => {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };

  const body: any = {
    model: model,
    messages: messages,
    temperature: 0.3,
  };

  if (jsonMode) {
    body.response_format = { type: "json_object" };
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API Error: ${response.status} - ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
};

export const translateWord = async (word: string, modelConfigId: string): Promise<string> => {
  const config = LLM_PROVIDERS.find(p => p.id === modelConfigId) || LLM_PROVIDERS[0];

  try {
    // 1. Google Gemini
    if (config.provider === 'google') {
      const ai = getGeminiClient();
      if (!ai) return "错误：未配置 Google API Key";
      
      const prompt = `Translate the English word "${word}" to Chinese. 
      Provide ONLY the concise Chinese meaning(s). 
      Do not include the English word in the output. 
      If it has multiple common meanings, separate them with commas.`;
      
      const response = await ai.models.generateContent({
        model: config.modelId,
        contents: prompt,
      });
      return response.text?.trim() || "翻译失败";
    }

    // 2. Third Party (DeepSeek / Moonshot)
    const apiKey = getThirdPartyKey(config.provider);
    if (!apiKey) return "错误：请点击齿轮图标配置 API Key";

    const endpoint = config.provider === 'deepseek' 
      ? 'https://api.deepseek.com/chat/completions' 
      : 'https://api.moonshot.cn/v1/chat/completions';

    const prompt = `Translate the English word "${word}" to Chinese. Provide ONLY the concise Chinese meaning(s). Separate multiple meanings with commas.`;
    
    const content = await callOpenAICompatible(endpoint, apiKey, config.modelId, [
        { role: 'user', content: prompt }
    ]);
    return content.trim();

  } catch (error) {
    console.error("Translation error:", error);
    return "翻译失败";
  }
};

export const translateBatch = async (words: string[], modelConfigId: string): Promise<Record<string, string>> => {
  if (words.length === 0) return {};
  const config = LLM_PROVIDERS.find(p => p.id === modelConfigId) || LLM_PROVIDERS[0];

  const systemPrompt = `You are a translator. Output ONLY valid JSON. Key: English word, Value: Chinese translation. Concise.`;
  const userPrompt = `Words: ${JSON.stringify(words)}`;

  try {
    // 1. Google Gemini
    if (config.provider === 'google') {
      const ai = getGeminiClient();
      if (!ai) return {};
      
      const prompt = `${systemPrompt}\n${userPrompt}`;
      const response = await ai.models.generateContent({
        model: config.modelId,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });
      return JSON.parse(response.text || "{}");
    }

    // 2. Third Party
    const apiKey = getThirdPartyKey(config.provider);
    if (!apiKey) return {}; // Fail silently or handle UI error elsewhere

    const endpoint = config.provider === 'deepseek' 
      ? 'https://api.deepseek.com/chat/completions' 
      : 'https://api.moonshot.cn/v1/chat/completions';

    const content = await callOpenAICompatible(
      endpoint, apiKey, config.modelId,
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      true // Enable JSON mode if supported, otherwise system prompt helps
    );
    
    // Cleanup markdown if present (DeepSeek sometimes wraps in ```json ... ```)
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanContent);

  } catch (error) {
    console.error("Batch translation error:", error);
    return {};
  }
};