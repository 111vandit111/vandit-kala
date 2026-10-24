const META_SEPARATOR = " · ";

export interface SkillMetaInput {
  years?: number;
  projectCount?: number;
}

const plural = (count: number, noun: string) => `${count} ${noun}${count === 1 ? "" : "s"}`;

export function formatSkillMeta({ years, projectCount }: SkillMetaInput): string {
  const parts: string[] = [];
  if (typeof years === "number" && years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (typeof projectCount === "number" && projectCount > 0) parts.push(`Used in ${plural(projectCount, "project")}`);
  return parts.join(META_SEPARATOR);
}
