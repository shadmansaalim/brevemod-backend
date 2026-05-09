// Imports
import OpenAI from "openai";
import config from "../config";

const createClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("OpenRouter API key is missing.");
  }

  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });
};

const apiKeys = [
  config.openRouterApiKey,
  config.openRouterApiKey2,
  config.openRouterApiKey3,
].filter(Boolean);

if (!apiKeys.length) {
  throw new Error(
    "No OpenRouter API keys found. Please check environment variables."
  );
}

export const openaiClients = apiKeys.map((key) => createClient(key as string));

// Default client
export const openai = openaiClients[0];
