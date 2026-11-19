# Mr Pabasara Malinda AI — Setup

මෙම project එකේ code එක GitHub හි `ai-assistant-foundation` branch එකේ ඇත. මුල් website එක සහ backup repository එකේ `main` branch එක වෙනස් නොකරයි.

## මේ අදියරේ ඇතුළත් දේ
- Website chat එකට Sinhala/English AI brain එක.
- WhatsApp Cloud API webhook සහ signature verification.
- Gmail, Google Calendar, GitHub, Slack, Outlook සඳහා integration configuration status endpoint.
- අවදානම් සහිත වැඩ execute නොකර approval අවශ්‍යදැයි පරීක්ෂා කරන endpoint.
- Dashboard එකෙන් AI සහ service configuration තත්ත්වය බැලීම.

## Netlify Environment Variables

Netlify → Site configuration → Environment variables තුළ පහත values අවශ්‍ය පරිදි එකතු කරන්න. **Values කිසිවිටෙක GitHub code එකට හෝ chat එකට දාන්න එපා.**

### AI
- `AI_API_KEY` — OpenAI API key
- `AI_BASE_URL` — optional; default OpenAI API base URL
- `AI_MODEL` — optional; default `gpt-4o-mini`

### WhatsApp Cloud API
- `WHATSAPP_VERIFY_TOKEN` — ඔබම තෝරාගන්නා දිගු random value එකක්
- `WHATSAPP_APP_SECRET` — Meta app secret (webhook signature verify කිරීමට)
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `META_GRAPH_API_VERSION` — optional; Meta සහාය දක්වන Graph API version එක

Webhook URL: `https://YOUR-SITE.netlify.app/api/whatsapp`

Meta Developers තුළ callback URL සහ එකම verify token එක සකසා `messages` webhook field එක subscribe කරන්න. App secret සහ access token Netlify environment variables ලෙස පමණක් දමන්න.

### වෙනත් integrations
- Google OAuth: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
- GitHub OAuth: `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
- Slack OAuth: `SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`
- Microsoft OAuth: `MICROSOFT_CLIENT_ID`, `MICROSOFT_CLIENT_SECRET`

Integration status endpoint එක දැනට credentials තිබේද යන්න පමණක් පෙන්වයි. OAuth consent, ආරක්ෂිත token storage/refresh, සහ Gmail/Calendar/GitHub ක්‍රියාකාරකම් තවම සම්පූර්ණ කර නැත. Client ID එකක් තිබීමෙන් account එක සම්බන්ධ වූ බවක් අදහස් නොවේ.

## API endpoints
- `POST /api/chat` — website AI chat
- `GET|POST /api/whatsapp` — WhatsApp verification සහ webhook
- `GET /api/integrations` — integration configuration status
- `POST /api/approvals` — risk classification පමණි; කිසිදු external action එකක් execute නොකරයි
- `GET /api/health` — AI සහ WhatsApp configuration status

## Security notes
- Secrets, access tokens, හෝ `.env` files GitHub වෙත commit නොකරන්න.
- HTTPS භාවිතා කර webhook signatures verify කරන්න.
- Approval endpoint එක external actions execute නොකරයි. සැබෑ action executor එකක් සෑදීමට පෙර authenticated user identity, explicit approval, durable storage, rate limiting, සහ audit logs අවශ්‍යයි.
- Dashboard එකට login protection තවම නැත. එය ආරක්ෂිත authentication එකක් එකතු කරන තුරු private හෝ sensitive data සඳහා භාවිතා නොකරන්න.
