import { z } from "zod";
import { CHAT_LIMITS } from "../chatLimits";
import { ALLOWED_IMAGE_HOSTS } from "../imageHosts";
import { CONTACT_LIMITS, TEXT_LIMITS, TRACKED_PROFILE_TYPES, type ProfileType, type Resource } from "./limits";

const MAX_LEVEL = 100;
const MAX_YEARS = 80;

const oneLiner = z.string().trim().min(1).max(TEXT_LIMITS.oneLiner);
const paragraph = z.string().trim().min(1).max(TEXT_LIMITS.paragraph);
const optionalOneLiner = z.string().trim().max(TEXT_LIMITS.oneLiner).optional();
const optionalParagraph = z.string().trim().max(TEXT_LIMITS.paragraph).optional();
const slug = z
  .string()
  .trim()
  .min(1)
  .max(TEXT_LIMITS.slug)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens");
const list = z
  .array(z.string().trim().min(1).max(TEXT_LIMITS.listItem))
  .max(TEXT_LIMITS.listLength);
const order = z.number().int();
const level = z.number().int().min(0).max(MAX_LEVEL);
const years = z.number().min(0).max(MAX_YEARS);
const flag = z.boolean();

function isAllowedImage(value: string): boolean {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && ALLOWED_IMAGE_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

const image = z
  .string()
  .trim()
  .max(TEXT_LIMITS.url)
  .refine(isAllowedImage, "Image must be a /path or an https URL on an allowed host");

const optionalUrl = z
  .string()
  .trim()
  .max(TEXT_LIMITS.url)
  .refine((value) => {
    if (value === "") return true;
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  }, "Must be an https URL")
  .optional();

const projectShape = {
  slug,
  name: oneLiner,
  description: oneLiner,
  problem: paragraph,
  role: oneLiner,
  approach: paragraph,
  impact: paragraph,
  tags: list,
  repoUrl: optionalUrl,
  liveUrl: optionalUrl,
  year: z.string().trim().max(TEXT_LIMITS.category).optional(),
  image,
  order,
  isFeatured: flag,
  isVisible: flag,
};

const skillShape = {
  slug,
  name: oneLiner,
  description: oneLiner,
  detail: paragraph,
  level,
  years,
  relatedProjects: z.array(slug).max(TEXT_LIMITS.listLength),
  image,
  category: z.string().trim().min(1).max(TEXT_LIMITS.category),
  order,
  isVisible: flag,
};

const experienceShape = {
  slug,
  company: oneLiner,
  role: oneLiner,
  summary: paragraph,
  location: optionalOneLiner,
  period: z.string().trim().min(1).max(TEXT_LIMITS.category),
  bullets: list,
  tags: list,
  impact: paragraph,
  image,
  order,
  isVisible: flag,
};

const educationShape = {
  slug,
  institution: oneLiner,
  degree: oneLiner,
  period: z.string().trim().min(1).max(TEXT_LIMITS.category),
  description: optionalParagraph,
  image,
  order,
  isVisible: flag,
};

const textShape = {
  key: z.string().trim().min(1).max(TEXT_LIMITS.textKey),
  value: z.string().trim().max(TEXT_LIMITS.textValue),
};

function pair<T extends z.ZodRawShape>(shape: T) {
  return {
    create: z.object(shape).strict(),
    update: z.object(shape).partial().strict(),
  };
}

export const resourceSchemas: Record<Resource, { create: z.ZodType; update: z.ZodType }> = {
  projects: pair(projectShape),
  skills: pair(skillShape),
  experience: pair(experienceShape),
  education: pair(educationShape),
  texts: pair(textShape),
};

export const contactSchema = z
  .object({
    name: z.string().trim().min(1).max(CONTACT_LIMITS.name),
    email: z.string().trim().max(CONTACT_LIMITS.email).email(),
    subject: z.string().trim().min(1).max(CONTACT_LIMITS.subject),
    message: z.string().trim().min(1).max(CONTACT_LIMITS.message),
  })
  .strict();

export const trackSchema = z.object({ type: z.enum(TRACKED_PROFILE_TYPES as [string, ...string[]]) }).strict();

export const loginSchema = z.object({ password: z.string().min(1).max(200) }).strict();

const chatTurnSchema = z
  .object({
    role: z.enum(["user", "model"]),
    text: z.string().min(1).max(CHAT_LIMITS.historyText),
  })
  .strict();

export const chatSchema = z
  .object({
    message: z.string().trim().min(1).max(CHAT_LIMITS.message),
    history: z.array(chatTurnSchema).max(CHAT_LIMITS.historyTurns).optional(),
    profile: z.enum(TRACKED_PROFILE_TYPES as [ProfileType, ...ProfileType[]]).optional(),
  })
  .strict();
