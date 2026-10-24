import { describe, expect, it } from "vitest";
import { CHAT_LIMITS } from "../chatLimits";
import { EMPTY_REPLY_TEXT, messagesToText, parseChatResponse, toHistory, type ChatMessage } from "../chat/chatClient";

const project = {
  id: "p1",
  name: "Proj",
  summary: "s",
  image: "https://img.test/a.png",
  tags: ["a", 1],
  liveUrl: "javascript:alert(1)",
  repoUrl: "http://insecure.test",
};

describe("parseChatResponse", () => {
  it("returns undefined for malformed bodies", () => {
    expect(parseChatResponse(null)).toBeUndefined();
    expect(parseChatResponse({})).toBeUndefined();
    expect(parseChatResponse({ data: { reply: 5 } })).toBeUndefined();
    expect(parseChatResponse({ data: [] })).toBeUndefined();
  });

  it("accepts a reply without blocks", () => {
    expect(parseChatResponse({ data: { reply: "hi" } })).toEqual({ reply: "hi", blocks: [] });
  });

  it("keeps relative and https images, drops unsafe ones", () => {
    const image = (value: string) => {
      const result = parseChatResponse({ data: { reply: "hi", blocks: [{ type: "projects", projects: [{ ...project, image: value }] }] } });
      const block = result?.blocks[0];
      return block?.type === "projects" ? block.projects[0].image : undefined;
    };
    expect(image("/img/projects/a.webp")).toBe("/img/projects/a.webp");
    expect(image("https://res.cloudinary.com/x/a.png")).toBe("https://res.cloudinary.com/x/a.png");
    for (const bad of ["//evil.com/x.png", "javascript:alert(1)", "http://x.com/a.png", "data:image/png;base64,AAA", "/a/../b.png"]) {
      expect(image(bad)).toBe("");
    }
  });

  it("falls back when reply and blocks are both empty", () => {
    expect(parseChatResponse({ data: { reply: " ", blocks: [] } })).toEqual({ reply: EMPTY_REPLY_TEXT, blocks: [] });
  });

  it("drops unknown or malformed blocks and unsafe hrefs", () => {
    const result = parseChatResponse({
      data: {
        reply: "hi",
        blocks: [
          { type: "evil" },
          "x",
          { type: "projects", projects: [project, { id: 1 }] },
          {
            type: "links",
            links: [
              { kind: "live", label: "Site", href: "https://ok.test/" },
              { kind: "live", label: "Bad", href: "javascript:alert(1)" },
              { kind: "nope", label: "Bad", href: "https://ok.test/" },
              { kind: "repo", label: "Http", href: "http://ok.test/" },
            ],
          },
          { type: "socials", links: [] },
        ],
      },
    });
    expect(result?.blocks).toHaveLength(2);
    expect(result?.blocks[0]).toEqual({
      type: "projects",
      projects: [{ ...project, tags: ["a"], liveUrl: "", repoUrl: "" }],
    });
    expect(result?.blocks[1]).toEqual({
      type: "links",
      links: [{ kind: "live", label: "Site", href: "https://ok.test/" }],
    });
  });

  it("keeps an empty contact block and caps block count", () => {
    const result = parseChatResponse({
      data: { reply: "hi", blocks: Array.from({ length: 6 }, () => ({ type: "contact", links: [] })) },
    });
    expect(result?.blocks).toHaveLength(3);
  });
});

describe("parseChatResponse skills", () => {
  const skill = { id: "react", name: "React", category: "Frontend", level: 80, years: 3, image: "/img/react.svg" };
  const parse = (skills: unknown[]) => {
    const block = parseChatResponse({ data: { reply: "hi", blocks: [{ type: "skills", skills }] } })?.blocks[0];
    return block?.type === "skills" ? block.skills : undefined;
  };

  it("parses a skills block and drops unknown fields", () => {
    expect(parse([{ ...skill, evil: "x", href: "https://x.test" }])).toEqual([skill]);
  });

  it("blanks unsafe images", () => {
    for (const bad of ["javascript:alert(1)", "//x", "http://x.com/a.png"]) {
      expect(parse([{ ...skill, image: bad }])?.[0].image).toBe("");
    }
  });

  it("drops bad ids and caps the list", () => {
    expect(parse([{ ...skill, id: "../x" }, { ...skill, id: "a b" }, skill])).toEqual([skill]);
    const many = Array.from({ length: 12 }, (_, i) => ({ ...skill, id: `s${i}` }));
    expect(parse(many)).toHaveLength(8);
  });

  it("sanitizes level and years", () => {
    const cases = [
      [Number.NaN, -3, 0, 0],
      ["9", "2", 0, 0],
      [250, 2.5, 100, 2.5],
      [-5, Infinity, 0, 0],
    ] as const;
    for (const [level, years, wantLevel, wantYears] of cases) {
      const parsed = parse([{ ...skill, level, years }])?.[0];
      expect(parsed?.level).toBe(wantLevel);
      expect(parsed?.years).toBe(wantYears);
    }
  });

  it("drops the block when empty", () => {
    expect(parseChatResponse({ data: { reply: "hi", blocks: [{ type: "skills", skills: [] }] } })?.blocks).toEqual([]);
  });
});

describe("history helpers", () => {
  const messages: ChatMessage[] = Array.from({ length: CHAT_LIMITS.historyTurns + 3 }, (_, index) => ({
    role: index % 2 ? "model" : "user",
    text: `m${index}`,
    blocks: [{ type: "contact", links: [] }],
  }));

  it("sends only the last turns with role and text", () => {
    const history = toHistory(messages);
    expect(history).toHaveLength(CHAT_LIMITS.historyTurns);
    expect(Object.keys(history[0]).sort()).toEqual(["role", "text"]);
    expect(history[history.length - 1].text).toBe(`m${messages.length - 1}`);
  });

  it("formats chat as text", () => {
    expect(messagesToText([{ role: "user", text: "a" }, { role: "model", text: "b" }])).toBe("You: a\n\nAssistant: b");
  });
});
