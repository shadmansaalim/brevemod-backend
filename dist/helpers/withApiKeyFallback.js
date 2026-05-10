"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withApiKeyFallback = void 0;
const openRouter_1 = require("./openRouter");
const RATE_LIMIT_CODES = new Set([429, 402, 503]);
const withApiKeyFallback = (call) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!(openRouter_1.openaiClients === null || openRouter_1.openaiClients === void 0 ? void 0 : openRouter_1.openaiClients.length)) {
        throw new Error("No OpenAI clients are configured.");
    }
    let lastError;
    for (let i = 0; i < openRouter_1.openaiClients.length; i++) {
        try {
            console.log(`Trying API key #${i + 1}...`);
            const response = yield call(openRouter_1.openaiClients[i]);
            if (!response) {
                throw new Error(`Empty response from API key #${i + 1}`);
            }
            return response;
        }
        catch (err) {
            const status = (_a = err === null || err === void 0 ? void 0 : err.status) !== null && _a !== void 0 ? _a : (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status;
            const message = (err === null || err === void 0 ? void 0 : err.message) || "Unknown error while calling OpenRouter.";
            console.error(`API key #${i + 1} failed:`, {
                status,
                message,
            });
            const isLimitError = RATE_LIMIT_CODES.has(status);
            // Try next key only for rate limit / quota / temporary errors
            if (isLimitError && i < openRouter_1.openaiClients.length - 1) {
                console.warn(`API key #${i + 1} hit a limit (status ${status}). Falling back to key #${i + 2}...`);
                lastError = err;
                continue;
            }
            // Throw immediately for non-rate-limit errors
            throw err;
        }
    }
    console.error("All OpenAI API keys failed.");
    throw (lastError ||
        new Error("All OpenAI API keys failed. Unable to complete request."));
});
exports.withApiKeyFallback = withApiKeyFallback;
