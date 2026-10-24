import { requireAdmin } from "../../../../../lib/server/auth";
import { createItem, listAdmin } from "../../../../../lib/server/contentService";
import { DuplicateError } from "../../../../../lib/server/errors";
import { fail, handleError, ok, okList, parseBody, parsePagination } from "../../../../../lib/server/http";
import { RESOURCES, type Resource } from "../../../../../lib/server/limits";
import { resourceSchemas } from "../../../../../lib/server/schemas";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ resource: string }> };

export async function GET(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { resource } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    const { page, pageSize } = parsePagination(new URL(request.url));
    const { items, total } = await listAdmin(resource as Resource, { page, pageSize });
    return okList(items, { page, pageSize, total });
  } catch (err) {
    return handleError("GET /api/admin/[resource]", err);
  }
}

export async function POST(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { resource } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    const parsed = await parseBody(request, resourceSchemas[resource as Resource].create);
    if (!parsed.ok) return parsed.response;
    return ok(await createItem(resource as Resource, parsed.value as Record<string, unknown>), 201);
  } catch (err) {
    if (err instanceof DuplicateError) return fail(409, "Already exists");
    return handleError("POST /api/admin/[resource]", err);
  }
}
