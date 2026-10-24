import { beforeEach, describe, expect, it, vi } from "vitest";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.mock("../db", () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../models/Project", () => ({ default: { create } }));
vi.mock("../models/Skill", () => ({ default: {} }));
vi.mock("../models/Experience", () => ({ default: {} }));
vi.mock("../models/Education", () => ({ default: {} }));
vi.mock("../models/TextContent", () => ({ default: {} }));

import { createItem } from "../contentService";
import { DuplicateError } from "../errors";
import { resourceSchemas } from "../schemas";

describe("createItem", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("maps Mongo duplicate key error 11000 to DuplicateError", async () => {
    create.mockImplementation(() => Promise.reject(Object.assign(new Error("E11000"), { code: 11000 })));
    await expect(createItem("projects", { slug: "a" })).rejects.toBeInstanceOf(DuplicateError);
  });

  it("rethrows other errors", async () => {
    create.mockImplementation(() => Promise.reject(new Error("boom")));
    await expect(createItem("projects", { slug: "a" })).rejects.toThrow("boom");
  });
});

describe("resource schemas", () => {
  it("rejects operator-injection payloads in updates", () => {
    expect(resourceSchemas.projects.update.safeParse({ name: { $ne: null } }).success).toBe(false);
    expect(resourceSchemas.projects.update.safeParse({ $set: { name: "x" } }).success).toBe(false);
  });

  it("accepts a partial valid update", () => {
    expect(resourceSchemas.projects.update.safeParse({ name: "New name" }).success).toBe(true);
  });
});
