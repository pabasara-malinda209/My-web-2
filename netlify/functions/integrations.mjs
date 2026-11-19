const names = ["gmail", "google_calendar", "github", "slack", "outlook"];
const configured = {
  gmail: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  google_calendar: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  slack: Boolean(process.env.SLACK_CLIENT_ID && process.env.SLACK_CLIENT_SECRET),
  outlook: Boolean(process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET),
};
export default async (event) => {
  if (event.httpMethod !== "GET") return { statusCode: 405, body: "Method not allowed." };
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({ integrations: names.map((id) => ({ id, configured: configured[id], status: configured[id] ? "credentials_configured_oauth_pending" : "not_configured" })) }),
  };
};
