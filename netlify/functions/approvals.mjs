const sensitivePatterns = [
  /\\b(send|email|message|publish|post|delete|remove|buy|purchase|pay|transfer|refund|invite|share)\\b/i,
  /\\b(gmail|whatsapp|telegram|calendar|github)\\b.*\\b(send|delete|publish|create|update)\\b/i,
];
export default async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed." };
  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return { statusCode: 400, body: "Invalid JSON." }; }
  const action = typeof body.action === "string" ? body.action.slice(0, 1000) : "";
  if (!action) return { statusCode: 400, body: "An action description is required." };
  const requiresApproval = sensitivePatterns.some((pattern) => pattern.test(action)) || body.risk === "high";
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    body: JSON.stringify({
      allowedToExecute: false,
      requiresApproval,
      status: requiresApproval ? "awaiting_user_confirmation" : "not_executed",
      message: requiresApproval ? "This action needs explicit user confirmation. No action has been performed." : "This endpoint only classifies risk; no external action has been performed.",
    }),
  };
};
