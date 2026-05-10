"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = exports.openaiClients = void 0;
// Imports
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const createClient = (apiKey) => {
    if (!apiKey) {
        throw new Error("OpenRouter API key is missing.");
    }
    return new openai_1.default({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey,
    });
};
const apiKeys = [
    config_1.default.openRouterApiKey,
    config_1.default.openRouterApiKey2,
    config_1.default.openRouterApiKey3,
].filter(Boolean);
if (!apiKeys.length) {
    throw new Error("No OpenRouter API keys found. Please check environment variables.");
}
exports.openaiClients = apiKeys.map((key) => createClient(key));
// Default client
exports.openai = exports.openaiClients[0];
