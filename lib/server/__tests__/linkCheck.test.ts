import { describe, expect, it, vi } from "vitest";
import { probeUrl, type FetchFn } from "../linkCheck";

describe("probeUrl", () => {
  it("treats a 2xx HEAD response as healthy", async () => {
    const fetchFn: FetchFn = vi.fn().mockResolvedValue({ status: 200 });
    expect(await probeUrl("https://ok.test", fetchFn)).toEqual({ url: "https://ok.test", status: 200, isBroken: false });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it("retries with GET when HEAD fails and reports the GET result", async () => {
    const fetchFn: FetchFn = vi.fn().mockResolvedValueOnce({ status: 405 }).mockResolvedValueOnce({ status: 200 });
    expect((await probeUrl("https://head-blocked.test", fetchFn)).isBroken).toBe(false);
    expect(fetchFn).toHaveBeenCalledTimes(2);
  });

  it("flags a persistent 5xx as broken", async () => {
    const fetchFn: FetchFn = vi.fn().mockResolvedValue({ status: 500 });
    expect(await probeUrl("https://down.test", fetchFn)).toMatchObject({ status: 500, isBroken: true });
  });

  it("flags a network failure as broken", async () => {
    const fetchFn: FetchFn = vi.fn().mockRejectedValue(new Error("getaddrinfo ENOTFOUND"));
    expect(await probeUrl("https://gone.test", fetchFn)).toMatchObject({ error: "getaddrinfo ENOTFOUND", isBroken: true });
  });
});
