import { recordVisit } from "../../../../../lib/server/analyticsService";
import { handleError, parseBody, tooManyRequests } from "../../../../../lib/server/http";
import type { ProfileType } from "../../../../../lib/server/limits";
import { checkRateLimit } from "../../../../../lib/server/rateLimit";
import { trackSchema } from "../../../../../lib/server/schemas";

export async function POST(request: Request) {
  try {
    const limit = checkRateLimit("track", request);
    if (!limit.allowed) return tooManyRequests(limit.retryAfterSec);
    const parsed = await parseBody(request, trackSchema);
    if (!parsed.ok) return parsed.response;
    await recordVisit(parsed.value.type as ProfileType);
    return new Response(null, { status: 204 });
  } catch (err) {
    return handleError("POST /api/analytics/track", err);
  }
}
