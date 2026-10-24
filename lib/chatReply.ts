export type ChatLinkKind = "live" | "repo" | "github" | "linkedin" | "instagram" | "whatsapp" | "resume";

export type ChatLink = { kind: ChatLinkKind; label: string; href: string };

export type ChatProjectCard = {
  id: string;
  name: string;
  summary: string;
  image: string;
  tags: string[];
  liveUrl: string;
  repoUrl: string;
};

export type ChatSkillCard = {
  id: string;
  name: string;
  category: string;
  level: number;
  years: number;
  image: string;
};

export type ChatBlock =
  | { type: "projects"; projects: ChatProjectCard[] }
  | { type: "skills"; skills: ChatSkillCard[] }
  | { type: "links"; links: ChatLink[] }
  | { type: "socials"; links: ChatLink[] }
  | { type: "contact"; links: ChatLink[] };

export type ChatReply = { reply: string; blocks: ChatBlock[] };

export const CHAT_BLOCK_LIMITS = { blocks: 3, projects: 5, skills: 8, links: 12, replyChars: 1200 };
