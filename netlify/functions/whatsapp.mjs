import crypto from "node:crypto";
import { askAssistant } from "./lib/assistant.mjs";

const json = (statusCode, body) => ({ statusCode, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

function validSignature(rawBody, signature, appSecret) {
  if (!appSecret || !signature?.startsWith("sha256=")) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", appSecret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async (event) => {
  if (event.httpMethod === "GET") {
    const q = event.queryStringParameters || {};
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
    if (q["hub.mode"] === "subscribe" && verifyToken && q["hub.verify_token"] === verifyToken) {
      return { statusCode: 200, body: q["hub.challenge"] || "" };
    }
    return { statusCode: 403, body: "Verification failed." };
  }
  if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed." });
  const rawBody = event.body || "";
  if (!validSignature(rawBody, event.headers["x-hub-signature-256"], process.env.WHATSAPP_APP_SECRET)) {
    return json(401, { error: "Invalid webhook signature." });
  }
  let payload;
  try { payload = JSON.parse(rawBody); } catch { return json(400, { error: "Invalid JSON." }); }
  const value = payload.entry?.[0]?.changes?.[0]?.value;
  const incoming = value?.messages?.[0];
  const from = incoming?.from;
  const text = incoming?.text?.body;
  if (!from || !text) return json(200, { ok: true });
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!accessToken || !phoneNumberId) return json(503, { error: "WhatsApp is not configured." });
  try {
    const reply = await askAssistant([{ role: "user", content: text }]);
    const version = process.env.META_GRAPH_API_VERSION || "v23.0";
    const sent = await fetch(`https://graph.facebook.com/${version}/${phoneNumberId}/messages`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: from, type: "text", text: { body: reply.slice(0, 4000) } }),
    });
    if (!sent.ok) {
      const detail = await sent.text();
      console.error("WhatsApp send failed", sent.status, detail.slice(0, 500));
    }
    return json(200, { ok: true });
  } catch (error) {
    console.error("WhatsApp webhook error", error);
    return json(200, { ok: true });
  }
};
