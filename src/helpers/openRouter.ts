// Imports
import OpenAI from "openai";
import config from "../config";

const createClient = (apiKey: string) =>
  new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
  });

export const openaiClients = [
  createClient(config.openRouterApiKey as string),
  createClient(config.openRouterApiKey2 as string),
  createClient(config.openRouterApiKey3 as string),
];

// Default client (key 1) for non-critical use
export const openai = openaiClients[0];
