import { describe, expect, it } from "vitest";
import { CHAT_BLOCK_LIMITS } from "../../chatReply";
import type { ChatBlock } from "../../chatReply";
import { safeHttpsUrl } from "../../safeUrl";
import { parseModelReply, resolveReply, sanitizeReplyText, siteUrls } from "../chatResolver";
import type { ChatSiteData } from "../chatResolver";

function project(slug: string, extra: Record<string, unknown> = {}) {
  return {
    slug,
    name: `Project ${slug}`,
    description: `About ${slug}`,
    image: `/img/${slug}.webp`,
    tags: ["React", "Node"],
    liveUrl: `https://${slug}.example.com`,
    repoUrl: `https://github.com/me/${slug}`,
    ...extra,
  };
}

function skill(slug: string, extra: Record<string, unknown> = {}) {
  return {
    slug,
    name: `Skill ${slug}`,
    category: "Frontend",
    level: 80,
    years: 3,
    image: `/img/skills/${slug}.svg`,
    ...extra,
  };
}

const site: ChatSiteData = {
  projects: [
    project("alpha"),
    project("beta", { liveUrl: "", repoUrl: undefined }),
    project("gamma", { liveUrl: "javascript:alert(1)", repoUrl: "http://insecure.example.com/gamma" }),
    ...["d", "e", "f", "g"].map((slug) => project(slug)),
  ],
  skills: [skill("react"), skill("node-js", { category: "Backend" }), ...Array.from({ length: 12 }, (_, i) => skill(`s${i}`))],
  texts: {
    "social.github": "https://github.com/me",
    "social.linkedin": "https://linkedin.com/in/me",
    "social.instagram": "",
    "social.whatsapp": "http://wa.me/123",
    "resume.url": "https://example.com/resume.pdf",
  },
};

function resolve(text: string, blocks: { type: ChatBlock["type"]; ids?: string[] }[]) {
  return resolveReply({ text, blocks }, site);
}

describe("parseModelReply", () => {
  it("parses plain and code-fenced JSON", () => {
    const json = '{"text":"Hi","blocks":[{"type":"projects","ids":["alpha"]}]}';
    expect(parseModelReply(json)?.text).toBe("Hi");
    expect(parseModelReply("```json\n" + json + "\n```")?.blocks).toHaveLength(1);
    expect(parseModelReply("```\n" + json + "\n```")?.text).toBe("Hi");
  });

  it("accepts the skills block type", () => {
    const parsed = parseModelReply('{"text":"Hi","blocks":[{"type":"skills","ids":["react"]}]}');
    expect(parsed?.blocks).toEqual([{ type: "skills", ids: ["react"] }]);
  });

  it("defaults blocks to an empty list", () => {
    expect(parseModelReply('{"text":"Hi"}')).toEqual({ text: "Hi", blocks: [] });
  });

  it("returns undefined for malformed, partial or wrongly shaped output", () => {
    expect(parseModelReply("Vandit is an engineer.")).toBeUndefined();
    expect(parseModelReply('{"text":"Hi","blocks":[{"type":"projects"')).toBeUndefined();
    expect(parseModelReply('{"text":5,"blocks":[]}')).toBeUndefined();
    expect(parseModelReply('{"text":"Hi","blocks":[{"type":"script"}]}')).toBeUndefined();
    expect(parseModelReply('{"text":"Hi","blocks":[{"type":"skills","ids":["react"],"extra":1}]}')).toBeUndefined();
    expect(parseModelReply('{"text":"Hi","extra":1}')).toBeUndefined();
    expect(parseModelReply('{"text":"Hi","blocks":[{"type":"links","ids":[1]}]}')).toBeUndefined();
    expect(parseModelReply('["text"]')).toBeUndefined();
  });

  it("rejects too many blocks or ids", () => {
    const blocks = Array(7).fill({ type: "contact" });
    expect(parseModelReply(JSON.stringify({ text: "Hi", blocks }))).toBeUndefined();
    const ids = Array(13).fill("alpha");
    expect(parseModelReply(JSON.stringify({ text: "Hi", blocks: [{ type: "projects", ids }] }))).toBeUndefined();
  });
});

