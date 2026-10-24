import { requireAdmin } from "../../../../../lib/server/auth";
import { listMessages } from "../../../../../lib/server/contactService";
import { handleError, okList, parsePagination } from "../../../../../lib/server/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { page, pageSize } = parsePagination(new URL(request.url));
    const { items, total } = await listMessages({ page, pageSize });
    return okList(items, { page, pageSize, total });
  } catch (err) {
    return handleError("GET /api/admin/messages", err);
  }
}
