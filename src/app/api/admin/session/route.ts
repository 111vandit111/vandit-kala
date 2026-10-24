import { getSessionCookie, verifySessionToken } from "../../../../../lib/server/auth";
import { ok } from "../../../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    return ok({ isAdmin: verifySessionToken(getSessionCookie(request)) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[GET /api/admin/session] ${message}`);
    return ok({ isAdmin: false });
  }
}
