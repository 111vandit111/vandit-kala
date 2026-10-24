import { createSessionToken, isPasswordValid, sessionCookieOptions } from "../../../../../lib/server/auth";
import { fail, handleError, ok, parseBody, tooManyRequests } from "../../../../../lib/server/http";
import { SESSION_COOKIE } from "../../../../../lib/server/limits";
import { checkRateLimit } from "../../../../../lib/server/rateLimit";
import { loginSchema } from "../../../../../lib/server/schemas";

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit("login", request);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSec);
    const parsed = await parseBody(request, loginSchema);
    if (!parsed.ok) return parsed.response;
    if (!isPasswordValid(parsed.value.password)) return fail(401, "Invalid password");
    const response = ok({ ok: true });
    response.cookies.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
    return response;
  } catch (err) {
    return handleError("POST /api/admin/login", err);
  }
}
