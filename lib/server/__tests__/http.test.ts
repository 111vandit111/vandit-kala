import { describe, expect, it } from "vitest";
import { z } from "zod";
import { parseBody, parsePagination } from "../http";
import { MAX_BODY_BYTES, PAGE_SIZE_DEFAULT, PAGE_SIZE_MAX } from "../limits";

const schema = z.object({ a: z.string() }).strict();

function jsonRequest(body: string, contentType = "application/json") {
  return new Request("http://localhost/api/x", {
    method: "POST",
    headers: { "content-type": contentType },
    body,
  });
}

describe("parsePagination", () => {
  it("uses defaults", () => {
    expect(parsePagination(new URL("http://x/?"))).toEqual({ page: 1, pageSize: PAGE_SIZE_DEFAULT });
  });

  it("clamps page size and bad values", () => {
    const result = parsePagination(new URL("http://x/?page=-3&pageSize=100000"));
    expect(result).toEqual({ page: 1, pageSize: PAGE_SIZE_MAX });
  });
});

describe("parseBody", () => {
  it("returns the value for valid JSON", async () => {
    const result = await parseBody(jsonRequest('{"a":"b"}'), schema);
    expect(result).toEqual({ ok: true, value: { a: "b" } });
  });

  it("rejects non-JSON content type with 415", async () => {
    const result = await parseBody(jsonRequest("a=b", "text/plain"), schema);
    expect(!result.ok && result.response.status).toBe(415);
  });

  it("rejects an oversized body with 413", async () => {
    const big = JSON.stringify({ a: "x".repeat(MAX_BODY_BYTES) });
    const result = await parseBody(jsonRequest(big), schema);
    expect(!result.ok && result.response.status).toBe(413);
  });

  it("rejects invalid shape with 400", async () => {
    const result = await parseBody(jsonRequest('{"b":1}'), schema);
    expect(!result.ok && result.response.status).toBe(400);
  });
});
