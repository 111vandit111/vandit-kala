import { beforeEach, describe, expect, it, vi } from "vitest";

const { runAsync } = vi.hoisted(() => ({ runAsync: vi.fn() }));

vi.mock("../env", () => ({ getChatApiKey: () => "test-key" }));
vi.mock("../contentService", () => ({
  getTextMap: async () => ({ "social.github": "https://github.com/me" }),
  listPublic: async () => [],
}));
vi.mock("@google/adk", () => ({
  LlmAgent: class {},
  InMemoryRunner: class {
    sessionService = { createSession: async () => ({ id: "s1" }) };
    runAsync = runAsync;
  },
  isFinalResponse: (event: { final?: boolean }) => Boolean(event.final),
  stringifyContent: (event: { content?: { parts?: { text?: string }[] } }) =>
    (event.content?.parts ?? []).map((part) => part.text ?? "").join(""),
}));

import { answerQuestion } from "../chatService";

function events(...list: Record<string, unknown>[]) {
  return (async function* () {
    for (const event of list) yield event;
  })();
}

const good = { final: true, content: { parts: [{ text: '{"text":"He uses React and Node.","blocks":[]}' }] } };
const empty = { final: true, content: { parts: [] } };
const overloaded = { errorCode: "503", errorMessage: "This model is currently experiencing high demand." };

describe("answerQuestion retry and fallback", () => {
  beforeEach(() => {
    runAsync.mockReset();
  });

  it("retries once after an overloaded (503) model response and returns the good reply", async () => {
    runAsync.mockReturnValueOnce(events(overloaded)).mockReturnValueOnce(events(good));
    const reply = await answerQuestion({ message: "tech stack", history: [] });
    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(reply).toEqual({ reply: "He uses React and Node.", blocks: [] });
  });

  it("retries after an empty final event", async () => {
    runAsync.mockReturnValueOnce(events(empty)).mockReturnValueOnce(events(good));
    const reply = await answerQuestion({ message: "tech stack", history: [] });
    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(reply.reply).toBe("He uses React and Node.");
  });

  it("returns a graceful fallback with a contact block when every attempt is empty", async () => {
    runAsync.mockImplementation(() => events(overloaded));
    const reply = await answerQuestion({ message: "tech stack", history: [] });
    expect(runAsync).toHaveBeenCalledTimes(2);
    expect(reply.reply).toContain("couldn't put an answer together");
    expect(reply.blocks.map((block) => block.type)).toEqual(["contact"]);
  });

  it("throws for non-transient model errors such as auth failures", async () => {
    runAsync.mockReturnValue(events({ errorCode: "403", errorMessage: "API key invalid" }));
    await expect(answerQuestion({ message: "hi", history: [] })).rejects.toThrow("Chat model error 403");
    expect(runAsync).toHaveBeenCalledTimes(1);
  });
});