describe("resolveReply projects", () => {
  it("builds cards from site data in model order and ignores invented ids", () => {
    const reply = resolve("Here.", [{ type: "projects", ids: ["beta", "nope", "alpha", "../etc"] }]);
    const block = reply.blocks[0];
    expect(block.type).toBe("projects");
    if (block.type !== "projects") return;
    expect(block.projects.map((card) => card.id)).toEqual(["beta", "alpha"]);
    expect(block.projects[1]).toEqual({
      id: "alpha",
      name: "Project alpha",
      summary: "About alpha",
      image: "/img/alpha.webp",
      tags: ["React", "Node"],
      liveUrl: "https://alpha.example.com/",
      repoUrl: "https://github.com/me/alpha",
    });
    expect(block.projects[0].liveUrl).toBe("");
    expect(block.projects[0].repoUrl).toBe("");
  });

  it("keeps safe image values and drops unsafe ones", () => {
    const cases: [string, string][] = [
      ["/img/a.webp", "/img/a.webp"],
      ["https://res.cloudinary.com/x/a.png", "https://res.cloudinary.com/x/a.png"],
      ["//evil.com/x.png", ""],
      ["javascript:alert(1)", ""],
      ["http://x.com/a.png", ""],
      ["data:image/png;base64,AAA", ""],
      ["/a/../b.png", ""],
      ["/a\\b.png", ""],
    ];
    for (const [image, expected] of cases) {
      const local: ChatSiteData = { ...site, projects: [project("alpha", { image })] };
      const block = resolveReply({ text: "x", blocks: [{ type: "projects", ids: ["alpha"] }] }, local).blocks[0];
      expect(block.type === "projects" && block.projects[0].image).toBe(expected);
    }
  });

  it("drops non-https project URLs", () => {
    const reply = resolve("Here.", [{ type: "projects", ids: ["gamma"] }]);
    const block = reply.blocks[0];
    expect(block.type === "projects" && block.projects[0]).toMatchObject({ liveUrl: "", repoUrl: "" });
  });

  it("dedupes ids and caps at five projects", () => {
    const ids = ["alpha", "alpha", "beta", "gamma", "d", "e", "f", "g"];
    const block = resolve("Here.", [{ type: "projects", ids }]).blocks[0];
    expect(block.type === "projects" && block.projects.map((card) => card.id)).toEqual([
      "alpha",
      "beta",
      "gamma",
      "d",
      "e",
    ]);
    expect(CHAT_BLOCK_LIMITS.projects).toBe(5);
  });

  it("drops a projects block when no id resolves", () => {
    expect(resolve("Sorry.", [{ type: "projects", ids: ["nope"] }]).blocks).toEqual([]);
    expect(resolve("Sorry.", [{ type: "projects" }]).blocks).toEqual([]);
  });
});

describe("resolveReply skills", () => {
  const skillsOf = (ids: string[], local: ChatSiteData = site) => {
    const block = resolveReply({ text: "x", blocks: [{ type: "skills", ids }] }, local).blocks[0];
    return block?.type === "skills" ? block.skills : undefined;
  };

  it("builds cards in model order and drops unknown, empty and duplicate ids", () => {
    const skills = skillsOf(["node-js", "nope", "", "react", "node-js", "../x"]);
    expect(skills?.map((card) => card.id)).toEqual(["node-js", "react"]);
    expect(skills?.[1]).toEqual({
      id: "react",
      name: "Skill react",
      category: "Frontend",
      level: 80,
      years: 3,
      image: "/img/skills/react.svg",
    });
  });

  it("caps at eight skills", () => {
    const ids = Array.from({ length: 12 }, (_, i) => `s${i}`);
    expect(skillsOf(ids)?.map((card) => card.id)).toEqual(ids.slice(0, 8));
    expect(CHAT_BLOCK_LIMITS.skills).toBe(8);
  });

  it("drops the block when no id resolves", () => {
    expect(resolve("Sorry.", [{ type: "skills", ids: ["nope"] }]).blocks).toEqual([]);
    expect(resolve("Sorry.", [{ type: "skills" }]).blocks).toEqual([]);
  });

  it("drops prototype-key ids", () => {
    expect(skillsOf(["__proto__", "constructor", "toString", "hasOwnProperty"])).toBeUndefined();
  });

  it("blanks unsafe image values", () => {
    for (const image of ["javascript:alert(1)", "//evil.com/x.png", "http://x.com/a.png", "data:image/png;base64,AAA", 5, null]) {
      const local: ChatSiteData = { ...site, skills: [skill("react", { image })] };
      expect(skillsOf(["react"], local)?.[0].image).toBe("");
    }
  });

  it("keeps level and years safe for odd values", () => {
    const cases: [unknown, unknown, number, number][] = [
      ["high", "three", 0, 0],
      [NaN, Infinity, 0, 0],
      [150, -2, 100, 0],
      [-10, 2.5, 0, 2.5],
      [72.6, 4, 73, 4],
      [undefined, undefined, 0, 0],
    ];
    for (const [level, years, wantLevel, wantYears] of cases) {
      const local: ChatSiteData = { ...site, skills: [skill("react", { level, years })] };
      expect(skillsOf(["react"], local)?.[0]).toMatchObject({ level: wantLevel, years: wantYears });
    }
  });

  it("does not mix project and skill ids", () => {
    expect(skillsOf(["alpha"])).toBeUndefined();
    const block = resolve("Hi.", [{ type: "projects", ids: ["react"] }]).blocks;
    expect(block).toEqual([]);
  });
});

