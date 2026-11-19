import { askAssistant } from "./lib/assistant.mjs";

const json = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default async (event) => {
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return json(503, { error: "Telegram bot is not configured." });
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && event.headers["x-telegram-bot-api-secret-token"] !== expectedSecret) {
    return json(401, { error: "Invalid webhook secret." });
  }
  let update;
  try { update = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid JSON." }); }
  const message = update.message;
  const chatId = message?.chat?.id;
  const text = message?.text;
  if (!chatId || !text || text.startsWith("/start")) {
    if (chatId && text?.startsWith("/start")) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: "ආයුබෝවන්! මම Mr Pabasara Malinda AI. මට සිංහලෙන් හෝ English වලින් පණිවිඩයක් එවන්න." }),
      });
    }
    return json(200, { ok: true });
  }
  try {
    const reply = await askAssistant([{ role: "user", content: text }]);
    const sent = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply.slice(0, 4000) }),
    });
    if (!sent.ok) throw new Error("Telegram send failed.");
    return json(200, { ok: true });
  } catch (error) {
    console.error("Telegram webhook error", error);
    return json(200, { ok: true });
  }
};
