import { requireAdmin } from "../../../../../../lib/server/auth";
import { deleteItem, updateItem } from "../../../../../../lib/server/contentService";
import { DuplicateError, NotFoundError } from "../../../../../../lib/server/errors";
import { fail, handleError, isValidObjectId, ok, parseBody } from "../../../../../../lib/server/http";
import { RESOURCES, type Resource } from "../../../../../../lib/server/limits";
import { resourceSchemas } from "../../../../../../lib/server/schemas";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ resource: string; id: string }> };

function toErrorResponse(route: string, err: unknown) {
  if (err instanceof NotFoundError) return fail(404, "Not found");
  if (err instanceof DuplicateError) return fail(409, "Already exists");
  return handleError(route, err);
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { resource, id } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    if (!isValidObjectId(id)) return fail(400, "Invalid id");
    const parsed = await parseBody(request, resourceSchemas[resource as Resource].update);
    if (!parsed.ok) return parsed.response;
    return ok(await updateItem(resource as Resource, id, parsed.value as Record<string, unknown>));
  } catch (err) {
    return toErrorResponse("PATCH /api/admin/[resource]/[id]", err);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { resource, id } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    if (!isValidObjectId(id)) return fail(400, "Invalid id");
    await deleteItem(resource as Resource, id);
    return ok({ ok: true });
  } catch (err) {
    return toErrorResponse("DELETE /api/admin/[resource]/[id]", err);
  }
}
