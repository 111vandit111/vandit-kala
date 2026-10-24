import { getTextMap, listPublic } from "../../../../../lib/server/contentService";
import { fail, handleError, ok } from "../../../../../lib/server/http";
import { RESOURCES, type Resource } from "../../../../../lib/server/limits";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ resource: string }> }) {
  try {
    const { resource } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    if (resource === "texts") return ok(await getTextMap());
    return ok(await listPublic(resource as Resource));
  } catch (err) {
    return handleError("GET /api/content/[resource]", err);
  }
}
