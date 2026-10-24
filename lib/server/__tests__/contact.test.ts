import { beforeEach, describe, expect, it, vi } from "vitest";

const { create, findByIdAndDelete } = vi.hoisted(() => ({
  create: vi.fn(),
  findByIdAndDelete: vi.fn(),
}));

vi.mock("../db", () => ({ connectDb: vi.fn().mockResolvedValue(undefined) }));
vi.mock("../models/Message", () => ({ default: { create, findByIdAndDelete } }));

import { deleteMessage, saveMessage } from "../contactService";
import { NotFoundError } from "../errors";
import { RATE_LIMITS } from "../limits";
import { checkRateLimit } from "../rateLimit";
import { contactSchema } from "../schemas";

describe("saveMessage", () => {
  beforeEach(() => {
    create.mockReset();
  });

  it("stores only the form fields", async () => {
    create.mockResolvedValue({});
    await saveMessage({ name: "A", email: "a@b.co", subject: "Hi", message: "<script>x</script>" });
    expect(create).toHaveBeenCalledWith({
      name: "A",
      email: "a@b.co",
      subject: "Hi",
      message: "<script>x</script>",
    });
  });
});

describe("deleteMessage", () => {
  it("throws NotFoundError when nothing was deleted", async () => {
    findByIdAndDelete.mockReturnValue({ lean: () => Promise.resolve(null) });
    await expect(deleteMessage("507f1f77bcf86cd799439011")).rejects.toBeInstanceOf(NotFoundError);
  });
});

describe("contact limits", () => {
  it("rejects a filled honeypot and an over-long message", () => {
    const base = { name: "A", email: "a@b.co", subject: "Hi", message: "Hello" };
    expect(contactSchema.safeParse({ ...base, website: "spam" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: "x".repeat(2001) }).success).toBe(false);
    expect(contactSchema.safeParse(base).success).toBe(true);
  });

  it("rate limits after the contact maximum", () => {
    const request = new Request("http://localhost/api/contact", { headers: { "x-forwarded-for": "198.51.100.77" } });
    for (let i = 0; i < RATE_LIMITS.contact.max; i += 1) {
      expect(checkRateLimit("contact", request).allowed).toBe(true);
    }
    expect(checkRateLimit("contact", request).allowed).toBe(false);
  });
});
