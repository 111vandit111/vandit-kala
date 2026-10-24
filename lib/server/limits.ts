export { CONTACT_LIMITS } from "../contactLimits";

export type ProfileType = "recruiter" | "personal" | "stalker";
export const TRACKED_PROFILE_TYPES: ProfileType[] = ["recruiter", "personal", "stalker"];

export type Resource = "projects" | "skills" | "experience" | "education" | "texts";
export const RESOURCES: Resource[] = ["projects", "skills", "experience", "education", "texts"];

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_SEC = 28800;

export const RATE_LIMITS = {
  login: { max: 5, windowSec: 900 },
  contact: { max: 5, windowSec: 3600 },
  track: { max: 120, windowSec: 60 },
  chat: { max: 20, windowSec: 600 },
};

export const PAGE_SIZE_DEFAULT = 20;
export const PAGE_SIZE_MAX = 100;
export const ANALYTICS_MAX_DAYS = 365;

export const MAX_BODY_BYTES = 64 * 1024;

export const TEXT_LIMITS = {
  oneLiner: 200,
  paragraph: 2000,
  listItem: 300,
  listLength: 20,
  slug: 100,
  url: 500,
  textKey: 100,
  textValue: 5000,
  category: 60,
};
