import { describe, expect, it } from "vitest";
import { EDUCATION, EXPERIENCE, PROJECTS, SKILLS, TEXTS } from "../seed/seedData";
import { resourceSchemas } from "../schemas";
import { CONTACT_COPY_FIELDS, contactKey, resolveContactCopy } from "../../contactCopy";
import { LEGACY_FIELDS, LEGACY_TEXTS } from "../seed/legacyCopy";

const REQUIRED_TEXT_KEYS = [
  "hero.name",
  "hero.headline",
  "hero.availability",
  "hero.stats",
  "cta.contact",
  "hero.tagline.recruiter",
  "hero.tagline.personal",
  "hero.tagline.stalker",
  "about.recruiter",
  "about.personal",
  "about.stalker",
  "resume.url",
  "social.github",
  "social.linkedin",
  "social.instagram",
  "social.whatsapp",
  "contact.heading",
];
const OPTIONAL_EMPTY_TEXT_KEYS = ["resume.url", "social.instagram", "social.whatsapp"];
const PROFILES = ["recruiter", "personal", "stalker"] as const;
const MAX_STATS = 4;

function emptyStrings(item: object): string[] {
  const problems: string[] = [];
  for (const [field, value] of Object.entries(item)) {
    if (typeof value === "string" && value.trim() === "") problems.push(field);
    if (Array.isArray(value) && value.some((entry) => typeof entry === "string" && entry.trim() === "")) {
      problems.push(field);
    }
  }
  return problems;
}

describe("seed data", () => {
  it("has unique slugs per resource", () => {
    for (const items of [PROJECTS, SKILLS, EXPERIENCE, EDUCATION]) {
      const slugs = items.map((item) => item.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("passes the create schema for every item", () => {
    const groups = [
      ["projects", PROJECTS],
      ["skills", SKILLS],
      ["experience", EXPERIENCE],
      ["education", EDUCATION],
    ] as const;
    for (const [resource, items] of groups) {
      for (const item of items) {
        const parsed = resourceSchemas[resource].create.safeParse(item);
        expect(parsed.success, `${resource}/${item.slug}`).toBe(true);
      }
    }
  });

  it("has non-empty text for every required field", () => {
    for (const item of [...PROJECTS, ...SKILLS, ...EXPERIENCE, ...EDUCATION]) {
      expect(emptyStrings(item), item.slug).toEqual([]);
    }
    for (const project of PROJECTS) expect(project.tags.length, project.slug).toBeGreaterThan(0);
    for (const job of EXPERIENCE) expect(job.bullets.length, job.slug).toBeGreaterThan(0);
  });

  it("only relates skills to seeded project slugs", () => {
    const projectSlugs = new Set(PROJECTS.map((project) => project.slug));
    for (const skill of SKILLS) {
      for (const slug of skill.relatedProjects) {
        expect(projectSlugs.has(slug), `${skill.slug} -> ${slug}`).toBe(true);
      }
    }
  });

  it("seeds only public repositories", () => {
    for (const project of PROJECTS) {
      expect(project.repoUrl.startsWith("https://github.com/111vandit111/")).toBe(true);
    }
    expect(PROJECTS.map((project) => project.slug)).not.toContain("neetcode-submissions");
  });

  it("seeds every text key, with values for all but the documented gaps", () => {
    for (const key of REQUIRED_TEXT_KEYS) expect(TEXTS, key).toHaveProperty(key);
    for (const key of REQUIRED_TEXT_KEYS.filter((key) => !OPTIONAL_EMPTY_TEXT_KEYS.includes(key))) {
      expect(TEXTS[key].trim().length, key).toBeGreaterThan(0);
    }
  });

  it("formats hero.stats as at most 4 value|label lines", () => {
    const lines = TEXTS["hero.stats"].split("\n");
    expect(lines.length).toBeLessThanOrEqual(MAX_STATS);
    for (const line of lines) {
      const [value, label] = line.split("|");
      expect(value?.trim()).toBeTruthy();
      expect(label?.trim()).toBeTruthy();
    }
  });

  it("keeps skill levels within 60-90", () => {
    for (const skill of SKILLS) {
      expect(skill.level).toBeGreaterThanOrEqual(60);
      expect(skill.level).toBeLessThanOrEqual(90);
    }
  });

  it("seeds every per-profile contact key", () => {
    for (const profile of PROFILES) {
      for (const field of CONTACT_COPY_FIELDS) {
        expect(TEXTS[contactKey(field, profile)]?.trim(), `${field}.${profile}`).toBeTruthy();
      }
    }
  });

  it("resolves contact copy per profile, then generic, then the default", () => {
    const texts = { ...TEXTS };
    expect(resolveContactCopy(texts, "personal").subtext).toBe(TEXTS["contact.subtext.personal"]);
    expect(resolveContactCopy({ "contact.cta": "Generic" }, "stalker").cta).toBe("Generic");
    expect(resolveContactCopy({}, "stalker").cta).toBe("Send message");
  });

  it("only lists legacy copy that the current seed replaced", () => {
    for (const [key, value] of Object.entries(LEGACY_TEXTS)) {
      expect(TEXTS[key], key).toBeDefined();
      expect(TEXTS[key], key).not.toBe(value);
    }
    expect(LEGACY_FIELDS.length).toBeGreaterThan(0);
  });

  it("no longer frames the recruiter copy as frontend-only", () => {
    expect(TEXTS["hero.headline"]).not.toMatch(/front-?end engineer/i);
    expect(TEXTS["about.recruiter"]).not.toMatch(/^front-?end engineer/i);
  });

  it("does not seed a live URL for the Taskkar project whose demo is offline", () => {
    const taskkar = PROJECTS.find((project) => project.slug === "taskkar");
    expect(taskkar?.liveUrl).toBeUndefined();
    expect(taskkar?.repoUrl).toBeTruthy();
  });

  it("only lists legacy project fields that differ from the current seed", () => {
    for (const { slug, field, value } of LEGACY_FIELDS) {
      const project = PROJECTS.find((item) => item.slug === slug) as Record<string, unknown> | undefined;
      if (!project) continue;
      expect(project[field], `${slug}.${field}`).not.toEqual(value);
    }
  });
});
