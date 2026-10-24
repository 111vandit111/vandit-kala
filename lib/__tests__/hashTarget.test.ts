import { describe, expect, it } from "vitest";
import { getHashTargetId, shouldCorrectScroll } from "../hashTarget";

describe("getHashTargetId", () => {
  it("strips the leading hash", () => {
    expect(getHashTargetId("#skills")).toBe("skills");
  });

  it("returns null for empty or bare hashes", () => {
    expect(getHashTargetId("")).toBeNull();
    expect(getHashTargetId("#")).toBeNull();
  });

  it("returns null for malformed encoding", () => {
    expect(getHashTargetId("#%E0%A4%A")).toBeNull();
  });
});

describe("shouldCorrectScroll", () => {
  it("ignores small drift", () => {
    expect(shouldCorrectScroll(90, 96)).toBe(false);
  });

  it("corrects when the target moved far", () => {
    expect(shouldCorrectScroll(300, 96)).toBe(true);
  });
});
