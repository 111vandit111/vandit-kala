import { createHash } from "node:crypto";
import { RATE_LIMITS } from "./limits";

export type RateLimitBucket = keyof typeof RATE_LIMITS;
export type RateLimitResult = { allowed: boolean; retryAfterSec: number };

type WindowEntry = { count: number; resetAtMs: number };

const MS_PER_SEC = 1000;
const MAX_TRACKED_KEYS = 10000;
const UNKNOWN_CLIENT = "unknown";

const windows = new Map<string, WindowEntry>();

function clientKey(request: Request): string {
  // Use the LAST hop: the proxy appends the real peer there; earlier hops are client-controlled and spoofable.
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const ip = forwardedFor || realIp || UNKNOWN_CLIENT;
  return createHash("sha256").update(ip, "utf8").digest("hex");
}

function makeRoom(nowMs: number): void {
  if (windows.size < MAX_TRACKED_KEYS) return;
  for (const [key, entry] of windows) {
    if (entry.resetAtMs <= nowMs) windows.delete(key);
  }
  if (windows.size < MAX_TRACKED_KEYS) return;
  const oldestKey = windows.keys().next().value;
  if (oldestKey !== undefined) windows.delete(oldestKey);
}

export function checkRateLimit(
  bucket: RateLimitBucket,
  request: Request,
  nowMs: number = Date.now()
): RateLimitResult {
  const { max, windowSec } = RATE_LIMITS[bucket];
  const key = `${bucket}:${clientKey(request)}`;
  const entry = windows.get(key);
  if (!entry || entry.resetAtMs <= nowMs) {
    windows.delete(key);
    makeRoom(nowMs);
    windows.set(key, { count: 1, resetAtMs: nowMs + windowSec * MS_PER_SEC });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= max) {
    return { allowed: false, retryAfterSec: Math.max(1, Math.ceil((entry.resetAtMs - nowMs) / MS_PER_SEC)) };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}
