import { listPublic, type ContentDoc } from "./contentService";
import type { Resource } from "./limits";
import type { SkillCardProps } from "../SkillCard";

export const FALLBACK_CARD_IMAGE = "/vanditkalahero.png";

export type CardProps = SkillCardProps;

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function positiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && value > 0 ? value : undefined;
}

function cardName(resource: Resource, doc: ContentDoc): string {
  if (resource === "experience") return text(doc.company);
  if (resource === "education") return text(doc.institution);
  return text(doc.name);
}

function cardDescription(resource: Resource, doc: ContentDoc): string {
  if (resource === "experience") return text(doc.summary);
  if (resource === "education") return text(doc.degree);
  return text(doc.description);
}

function cardTags(resource: Resource, doc: ContentDoc): string[] | undefined {
  const raw = resource === "skills" ? [doc.category] : resource === "projects" || resource === "experience" ? doc.tags : [];
  const tags = (Array.isArray(raw) ? raw : []).filter((t): t is string => typeof t === "string" && t.length > 0);
  return tags.length > 0 ? tags.slice(0, 3) : undefined;
}

export function toCard(resource: Resource, doc: ContentDoc): CardProps {
  const slug = text(doc.slug);
  const year = resource === "projects" ? text(doc.year) : resource === "texts" ? "" : text(doc.period);
  return {
    name: cardName(resource, doc),
    description: cardDescription(resource, doc),
    years: resource === "skills" ? positiveNumber(doc.years) : undefined,
    projectCount: resource === "skills" && Array.isArray(doc.relatedProjects) ? positiveNumber(doc.relatedProjects.length) : undefined,
    image: text(doc.image) || FALLBACK_CARD_IMAGE,
    path: `/${resource}/${slug}`,
    year: year || undefined,
    tags: cardTags(resource, doc),
  };
}

export async function getCards(resource: Resource): Promise<CardProps[]> {
  const docs = await listPublic(resource);
  return docs.map((doc) => toCard(resource, doc));
}

export async function getRelatedProjects(slugs: string[]): Promise<CardProps[]> {
  if (slugs.length === 0) return [];
  const cards = await getCards("projects");
  const wanted = new Set(slugs);
  return cards.filter((card) => wanted.has(card.path.split("/").pop() ?? ""));
}
