import { getPublicBySlug } from "../../../../../../lib/server/contentService";
import { NotFoundError } from "../../../../../../lib/server/errors";
import { fail, handleError, ok } from "../../../../../../lib/server/http";
import { RESOURCES, type Resource } from "../../../../../../lib/server/limits";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ resource: string; slug: string }> }
) {
  try {
    const { resource, slug } = await params;
    if (!RESOURCES.includes(resource as Resource)) return fail(404, "Not found");
    return ok(await getPublicBySlug(resource as Resource, slug));
  } catch (err) {
    if (err instanceof NotFoundError) return fail(404, "Not found");
    return handleError("GET /api/content/[resource]/[slug]", err);
  }
}
