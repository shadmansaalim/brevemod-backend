import OpenAI from "openai";
import { openaiClients } from "./openRouter";

type OpenAICall<T> = (client: OpenAI) => Promise<T>;

const RATE_LIMIT_CODES = new Set([429, 402, 503]);

export const withApiKeyFallback = async <T>(
  call: OpenAICall<T>
): Promise<T> => {
  let lastError: unknown;

  for (let i = 0; i < openaiClients.length; i++) {
    try {
      console.log(`Trying API key #${i + 1}...`);
      return await call(openaiClients[i]);
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      const isLimitError = RATE_LIMIT_CODES.has(status);

      // Only fall through to next key for rate-limit / quota errors
      if (isLimitError && i < openaiClients.length - 1) {
        console.warn(
          `API key #${
            i + 1
          } hit a limit (status ${status}). Falling back to key #${i + 2}...`
        );
        lastError = err;
        continue;
      }

      // Any other error (bad request, auth, etc.) — throw immediately
      throw err;
    }
  }

  throw lastError;
};
