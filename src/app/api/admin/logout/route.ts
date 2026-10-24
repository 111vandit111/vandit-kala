import { sessionCookieOptions } from "../../../../../lib/server/auth";
import { handleError, ok } from "../../../../../lib/server/http";
import { SESSION_COOKIE } from "../../../../../lib/server/limits";

export async function POST() {
  try {
    const response = ok({ ok: true });
    response.cookies.set(SESSION_COOKIE, "", { ...sessionCookieOptions(), maxAge: 0 });
    return response;
  } catch (err) {
    return handleError("POST /api/admin/logout", err);
  }
}
