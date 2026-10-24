import { describe, expect, it } from "vitest";
import { EDUCATION, EXPERIENCE, PROJECTS, SKILLS } from "../seed/seedData";
import { existsSync } from "node:fs";
import path from "node:path";
import { PLACEHOLDER_IMAGE, isReplaceableImage, seedImageUrl } from "../seed/seedImages";
import { deliveryUrl, parseUploadArgs, planUpload, readCredentials, signParams } from "../cloudinaryUpload";
import { profileImageUrl } from "../../imageUtils";
import { resourceSchemas } from "../schemas";

const LOCAL_IMAGE = /^\/img\/(skills|projects|experience|education)\/[a-z0-9-]+\.(svg|webp)$/;
const SEEDED = [...PROJECTS, ...SKILLS, ...EXPERIENCE, ...EDUCATION];

describe("seeded images", () => {
  it("are local /img paths whose file exists, never Cloudinary URLs", () => {
    for (const item of SEEDED) {
      expect(item.image, item.image).toMatch(LOCAL_IMAGE);
      expect(existsSync(path.join(process.cwd(), "public", item.image)), item.image).toBe(true);
    }
  });

  it("only replaces an empty, placeholder or migrated vandit-portfolio Cloudinary image", () => {
    expect(isReplaceableImage("")).toBe(true);
    expect(isReplaceableImage(undefined)).toBe(true);
    expect(isReplaceableImage(PLACEHOLDER_IMAGE)).toBe(true);
    expect(isReplaceableImage("https://res.cloudinary.com/demo/image/upload/vandit-portfolio/skills/react-19.svg")).toBe(true);
    expect(isReplaceableImage("https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/vandit-portfolio/projects/taskkar")).toBe(true);
    expect(isReplaceableImage("https://res.cloudinary.com/demo/image/upload/vandit-portfolio/profile/vandit-hero")).toBe(false);
    expect(isReplaceableImage("https://res.cloudinary.com/x/y.png")).toBe(false);
    expect(isReplaceableImage("/img/skills/react-19.svg")).toBe(false);
  });

  it("builds the local path from resource and slug", () => {
    expect(seedImageUrl("projects", "taskkar")).toBe("/img/projects/taskkar.webp");
    expect(seedImageUrl("skills", "react-19")).toBe("/img/skills/react-19.svg");
  });

  it("builds the profile photo URLs on Cloudinary in one place", () => {
    expect(profileImageUrl("recruiter")).toBe("https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/vandit-portfolio/profile/vandit-hero");
    expect(profileImageUrl("playful")).toBe("https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/vandit-portfolio/profile/vandit-playful");
  });
});

describe("image validation", () => {
  const { create } = resourceSchemas.education;
  const base = { slug: "uni", institution: "Uni", degree: "BSc", period: "2019 - 2023", order: 1, isVisible: true };

  it("accepts local paths and Cloudinary URLs", () => {
    expect(create.safeParse({ ...base, image: "/img/education/jain-university.svg" }).success).toBe(true);
    expect(create.safeParse({ ...base, image: "/vanditkalahero.png" }).success).toBe(true);
    expect(create.safeParse({ ...base, image: "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/a/b.svg" }).success).toBe(true);
  });

  it("rejects protocol-relative image URLs", () => {
    expect(create.safeParse({ ...base, image: "//evil.example.com/a.png" }).success).toBe(false);
  });
});

describe("cloudinary helpers", () => {
  it("signs sorted params deterministically", () => {
    const signature = signParams({ timestamp: "1", public_id: "a/b", overwrite: "true" }, "secret");
    expect(signature).toBe(signParams({ overwrite: "true", public_id: "a/b", timestamp: "1" }, "secret"));
    expect(signature).toMatch(/^[0-9a-f]{40}$/);
  });

  it("delivers svg files untransformed with their extension and other files through f_auto,q_auto", () => {
    expect(deliveryUrl("demo", { publicId: "p/skills/x", extension: "svg" })).toBe("https://res.cloudinary.com/demo/image/upload/p/skills/x.svg");
    expect(deliveryUrl("demo", { publicId: "p/projects/y", extension: "webp" })).toBe("https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/p/projects/y");
  });

  it("reports missing credentials as null", () => {
    expect(readCredentials({ CLOUDINARY_CLOUD_NAME: "demo" })).toBeNull();
    expect(readCredentials({ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: "demo", CLOUDINARY_API_KEY: "k", CLOUDINARY_API_SECRET: "s" })).toEqual({ cloudName: "demo", apiKey: "k", apiSecret: "s" });
  });

  it("uploads only a profile photo given by --file, and supports --dry-run", () => {
    const args = parseUploadArgs(["--file", "/tmp/vandit-hero.webp", "--folder", "profile", "--dry-run"]);
    expect(args).toEqual({ filePath: "/tmp/vandit-hero.webp", folder: "profile", isDryRun: true });
    expect(() => parseUploadArgs([])).toThrow(/--file/);
    expect(() => planUpload({ ...args, folder: "skills" })).toThrow(/profile/);
    expect(() => planUpload({ ...args, filePath: "/tmp/does-not-exist.webp" })).toThrow(/does not exist/);
  });
});