describe("resolveReply links", () => {
  it("resolves live, repo and social ids with labels", () => {
    const ids = ["live:alpha", "repo:alpha", "social:github"];
    const block = resolve("Links.", [{ type: "links", ids }]).blocks[0];
    expect(block.type === "links" && block.links).toEqual([
      { kind: "live", label: "Live site: Project alpha", href: "https://alpha.example.com/" },
      { kind: "repo", label: "GitHub: Project alpha", href: "https://github.com/me/alpha" },
      { kind: "github", label: "GitHub", href: "https://github.com/me" },
    ]);
  });

  it("skips ids that do not resolve, such as live: on a project without a live URL", () => {
    const ids = ["live:beta", "repo:beta", "live:gamma", "repo:gamma", "live:nope", "social:instagram", "social:whatsapp", "social:evil", "mailto:a", "alpha", "live:", ""];
    expect(resolve("Links.", [{ type: "links", ids }]).blocks).toEqual([]);
  });

  it("dedupes link ids", () => {
    const block = resolve("Links.", [{ type: "links", ids: ["live:alpha", "live:alpha"] }]).blocks[0];
    expect(block.type === "links" && block.links).toHaveLength(1);
  });
});

describe("resolveReply socials and contact", () => {
  it("lists every non-empty https social regardless of model ids", () => {
    for (const type of ["socials", "contact"] as const) {
      const block = resolve("Reach out.", [{ type, ids: ["social:github"] }]).blocks[0];
      expect(block.type).toBe(type);
      expect("links" in block && block.links.map((link) => link.kind)).toEqual(["github", "linkedin", "resume"]);
      expect("links" in block && block.links.map((link) => link.label)).toEqual(["GitHub", "LinkedIn", "Resume"]);
    }
  });

  it("drops the block when every social is empty", () => {
    const empty: ChatSiteData = { projects: [], skills: [], texts: {} };
    expect(resolveReply({ text: "Hi", blocks: [{ type: "contact" }] }, empty).blocks).toEqual([]);
  });
});

describe("resolveReply block limits", () => {
  it("keeps one block per type, at most three, and merges repeated ids", () => {
    const reply = resolve("Hi.", [
      { type: "projects", ids: ["alpha"] },
      { type: "projects", ids: ["d"] },
      { type: "contact" },
      { type: "socials" },
      { type: "links", ids: ["live:alpha"] },
    ]);
    expect(reply.blocks.map((block) => block.type)).toEqual(["projects", "contact", "socials"]);
    const first = reply.blocks[0];
    expect(first.type === "projects" && first.projects.map((card) => card.id)).toEqual(["alpha", "d"]);
  });

  it("uses a short fallback text when only blocks were returned", () => {
    expect(resolve("", [{ type: "contact" }]).reply).not.toBe("");
    expect(resolve("", [])).toEqual({ reply: "", blocks: [] });
  });
});

describe("sanitizeReplyText", () => {
  const allowed = siteUrls(site);

  it("strips HTML tags and control characters", () => {
    expect(sanitizeReplyText("Hi <script>alert(1)</script><b>there</b>\u0000\u0007!", allowed)).toBe("Hi alert(1)there !");
  });

  it("reduces markdown links and images to their label", () => {
    expect(sanitizeReplyText("See [my site](https://evil.example.com) and ![logo](https://evil.example.com/x.png).", allowed)).toBe(
      "See my site and logo."
    );
    expect(sanitizeReplyText("**Bold** and `code`", allowed)).toBe("Bold and code");
  });

  it("removes URLs that are not in site data and keeps site URLs", () => {
    const text = "Visit https://evil.example.com, www.evil.example.com or https://github.com/me/alpha now.";
    expect(sanitizeReplyText(text, allowed)).toBe("Visit , or https://github.com/me/alpha now.");
    expect(sanitizeReplyText("Go to https://github.com/me/", allowed)).toBe("Go to https://github.com/me/");
    expect(sanitizeReplyText("javascript:alert(1) and http://insecure.example.com/gamma", allowed)).not.toContain("http://");
  });

  it("collapses whitespace and caps the length", () => {
    expect(sanitizeReplyText("a \n\n  b\t c", allowed)).toBe("a b c");
    expect(sanitizeReplyText("x".repeat(CHAT_BLOCK_LIMITS.replyChars + 500), allowed)).toHaveLength(CHAT_BLOCK_LIMITS.replyChars);
  });

  it("applies to resolved replies", () => {
    const reply = resolve("Open <a href='x'>this</a> https://evil.example.com [here](javascript:alert(1))", []);
    expect(reply.reply).toBe("Open this here");
  });
});

describe("safeHttpsUrl", () => {
  it("accepts only https URLs", () => {
    expect(safeHttpsUrl("https://example.com")).toBe("https://example.com/");
    expect(safeHttpsUrl("http://example.com")).toBe("");
    expect(safeHttpsUrl("javascript:alert(1)")).toBe("");
    expect(safeHttpsUrl("//example.com")).toBe("");
    expect(safeHttpsUrl("")).toBe("");
    expect(safeHttpsUrl(undefined)).toBe("");
  });
});
