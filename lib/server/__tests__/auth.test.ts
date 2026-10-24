import { beforeAll, describe, expect, it, vi } from "vitest";
import {
  createSessionToken,
  isPasswordValid,
  requireAdmin,
  sessionCookieOptions,
  verifySessionToken,
} from "../auth";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "../limits";

const PASSWORD = "correct horse battery staple";
const NOW = 1_700_000_000_000;
const MAX_AGE_MS = SESSION_MAX_AGE_SEC * 1000;

beforeAll(() => {
  vi.stubEnv("MONGODB_URI", "mongodb://127.0.0.1:27017/test");
  vi.stubEnv("ADMIN_PASSWORD", PASSWORD);
  vi.stubEnv("ADMIN_SESSION_SECRET", "s".repeat(40));
});

function adminRequest(method: string, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/admin/x", { method, headers });
}

describe("isPasswordValid", () => {
  it("accepts the right password", () => {
    expect(isPasswordValid(PASSWORD)).toBe(true);
  });

  it("rejects wrong, empty and very long passwords", () => {
    expect(isPasswordValid("wrong")).toBe(false);
    expect(isPasswordValid("")).toBe(false);
    expect(isPasswordValid(PASSWORD.repeat(100))).toBe(false);
  });
});

describe("session tokens", () => {
  it("round-trips a fresh token", () => {
    expect(verifySessionToken(createSessionToken(NOW), NOW + 1)).toBe(true);
  });

  it("rejects an expired token", () => {
    expect(verifySessionToken(createSessionToken(NOW), NOW + MAX_AGE_MS)).toBe(false);
  });

  it("rejects a tampered payload", () => {
    const [, signature] = createSessionToken(NOW).split(".");
    const forged = Buffer.from(JSON.stringify({ exp: NOW * 2 })).toString("base64url");
    expect(verifySessionToken(`${forged}.${signature}`, NOW)).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const token = createSessionToken(NOW);
    const flipped = token.slice(0, -1) + (token.endsWith("A") ? "B" : "A");
    expect(verifySessionToken(flipped, NOW)).toBe(false);
  });

  it("rejects malformed tokens", () => {
    for (const token of [undefined, "", "abc", "a.b.c", ".", "abc."]) {
      expect(verifySessionToken(token, NOW)).toBe(false);
    }
  });
});

describe("sessionCookieOptions", () => {
  it("is httpOnly, strict and scoped to the session lifetime", () => {
    expect(sessionCookieOptions()).toMatchObject({
      httpOnly: true,
      sameSite: "strict",
      path: "/",
      maxAge: SESSION_MAX_AGE_SEC,
    });
  });
});

describe("requireAdmin", () => {
  it("returns 401 without a session", async () => {
    const response = requireAdmin(adminRequest("GET"));
    expect(response?.status).toBe(401);
    expect(await response?.json()).toEqual({ error: "Unauthorized" });
  });

  it("allows a GET with a valid session", () => {
    const cookie = `${SESSION_COOKIE}=${createSessionToken()}`;
    expect(requireAdmin(adminRequest("GET", { cookie }))).toBeNull();
  });

  it("returns 403 for a cross-origin or origin-less mutation", () => {
    const cookie = `${SESSION_COOKIE}=${createSessionToken()}`;
    const crossOrigin = adminRequest("POST", { cookie, host: "localhost:3000", origin: "https://evil.example" });
    expect(requireAdmin(crossOrigin)?.status).toBe(403);
    expect(requireAdmin(adminRequest("DELETE", { cookie, host: "localhost:3000" }))?.status).toBe(403);
  });

  it("allows a same-origin mutation", () => {
    const cookie = `${SESSION_COOKIE}=${createSessionToken()}`;
    const request = adminRequest("PATCH", { cookie, host: "localhost:3000", origin: "http://localhost:3000" });
    expect(requireAdmin(request)).toBeNull();
  });
});
