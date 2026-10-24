import { z } from "zod";
import { CHAT_BLOCK_LIMITS } from "../chatReply";
import type { ChatBlock, ChatLink, ChatLinkKind, ChatProjectCard, ChatReply, ChatSkillCard } from "../chatReply";
import { safeImageSrc } from "../safeImage";
import { safeHttpsUrl } from "../safeUrl";
import type { ContentDoc } from "./contentService";

export type ChatSiteData = { projects: ContentDoc[]; skills: ContentDoc[]; texts: Record<string, string> };

const MODEL_MAX_BLOCKS = 6;
const MODEL_MAX_IDS = 12;
const EMPTY_TEXT_FALLBACK = "Here is what I found.";

const modelReplySchema = z
  .object({
    text: z.string(),
    blocks: z
      .array(
        z
          .object({
            type: z.enum(["projects", "skills", "links", "socials", "contact"]),
            ids: z.array(z.string()).max(MODEL_MAX_IDS).optional(),
          })
          .strict()
      )
      .max(MODEL_MAX_BLOCKS)
      .default([]),
  })
  .strict();

export type ModelReply = z.infer<typeof modelReplySchema>;

type SocialKey = "github" | "linkedin" | "instagram" | "whatsapp" | "resume";

const SOCIALS: { key: SocialKey; label: string; textKey: string }[] = [
  { key: "github", label: "GitHub", textKey: "social.github" },
  { key: "linkedin", label: "LinkedIn", textKey: "social.linkedin" },
  { key: "instagram", label: "Instagram", textKey: "social.instagram" },
  { key: "whatsapp", label: "WhatsApp", textKey: "social.whatsapp" },
  { key: "resume", label: "Resume", textKey: "resume.url" },
];

