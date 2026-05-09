import OpenAI from "openai";
import { openaiClients } from "./openRouter";

type OpenAICall<T> = (client: OpenAI) => Promise<T>;

const RATE_LIMIT_CODES = new Set([429, 402, 503]);

export const withApiKeyFallback = async <T>(
  call: OpenAICall<T>
): Promise<T> => {
  if (!openaiClients?.length) {
    throw new Error("No OpenAI clients are configured.");
  }

  let lastError: unknown;

  for (let i = 0; i < openaiClients.length; i++) {
    try {
      console.log(`Trying API key #${i + 1}...`);

      const response = await call(openaiClients[i]);

      if (!response) {
        throw new Error(`Empty response from API key #${i + 1}`);
      }

      return response;
    } catch (err: any) {
      const status = err?.status ?? err?.response?.status;
      const message = err?.message || "Unknown error while calling OpenRouter.";

      console.error(`API key #${i + 1} failed:`, {
        status,
        message,
      });

      const isLimitError = RATE_LIMIT_CODES.has(status);

      // Try next key only for rate limit / quota / temporary errors
      if (isLimitError && i < openaiClients.length - 1) {
        console.warn(
          `API key #${
            i + 1
          } hit a limit (status ${status}). Falling back to key #${i + 2}...`
        );

        lastError = err;
        continue;
      }

      // Throw immediately for non-rate-limit errors
      throw err;
    }
  }

  console.error("All OpenAI API keys failed.");

  throw (
    lastError ||
    new Error("All OpenAI API keys failed. Unable to complete request.")
  );
};
