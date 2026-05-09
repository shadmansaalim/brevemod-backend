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
    let lastError;
    for (let i = 0; i < openRouter_1.openaiClients.length; i++) {
        try {
            console.log(`Trying API key #${i + 1}...`);
            return yield call(openRouter_1.openaiClients[i]);
        }
        catch (err) {
            const status = (_a = err === null || err === void 0 ? void 0 : err.status) !== null && _a !== void 0 ? _a : (_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.status;
            const isLimitError = RATE_LIMIT_CODES.has(status);
            // Only fall through to next key for rate-limit / quota errors
            if (isLimitError && i < openRouter_1.openaiClients.length - 1) {
                console.warn(`API key #${i + 1} hit a limit (status ${status}). Falling back to key #${i + 2}...`);
                lastError = err;
                continue;
            }
            // Any other error (bad request, auth, etc.) — throw immediately
            throw err;
        }
    }
    throw lastError;
});
exports.withApiKeyFallback = withApiKeyFallback;
