import type { ChatTurn } from "../chatLimits";
import type { ChatReply } from "../chatReply";
import { parseModelReply, resolveReply, sanitizeReplyText, siteUrls } from "./chatResolver";
import type { ChatSiteData } from "./chatResolver";
import { buildKnowledge, buildPrompt, CHAT_SYSTEM_INSTRUCTION } from "./chatKnowledge";
import { getTextMap, listPublic } from "./contentService";
import { getChatApiKey } from "./env";
import type { ProfileType } from "./limits";

export const CHAT_MODEL = "gemini-3.5-flash-lite";

const APP_NAME = "vandit-portfolio";
const AGENT_NAME = "vandit_assistant";
const VISITOR_ID = "visitor";
const KNOWLEDGE_TTL_MS = 60000;
const MODEL_ATTEMPTS = 2;
const RETRY_DELAY_MS = 300;
const MODEL_TIMEOUT_MS = 20000;
const FALLBACK_REPLY = "Sorry, I couldn't put an answer together. Try asking again, or message Vandit directly.";

const TONE_BY_PROFILE: Record<ProfileType, string> = {
  recruiter: "The visitor is viewing the recruiter profile: be professional and concise.",
  personal: "The visitor is viewing the friends and family profile: be warm and casual, still accurate.",
  stalker: "The visitor is viewing the random visitor profile: be friendly and lightly playful, still accurate.",
};

export class ChatUnavailableError extends Error {
  constructor(message = "Chat is not available right now") {
    super(message);
    this.name = "ChatUnavailableError";
  }
}

type CachedKnowledge = { text: string; site: ChatSiteData; expiresAtMs: number };

let cachedKnowledge: CachedKnowledge | undefined;

async function loadKnowledge(nowMs: number = Date.now()): Promise<CachedKnowledge> {
  if (cachedKnowledge && cachedKnowledge.expiresAtMs > nowMs) return cachedKnowledge;
  const [texts, projects, skills, experience, education] = await Promise.all([
    getTextMap(),
    listPublic("projects"),
    listPublic("skills"),
    listPublic("experience"),
    listPublic("education"),
  ]);
  const text = buildKnowledge({ texts, projects, skills, experience, education });
  cachedKnowledge = { text, site: { projects, skills, texts }, expiresAtMs: nowMs + KNOWLEDGE_TTL_MS };
  return cachedKnowledge;
}

function buildInstruction(knowledge: string, profile?: ProfileType): string {
  const tone = profile ? `${TONE_BY_PROFILE[profile]}\n` : "";
  return `${tone}${CHAT_SYSTEM_INSTRUCTION}\n${knowledge}`;
}

// Gemini reports overload ("high demand") as an error event with no content, not as an exception.
const TRANSIENT_ERROR_CODES = new Set(["429", "500", "503", "504", "RESOURCE_EXHAUSTED", "UNAVAILABLE", "DEADLINE_EXCEEDED", "INTERNAL"]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Importing the SDK is slow on a cold start; answerQuestion warms it while the knowledge loads.
let adkPromise: Promise<typeof import("@google/adk")> | undefined;

function loadAdk(): Promise<typeof import("@google/adk")> {
  adkPromise ??= import("@google/adk");
  return adkPromise;
}

async function askModel(instruction: string, prompt: string): Promise<string> {
  const { LlmAgent, InMemoryRunner, isFinalResponse, stringifyContent } = await loadAdk();
  const agent = new LlmAgent({
    name: AGENT_NAME,
    model: CHAT_MODEL,
    instruction,
    generateContentConfig: { responseMimeType: "application/json" },
  });
  const runner = new InMemoryRunner({ agent, appName: APP_NAME });
  const session = await runner.sessionService.createSession({ appName: APP_NAME, userId: VISITOR_ID });
  let text = "";
  for await (const event of runner.runAsync({
    userId: VISITOR_ID,
    sessionId: session.id,
    newMessage: { role: "user", parts: [{ text: prompt }] },
  })) {
    if (event.errorCode) {
      if (!TRANSIENT_ERROR_CODES.has(String(event.errorCode))) {
        throw new Error(`Chat model error ${String(event.errorCode)}`);
      }
      continue;
    }
    if (!isFinalResponse(event)) continue;
    text += stringifyContent(event) || (event.content?.parts ?? []).map((part) => part.text ?? "").join("");
  }
  return text.trim();
}

async function askModelWithRetry(instruction: string, prompt: string): Promise<string> {
  const deadlineMs = Date.now() + MODEL_TIMEOUT_MS;
  for (let attempt = 0; attempt < MODEL_ATTEMPTS; attempt += 1) {
    if (attempt > 0) await sleep(RETRY_DELAY_MS);
    const remainingMs = deadlineMs - Date.now();
    if (remainingMs <= 0) break;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new ChatUnavailableError("Chat model timed out")), remainingMs);
    });
    try {
      const text = await Promise.race([askModel(instruction, prompt), timeout]);
      if (text) return text;
    } finally {
      clearTimeout(timer);
    }
  }
  return "";
}

export async function answerQuestion(input: {
  message: string;
  history: ChatTurn[];
  profile?: ProfileType;
}): Promise<ChatReply> {
  if (!getChatApiKey()) throw new ChatUnavailableError();
  const [{ text: knowledgeText, site }] = await Promise.all([loadKnowledge(), loadAdk()]);
  const reply = await askModelWithRetry(buildInstruction(knowledgeText, input.profile), buildPrompt(input.history, input.message));
  if (!reply) return resolveReply({ text: FALLBACK_REPLY, blocks: [{ type: "contact" }] }, site);
  const model = parseModelReply(reply);
  const result: ChatReply = model
    ? resolveReply(model, site)
    : { reply: sanitizeReplyText(reply, siteUrls(site)), blocks: [] };
  if (!result.reply) return resolveReply({ text: FALLBACK_REPLY, blocks: [{ type: "contact" }] }, site);
  return result;
}
