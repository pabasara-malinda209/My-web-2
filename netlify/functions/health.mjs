export default async () => ({
  statusCode: 200,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  body: JSON.stringify({
    name: "Mr Pabasara Malinda AI",
    status: "online",
    aiConfigured: Boolean(process.env.AI_API_KEY),
    telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
    whatsappConfigured: Boolean(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_APP_SECRET && process.env.WHATSAPP_VERIFY_TOKEN),
  }),
});
