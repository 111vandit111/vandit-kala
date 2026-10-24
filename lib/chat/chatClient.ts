import { CHAT_LIMITS, type ChatTurn } from "../chatLimits";
import {
  CHAT_BLOCK_LIMITS,
  type ChatBlock,
  type ChatLink,
  type ChatLinkKind,
  type ChatProjectCard,
  type ChatReply,
  type ChatSkillCard,
} from "../chatReply";
import { safeImageSrc } from "../safeImage";
import { safeHttpsUrl } from "../safeUrl";

export const EMPTY_REPLY_TEXT = "Sorry, I couldn't find an answer to that.";

export type ChatMessage = { role: "user" | "model"; text: string; blocks?: ChatBlock[] };

const LINK_KINDS: ChatLinkKind[] = ["live", "repo", "github", "linkedin", "instagram", "whatsapp", "resume"];
const LINK_BLOCK_TYPES = ["links", "socials", "contact"] as const;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown): string => (typeof value === "string" ? value : "");

function parseLink(value: unknown): ChatLink | undefined {
  if (!isRecord(value)) return undefined;
  const kind = LINK_KINDS.find((candidate) => candidate === value.kind);
  const label = asString(value.label);
  const href = safeHttpsUrl(asString(value.href));
  if (!kind || !label || !href) return undefined;
  return { kind, label, href };
}

function parseProject(value: unknown): ChatProjectCard | undefined {
  if (!isRecord(value)) return undefined;
  const id = asString(value.id);
  const name = asString(value.name);
  if (!id || !name) return undefined;
  const tags = Array.isArray(value.tags) ? value.tags.filter((tag): tag is string => typeof tag === "string") : [];
  return {
    id,
    name,
    summary: asString(value.summary),
    image: safeImageSrc(asString(value.image)),
    tags,
    liveUrl: safeHttpsUrl(asString(value.liveUrl)),
    repoUrl: safeHttpsUrl(asString(value.repoUrl)),
  };
}

const SKILL_ID = /^[a-z0-9][a-z0-9-]*$/i;

function parseSkill(value: unknown): ChatSkillCard | undefined {
  if (!isRecord(value)) return undefined;
  const id = asString(value.id);
  const name = asString(value.name);
  if (!SKILL_ID.test(id) || !name) return undefined;
  const level = typeof value.level === "number" && Number.isFinite(value.level) ? Math.min(100, Math.max(0, value.level)) : 0;
  const years = typeof value.years === "number" && Number.isFinite(value.years) && value.years >= 0 ? value.years : 0;
  return { id, name, category: asString(value.category), level, years, image: safeImageSrc(asString(value.image)) };
}

function parseBlock(value: unknown): ChatBlock | undefined {
  if (!isRecord(value)) return undefined;
  if (value.type === "projects") {
    const list = Array.isArray(value.projects) ? value.projects : [];
    const projects = list
      .map(parseProject)
      .filter((project): project is ChatProjectCard => !!project)
      .slice(0, CHAT_BLOCK_LIMITS.projects);
    return projects.length > 0 ? { type: "projects", projects } : undefined;
  }
  if (value.type === "skills") {
    const list = Array.isArray(value.skills) ? value.skills : [];
    const skills = list
      .map(parseSkill)
      .filter((skill): skill is ChatSkillCard => !!skill)
      .slice(0, CHAT_BLOCK_LIMITS.skills);
    return skills.length > 0 ? { type: "skills", skills } : undefined;
  }
  const linkType = LINK_BLOCK_TYPES.find((candidate) => candidate === value.type);
  if (!linkType) return undefined;
  const list = Array.isArray(value.links) ? value.links : [];
  const links = list
    .map(parseLink)
    .filter((link): link is ChatLink => !!link)
    .slice(0, CHAT_BLOCK_LIMITS.links);
  // contact still renders its message button when no social links resolve
  return links.length > 0 || linkType === "contact" ? { type: linkType, links } : undefined;
}

/** Validates an API body; returns undefined when the reply text is missing. Never trusts hrefs. */
export function parseChatResponse(body: unknown): ChatReply | undefined {
  if (!isRecord(body) || !isRecord(body.data)) return undefined;
  const { reply, blocks } = body.data;
  if (typeof reply !== "string") return undefined;
  const list = Array.isArray(blocks) ? blocks : [];
  const parsed = list
    .map(parseBlock)
    .filter((block): block is ChatBlock => !!block)
    .slice(0, CHAT_BLOCK_LIMITS.blocks);
  return { reply: reply.trim() || parsed.length > 0 ? reply : EMPTY_REPLY_TEXT, blocks: parsed };
}

export function toHistory(messages: ChatMessage[]): ChatTurn[] {
  return messages.slice(-CHAT_LIMITS.historyTurns).map(({ role, text }) => ({ role, text }));
}

export function messagesToText(messages: ChatMessage[]): string {
  return messages.map((message) => `${message.role === "user" ? "You" : "Assistant"}: ${message.text}`).join("\n\n");
}
