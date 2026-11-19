# Mr Pabasara Malinda AI — Setup

මෙම project එකේ code එක GitHub එකේ `ai-assistant-foundation` branch එකට දමා ඇත. මුල් website එකත් backup repository එකේ `main` branch එකත් වෙනස් නොවේ.

## මේ අදියරේ ඇතුළත් දේ
- Website chat එකට පොදු Sinhala/English AI brain එක.
- Telegram webhook handler.
- WhatsApp Cloud API webhook handler සහ signature verification.
- Gmail, Google Calendar, GitHub, Slack, Outlook සඳහා integration status endpoint.
- අවදානම් සහිත වැඩ execute නොකර approval අවශ්‍යදැයි පරීක්ෂා කරන endpoint.

## Netlify Environment Variables

Netlify → Site configuration → Environment variables තුළ පහත values අවශ්‍ය පරිදි එකතු කරන්න. **Values කිසිවිටෙක GitHub code එකට හෝ chat එකට දාන්න එපා.**

### AI
- `AI_API_KEY` — OpenAI API key
- `AI_BASE_URL` — optional; default OpenAI API base URL
- `AI_MODEL` — optional; default `gpt-4o-mini`

### Telegram
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET` — optional but recommended

Telegram webhook URL: `https://YOUR-SITE.netlify.app/api/telegram`
Set the webhook using Telegram Bot API `setWebhook`, including `secret_token` matching `TELEGRAM_WEBHOOK_SECRET`.

### WhatsApp Cloud API
- `WHATSAPP_VERIFY_TOKEN` — choose a long random value
- `WHATSAPP_APP_SECRET` — Meta app secret (used to verify webhook signatures)
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `META_GRAPH_API_VERSION` — optional; choose a currently supported Meta Graph API version

Webhook URL: `https://YOUR-SITE.netlify.app/api/whatsapp`
In Meta Developers, configure the callback URL and the same verify token, subscribe to the `messages` webhook field, and add the app secret and access token as Netlify environment variables.

### Other integrations
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- GitHub OAuth: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Slack OAuth: `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`
- Microsoft OAuth: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`

The status endpoint only reports whether OAuth credentials are present. Full OAuth consent, token storage/refresh, and Gmail/Calendar/GitHub action adapters still need to be implemented before those services can be used. Do not treat a configured client ID as a connected account.

## API endpoints
- `POST /api/chat` — website chat
- `POST /api/telegram` — Telegram webhook
- `GET|POST /api/whatsapp` — WhatsApp verification and webhook
- `GET /api/integrations` — integration configuration status
- `POST /api/approvals` — risk classification only; never executes actions

## Security notes
- Never commit secrets, access tokens, or `.env` files.
- Use HTTPS and verify webhook signatures/secrets.
- External actions are not implemented by the approval endpoint. A real action executor must check an explicit, authenticated user approval immediately before execution.
- Add durable storage, per-user identity, rate limiting, and audit logs before production use.
