import { describe, expect, it, vi } from "vitest";

vi.mock("../contentService", () => ({ listPublic: vi.fn() }));

import { FALLBACK_CARD_IMAGE, toCard } from "../cardMapper";

describe("toCard", () => {
  it("maps a skill with years and project count, never the self-rated level", () => {
    const card = toCard("skills", {
      slug: "react", name: "React", description: "UI", level: 85, years: 3, relatedProjects: ["a", "b"], image: "/a.png",
    });
    expect(card).toEqual({
      name: "React",
      description: "UI",
      years: 3,
      projectCount: 2,
      image: "/a.png",
      path: "/skills/react",
      year: undefined,
    });
  });

  it("maps a project with year and falls back to the default image", () => {
    const card = toCard("projects", { slug: "taskkar", name: "Taskkar", description: "Pitch", year: "2025", image: "" });
    expect(card.year).toBe("2025");
    expect(card.years).toBeUndefined();
    expect(card.projectCount).toBeUndefined();
    expect(card.image).toBe(FALLBACK_CARD_IMAGE);
    expect(card.path).toBe("/projects/taskkar");
  });

  it("maps experience company, summary and period", () => {
    const card = toCard("experience", { slug: "acme", company: "Acme", summary: "Built", period: "2023-now", image: "/x" });
    expect(card).toMatchObject({ name: "Acme", description: "Built", year: "2023-now" });
  });
});
