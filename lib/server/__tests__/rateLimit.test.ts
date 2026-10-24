import { describe, expect, it } from "vitest";
import { RATE_LIMITS } from "../limits";
import { checkRateLimit } from "../rateLimit";

const NOW = 1_700_000_000_000;

function requestFrom(ip: string) {
  return new Request("http://localhost/api/x", { headers: { "x-forwarded-for": `198.51.100.99, ${ip}` } });
}

describe("checkRateLimit", () => {
  it("blocks the attempt after the limit and recovers after the window", () => {
    const request = requestFrom("203.0.113.1");
    const { max, windowSec } = RATE_LIMITS.login;
    for (let i = 0; i < max; i += 1) {
      expect(checkRateLimit("login", request, NOW).allowed).toBe(true);
    }
    const blocked = checkRateLimit("login", request, NOW + 1000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBe(windowSec - 1);
    expect(checkRateLimit("login", request, NOW + windowSec * 1000).allowed).toBe(true);
  });

  it("keeps clients and buckets separate", () => {
    const request = requestFrom("203.0.113.2");
    for (let i = 0; i < RATE_LIMITS.login.max; i += 1) checkRateLimit("login", request, NOW);
    expect(checkRateLimit("login", request, NOW).allowed).toBe(false);
    expect(checkRateLimit("contact", request, NOW).allowed).toBe(true);
    expect(checkRateLimit("login", requestFrom("203.0.113.3"), NOW).allowed).toBe(true);
  });

  it("ignores a spoofed first x-forwarded-for hop", () => {
    const at = (spoof: string) =>
      new Request("http://localhost/api/x", { headers: { "x-forwarded-for": `${spoof}, 203.0.113.50` } });
    for (let i = 0; i < RATE_LIMITS.login.max; i += 1) checkRateLimit("login", at(`1.1.1.${i}`), NOW);
    expect(checkRateLimit("login", at("9.9.9.9"), NOW).allowed).toBe(false);
  });

  it("falls back to x-real-ip, then a shared unknown key", () => {
    const realIp = new Request("http://localhost/api/x", { headers: { "x-real-ip": "198.51.100.7" } });
    expect(checkRateLimit("track", realIp, NOW).allowed).toBe(true);
    expect(checkRateLimit("track", new Request("http://localhost/api/x"), NOW).allowed).toBe(true);
  });
});
