import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { getEnv } from "./env";
import { fail, handleError } from "./http";
import { SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "./limits";

const MS_PER_SEC = 1000;
const TOKEN_SEPARATOR = ".";
const SAFE_METHODS = ["GET", "HEAD"];

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function sign(encodedPayload: string): string {
  return createHmac("sha256", getEnv().ADMIN_SESSION_SECRET).update(encodedPayload).digest("base64url");
}

function safeEqualStrings(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function readExp(encodedPayload: string): number | null {
  try {
    const payload: unknown = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    if (typeof payload !== "object" || payload === null || !("exp" in payload)) return null;
    const { exp } = payload;
    return typeof exp === "number" && Number.isFinite(exp) ? exp : null;
  } catch {
    return null;
  }
}

export function isPasswordValid(input: string): boolean {
  return timingSafeEqual(sha256(input), sha256(getEnv().ADMIN_PASSWORD));
}

export function createSessionToken(nowMs: number = Date.now()): string {
  const exp = nowMs + SESSION_MAX_AGE_SEC * MS_PER_SEC;
  const encodedPayload = Buffer.from(JSON.stringify({ exp }), "utf8").toString("base64url");
  return `${encodedPayload}${TOKEN_SEPARATOR}${sign(encodedPayload)}`;
}

export function verifySessionToken(token: string | undefined, nowMs: number = Date.now()): boolean {
  if (!token) return false;
  const parts = token.split(TOKEN_SEPARATOR);
  if (parts.length !== 2) return false;
  const [encodedPayload, signature] = parts;
  if (!encodedPayload || !signature) return false;
  if (!safeEqualStrings(signature, sign(encodedPayload))) return false;
  const exp = readExp(encodedPayload);
  return exp !== null && exp > nowMs;
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  };
}

export function getSessionCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie") ?? "";
  const prefix = `${SESSION_COOKIE}=`;
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));
  if (!match) return undefined;
  try {
    return decodeURIComponent(match.slice(prefix.length));
  } catch {
    return undefined;
  }
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("host") ?? new URL(request.url).host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function requireAdmin(request: Request): NextResponse | null {
  try {
    if (!verifySessionToken(getSessionCookie(request))) return fail(401, "Unauthorized");
    if (!SAFE_METHODS.includes(request.method.toUpperCase()) && !isSameOrigin(request)) {
      return fail(403, "Forbidden");
    }
    return null;
  } catch (err) {
    return handleError("requireAdmin", err);
  }
}

export async function isAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[isAdminSession] ${message}`);
    return false;
  }
}
