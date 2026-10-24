// Image paths for seeded content: files in public/img/<resource>/<slug>.<ext> (licences: docs/IMAGE_CREDITS.md).
// Only the personal profile photos are on Cloudinary, and they are not database documents.
import { localImagePath } from "../../imageUtils";

export type ImageResource = "skills" | "projects" | "experience" | "education";

export const IMAGE_RESOURCES: ImageResource[] = ["skills", "projects", "experience", "education"];
export const PLACEHOLDER_IMAGE = "/vanditkalahero.png";

const EXTENSION_BY_RESOURCE: Record<ImageResource, string> = {
  skills: "svg",
  projects: "webp",
  experience: "svg",
  education: "svg",
};

// Images that the earlier Cloudinary migration generated (vandit-portfolio/<resource>/...); custom URLs never match.
const MIGRATED_CLOUDINARY_IMAGE = new RegExp(
  `^https://res\\.cloudinary\\.com/[^/]+/image/upload/(?:[^/]+/)*vandit-portfolio/(?:${IMAGE_RESOURCES.join("|")})/[a-z0-9-]+(?:\\.[a-z]+)?$`,
);

export function seedImageUrl(resource: ImageResource, slug: string): string {
  return localImagePath(resource, slug, EXTENSION_BY_RESOURCE[resource]);
}

export function isReplaceableImage(image: unknown): boolean {
  if (typeof image !== "string") return true;
  const value = image.trim();
  return value === "" || value === PLACEHOLDER_IMAGE || MIGRATED_CLOUDINARY_IMAGE.test(value);
}
