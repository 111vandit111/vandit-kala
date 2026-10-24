import { describe, expect, it } from "vitest";
import { contactSchema, resourceSchemas } from "../schemas";
import { CONTACT_LIMITS } from "../limits";

const validProject = {
  slug: "portfolio",
  name: "Portfolio",
  description: "A personal site",
  problem: "Needed a place to show work",
  role: "Solo developer",
  approach: "Next.js and MongoDB",
  impact: "Used by recruiters",
  tags: ["next"],
  image: "/project.png",
  order: 1,
  isFeatured: true,
  isVisible: true,
};

describe("resourceSchemas", () => {
  const { create } = resourceSchemas.projects;

  it("accepts a valid project", () => {
    expect(create.safeParse(validProject).success).toBe(true);
  });

  it("rejects an unknown $where key", () => {
    expect(create.safeParse({ ...validProject, $where: "1" }).success).toBe(false);
  });

  it("rejects an image on a host that is not allowed", () => {
    expect(create.safeParse({ ...validProject, image: "https://evil.example.com/a.png" }).success).toBe(false);
  });

  it("accepts an image on an allowed host", () => {
    expect(create.safeParse({ ...validProject, image: "https://res.cloudinary.com/x/a.png" }).success).toBe(true);
  });

  it.each(["problem", "impact"])("rejects empty project %s", (field) => {
    expect(create.safeParse({ ...validProject, [field]: "   " }).success).toBe(false);
  });

  it("rejects empty skill detail", () => {
    const skill = {
      slug: "ts", name: "TS", description: "Typed JS", detail: "", level: 80, years: 3,
      relatedProjects: [], image: "/a.png", category: "Lang", order: 0, isVisible: true,
    };
    expect(resourceSchemas.skills.create.safeParse(skill).success).toBe(false);
  });

  it("rejects empty experience summary and impact", () => {
    const experience = {
      slug: "acme", company: "Acme", role: "Dev", summary: "", period: "2020", bullets: [], tags: [],
      impact: "", image: "/a.png", order: 0, isVisible: true,
    };
    expect(resourceSchemas.experience.create.safeParse(experience).success).toBe(false);
  });

  it("allows a partial update", () => {
    expect(resourceSchemas.projects.update.safeParse({ name: "New" }).success).toBe(true);
  });
});

describe("contactSchema", () => {
  const valid = { name: "A", email: "a@b.co", subject: "Hi", message: "Hello" };

  it("accepts a valid message", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an over-long message", () => {
    const message = "x".repeat(CONTACT_LIMITS.message + 1);
    expect(contactSchema.safeParse({ ...valid, message }).success).toBe(false);
  });

  it("rejects a filled honeypot", () => {
    expect(contactSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false);
  });
});
