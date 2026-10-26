import { answerQuestion, ChatUnavailableError } from "../../../../lib/server/chatService";
import { fail, handleError, ok, parseBody, tooManyRequests } from "../../../../lib/server/http";
import { checkRateLimit } from "../../../../lib/server/rateLimit";
import { chatSchema } from "../../../../lib/server/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit("chat", request);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSec);
    const parsed = await parseBody(request, chatSchema);
    if (!parsed.ok) return parsed.response;
    const { message, history, profile } = parsed.value;
    const reply = await answerQuestion({ message, history: history ?? [], profile });
    return ok(reply);
  } catch (err) {
    if (err instanceof ChatUnavailableError) return fail(503, "Chat is not available right now");
    return handleError("POST /api/chat", err);
  }
}