const FENCE = /^```[a-z]*\s*([\s\S]*?)\s*```$/i;
const CONTROL_CHARS = /[\u0000-\u001f\u007f-\u009f]/g;
const HTML_TAGS = /<[^>]*>/g;
const MARKDOWN_LINK = /!?\[([^\]]*)\]\((?:[^()]|\([^)]*\))*\)/g;
const MARKDOWN_MARKS = /\*\*|__|`/g;
const URL_IN_TEXT = /(?:https?:\/\/|www\.)[^\s<>"'\])]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?]+$/;
const EMPTY_PARENS = /\(\s*\)/g;

export function parseModelReply(raw: string): ModelReply | undefined {
  const trimmed = raw.trim();
  const fenced = FENCE.exec(trimmed);
  try {
    const parsed = modelReplySchema.safeParse(JSON.parse(fenced ? fenced[1] : trimmed));
    return parsed.success ? parsed.data : undefined;
  } catch {
    return undefined;
  }
}

function socialUrl(site: ChatSiteData, textKey: string): string {
  return safeHttpsUrl(site.texts[textKey]);
}

export function siteUrls(site: ChatSiteData): Set<string> {
  const urls = new Set<string>();
  for (const social of SOCIALS) urls.add(socialUrl(site, social.textKey));
  for (const doc of site.projects) {
    urls.add(safeHttpsUrl(asString(doc.liveUrl)));
    urls.add(safeHttpsUrl(asString(doc.repoUrl)));
  }
  urls.delete("");
  return urls;
}

function isAllowedUrl(candidate: string, allowedUrls: Set<string>): boolean {
  const toggled = candidate.endsWith("/") ? candidate.slice(0, -1) : `${candidate}/`;
  return allowedUrls.has(candidate) || allowedUrls.has(toggled);
}

export function sanitizeReplyText(text: string, allowedUrls: Set<string>): string {
  const cleaned = text
    .replace(CONTROL_CHARS, " ")
    .replace(HTML_TAGS, "")
    .replace(MARKDOWN_LINK, "$1")
    .replace(MARKDOWN_MARKS, "")
    .replace(URL_IN_TEXT, (match) => {
      const url = match.replace(TRAILING_PUNCTUATION, "");
      return isAllowedUrl(url, allowedUrls) ? match : match.slice(url.length);
    })
    .replace(EMPTY_PARENS, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.slice(0, CHAT_BLOCK_LIMITS.replyChars).trim();
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toCard(doc: ContentDoc): ChatProjectCard {
  return {
    id: asString(doc.slug),
    name: asString(doc.name),
    summary: asString(doc.description),
    image: safeImageSrc(asString(doc.image)),
    tags: Array.isArray(doc.tags) ? doc.tags.filter((tag): tag is string => typeof tag === "string") : [],
    liveUrl: safeHttpsUrl(asString(doc.liveUrl)),
    repoUrl: safeHttpsUrl(asString(doc.repoUrl)),
  };
}

function resolveProjects(ids: string[], site: ChatSiteData): ChatProjectCard[] {
  const bySlug = new Map(site.projects.map((doc) => [asString(doc.slug), doc]));
  const cards: ChatProjectCard[] = [];
  for (const id of ids) {
    const doc = bySlug.get(id);
    if (!id || !doc || cards.some((card) => card.id === id)) continue;
    cards.push(toCard(doc));
  }
  return cards.slice(0, CHAT_BLOCK_LIMITS.projects);
}

function toSkillCard(doc: ContentDoc): ChatSkillCard {
  const level = typeof doc.level === "number" && Number.isFinite(doc.level) ? Math.round(doc.level) : 0;
  const years = typeof doc.years === "number" && Number.isFinite(doc.years) && doc.years >= 0 ? doc.years : 0;
  return {
    id: asString(doc.slug),
    name: asString(doc.name),
    category: asString(doc.category),
    level: Math.min(100, Math.max(0, level)),
    years,
    image: safeImageSrc(asString(doc.image)),
  };
}

function resolveSkills(ids: string[], site: ChatSiteData): ChatSkillCard[] {
  const bySlug = new Map(site.skills.map((doc) => [asString(doc.slug), doc]));
  const cards: ChatSkillCard[] = [];
  for (const id of ids) {
    const doc = bySlug.get(id);
    if (!id || !doc || cards.some((card) => card.id === id)) continue;
    cards.push(toSkillCard(doc));
  }
  return cards.slice(0, CHAT_BLOCK_LIMITS.skills);
}

function socialLinks(site: ChatSiteData, keys: SocialKey[]): ChatLink[] {
  return SOCIALS.filter((social) => keys.includes(social.key)).flatMap((social) => {
    const href = socialUrl(site, social.textKey);
    return href ? [{ kind: social.key as ChatLinkKind, label: social.label, href }] : [];
  });
}

function resolveLink(id: string, site: ChatSiteData): ChatLink | undefined {
  const [prefix, ...rest] = id.split(":");
  const key = rest.join(":");
  if (prefix === "social") return socialLinks(site, [key as SocialKey])[0];
  if (prefix !== "live" && prefix !== "repo") return undefined;
  const doc = site.projects.find((item) => key !== "" && asString(item.slug) === key);
  if (!doc) return undefined;
  const href = safeHttpsUrl(asString(prefix === "live" ? doc.liveUrl : doc.repoUrl));
  if (!href) return undefined;
  const name = asString(doc.name);
  return prefix === "live"
    ? { kind: "live", label: `Live site: ${name}`, href }
    : { kind: "repo", label: `GitHub: ${name}`, href };
}

function resolveLinks(ids: string[], site: ChatSiteData): ChatLink[] {
  const links: ChatLink[] = [];
  for (const id of ids) {
    const link = resolveLink(id, site);
    if (link && !links.some((item) => item.href === link.href && item.label === link.label)) links.push(link);
  }
  return links.slice(0, CHAT_BLOCK_LIMITS.links);
}

function resolveBlock(type: ChatBlock["type"], ids: string[], site: ChatSiteData): ChatBlock | undefined {
  if (type === "projects") {
    const projects = resolveProjects(ids, site);
    return projects.length > 0 ? { type, projects } : undefined;
  }
  if (type === "skills") {
    const skills = resolveSkills(ids, site);
    return skills.length > 0 ? { type, skills } : undefined;
  }
  const links = type === "links" ? resolveLinks(ids, site) : socialLinks(site, SOCIALS.map((social) => social.key));
  return links.length > 0 ? { type, links } : undefined;
}

export function resolveReply(model: ModelReply, site: ChatSiteData): ChatReply {
  const idsByType = new Map<ChatBlock["type"], string[]>();
  for (const block of model.blocks) {
    idsByType.set(block.type, [...(idsByType.get(block.type) ?? []), ...(block.ids ?? [])]);
  }
  const blocks: ChatBlock[] = [];
  for (const [type, ids] of idsByType) {
    const resolved = resolveBlock(type, ids, site);
    if (resolved) blocks.push(resolved);
  }
  const text = sanitizeReplyText(model.text, siteUrls(site));
  return {
    reply: text || (blocks.length > 0 ? EMPTY_TEXT_FALLBACK : ""),
    blocks: blocks.slice(0, CHAT_BLOCK_LIMITS.blocks),
  };
}
