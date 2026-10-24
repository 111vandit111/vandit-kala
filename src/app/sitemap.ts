import type { MetadataRoute } from "next";
import { listPublic } from "../../lib/server/contentService";

export const dynamic = "force-dynamic";

const SITE_URL = "https://vandit-kala.vercel.app";
const CANONICAL_PROFILE = "recruiter";

const text = (value: unknown): string => (typeof value === "string" ? value : "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/${CANONICAL_PROFILE}`, changeFrequency: "monthly", priority: 0.9 },
  ];
  try {
    const projects = await listPublic("projects");
    projects.forEach((project) => {
      const slug = text(project.slug);
      if (!slug) return;
      const updatedAt = project.updatedAt instanceof Date ? project.updatedAt : undefined;
      pages.push({
        url: `${SITE_URL}/${CANONICAL_PROFILE}/projects/${slug}`,
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });
  } catch (error) {
    console.error("Sitemap project lookup failed:", error instanceof Error ? error.message : error);
  }
  return pages;
}
