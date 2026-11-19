import { askAssistant, json } from "./lib/assistant.mjs";

export default async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type", "Access-Control-Allow-Methods": "POST, OPTIONS" } };
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });
  let payload;
  try { payload = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid request body." }); }
  try {
    const reply = await askAssistant(payload.messages);
    return json(200, { reply });
  } catch (error) {
    console.error("Website chat error", error);
    const missingKey = !process.env.AI_API_KEY;
    return json(missingKey ? 503 : 502, {
      error: missingKey
        ? "AI is not configured yet. Add AI_API_KEY in Netlify environment variables."
        : "The assistant is unavailable right now. Please try again shortly.",
    });
  }
};
