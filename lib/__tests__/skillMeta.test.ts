import { describe, expect, it } from "vitest";
import { formatSkillMeta } from "../skillMeta";

describe("formatSkillMeta", () => {
  it("joins years and project count", () => {
    expect(formatSkillMeta({ years: 3, projectCount: 2 })).toBe("3 yrs · Used in 2 projects");
  });

  it("uses singular wording", () => {
    expect(formatSkillMeta({ years: 1, projectCount: 1 })).toBe("1 yr · Used in 1 project");
  });

  it("omits missing or zero parts", () => {
    expect(formatSkillMeta({ years: 0, projectCount: 4 })).toBe("Used in 4 projects");
    expect(formatSkillMeta({})).toBe("");
  });
});
