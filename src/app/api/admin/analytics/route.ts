import { clampDays, getSeries } from "../../../../../lib/server/analyticsService";
import { requireAdmin } from "../../../../../lib/server/auth";
import { handleError, ok } from "../../../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const days = clampDays(new URL(request.url).searchParams.get("days"));
    return ok(await getSeries(days));
  } catch (err) {
    return handleError("GET /api/admin/analytics", err);
  }
}
