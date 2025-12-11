// src/ai.js
import { createGateway, generateText } from "ai";

const gateway = createGateway({
  apiKey: import.meta.env.VITE_AI_GATEWAY_API_KEY,
});

/**
 * Send wrong answers to AI and request concise responses.
 * wrongAnswers is an array of objects: { question, userAnswer, correctAnswer }
 */
export async function askAI(wrongAnswers) {
  const systemPrompt =
    "You asked biblical question from failed answers from a quiz. Answer each failed question concisely and biblically. Use minimal tokens. If unsure, say 'Please verify with Scripture'. Always be brief and direct.";

  // Build a compact JSON payload for the AI
  const payload = {
    instruction:
      "For each failed item return a short helpful explanation (1-2 sentences). Prefer scripture references if known. Minimal tokens.",
  };

  // We pass the system prompt then the user JSON as a second message
  const prompt = ` ${systemPrompt}\n\n${JSON.stringify(payload, null, 2)}`;

  const resp = await generateText({
    model: gateway("openai/gpt-5-mini"), // adjust model identifier if needed
    prompt,
    max_tokens: 300, // limit tokens to keep it brief
    temperature: 0.2, // low creativity for accuracy
  });

  // resp.text contains the assistant output
  return resp.text || "";
}
