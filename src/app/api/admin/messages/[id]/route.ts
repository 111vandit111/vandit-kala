import { z } from "zod";
import { requireAdmin } from "../../../../../../lib/server/auth";
import { deleteMessage, markRead } from "../../../../../../lib/server/contactService";
import { NotFoundError } from "../../../../../../lib/server/errors";
import { fail, handleError, isValidObjectId, ok, parseBody } from "../../../../../../lib/server/http";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

const readSchema = z.object({ isRead: z.boolean() }).strict();

function toErrorResponse(route: string, err: unknown) {
  if (err instanceof NotFoundError) return fail(404, "Not found");
  return handleError(route, err);
}

export async function PATCH(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { id } = await params;
    if (!isValidObjectId(id)) return fail(400, "Invalid id");
    const parsed = await parseBody(request, readSchema);
    if (!parsed.ok) return parsed.response;
    return ok(await markRead(id, parsed.value.isRead));
  } catch (err) {
    return toErrorResponse("PATCH /api/admin/messages/[id]", err);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  try {
    const denied = requireAdmin(request);
    if (denied) return denied;
    const { id } = await params;
    if (!isValidObjectId(id)) return fail(400, "Invalid id");
    await deleteMessage(id);
    return ok({ ok: true });
  } catch (err) {
    return toErrorResponse("DELETE /api/admin/messages/[id]", err);
  }
}
