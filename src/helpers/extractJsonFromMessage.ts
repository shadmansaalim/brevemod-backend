export const extractJsonFromMessage = (message: any) => {
  try {
    if (!message) {
      console.warn("No message provided for JSON extraction.");
      return [];
    }

    const content = message?.content;

    if (!content || typeof content !== "string") {
      console.warn("Invalid message content.");
      return [];
    }

    // 1. Try extracting ```json block
    const jsonBlockMatch = content.match(/```json([\s\S]*?)```/);

    if (jsonBlockMatch?.[1]) {
      try {
        return JSON.parse(jsonBlockMatch[1].trim());
      } catch (error) {
        console.error("Failed parsing JSON code block:", error);
      }
    }

    // 2. Direct JSON response
    const trimmedContent = content.trim();

    if (trimmedContent.startsWith("[") || trimmedContent.startsWith("{")) {
      try {
        return JSON.parse(trimmedContent);
      } catch (error) {
        console.error("Failed parsing direct JSON:", error);
      }
    }

    // 3. Fallback JSON extraction
    const jsonFallbackMatch = content.match(/(\[[\s\S]*\]|\{[\s\S]*\})/);

    if (jsonFallbackMatch?.[1]) {
      try {
        return JSON.parse(jsonFallbackMatch[1]);
      } catch (error) {
        console.error("Failed parsing fallback JSON:", error);
      }
    }

    console.warn("No valid JSON found in AI response.");

    return [];
  } catch (error) {
    console.error("Error extracting JSON from AI response:", error);
    return [];
  }
};
