"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openai = exports.openaiClients = void 0;
// Imports
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../config"));
const createClient = (apiKey) => new openai_1.default({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey,
});
exports.openaiClients = [
    createClient(config_1.default.openRouterApiKey),
    createClient(config_1.default.openRouterApiKey2),
    createClient(config_1.default.openRouterApiKey3),
];
// Default client (key 1) for non-critical use
exports.openai = exports.openaiClients[0];
