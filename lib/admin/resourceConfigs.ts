import type { Resource } from "../server/limits";

export type FieldType = "text" | "textarea" | "number" | "list" | "boolean" | "url";

export interface FieldConfig {
  name: string;
  label: string;
  type: FieldType;
  /** Character cap shown in the counter (text and textarea fields). */
  maxLength?: number;
  hint?: string;
  isOptional?: boolean;
  /** Edit-only read-only fields (e.g. text keys). */
  isLockedOnEdit?: boolean;
  /** Pick values from the slugs of another resource instead of typing them. */
  pickFrom?: Resource;
}

export interface ResourceConfig {
  label: string;
  /** Field used for the row title in the list. */
  titleField: string;
  /** Field the slug is generated from when creating (none for texts). */
  slugSourceField?: string;
  fields: FieldConfig[];
}

const ONE_LINER = 200;
const PARAGRAPH = 2000;
const TEXT_VALUE = 5000;
const SHORT = 60;
const URL_MAX = 500;
const IMAGE_HINT = "Path starting with / or https URL from allowed hosts";
const LIST_HINT = "One item per line (up to 20)";

const slugField: FieldConfig = {
  name: "slug",
  label: "Slug",
  type: "text",
  maxLength: 100,
  hint: "Lowercase letters, numbers and hyphens. Generated from the title, you can edit it.",
};
const imageField: FieldConfig = { name: "image", label: "Image", type: "url", maxLength: URL_MAX, hint: IMAGE_HINT };
const orderField: FieldConfig = { name: "order", label: "Order", type: "number", hint: "Lower numbers appear first" };
const visibleField: FieldConfig = { name: "isVisible", label: "Visible on site", type: "boolean" };

export const resourceConfigs: Record<Resource, ResourceConfig> = {
  projects: {
    label: "Projects",
    titleField: "name",
    slugSourceField: "name",
    fields: [
      slugField,
      { name: "name", label: "Name", type: "text", maxLength: ONE_LINER },
      { name: "description", label: "One-line pitch", type: "text", maxLength: ONE_LINER },
      { name: "problem", label: "Problem", type: "textarea", maxLength: PARAGRAPH },
      { name: "role", label: "Role", type: "text", maxLength: ONE_LINER },
      { name: "approach", label: "Approach", type: "textarea", maxLength: PARAGRAPH },
      { name: "impact", label: "Impact", type: "textarea", maxLength: PARAGRAPH },
      { name: "tags", label: "Tech tags", type: "list", hint: LIST_HINT },
      { name: "repoUrl", label: "Repository URL", type: "url", maxLength: URL_MAX, isOptional: true, hint: "https URL" },
      { name: "liveUrl", label: "Live URL", type: "url", maxLength: URL_MAX, isOptional: true, hint: "https URL" },
      { name: "year", label: "Year", type: "text", maxLength: SHORT, isOptional: true },
      imageField,
      orderField,
      { name: "isFeatured", label: "Featured", type: "boolean" },
      visibleField,
    ],
  },
  skills: {
    label: "Skills",
    titleField: "name",
    slugSourceField: "name",
    fields: [
      slugField,
      { name: "name", label: "Name", type: "text", maxLength: ONE_LINER },
      { name: "description", label: "Summary", type: "text", maxLength: ONE_LINER },
      { name: "detail", label: "Detail", type: "textarea", maxLength: PARAGRAPH },
      { name: "level", label: "Level (0-100)", type: "number" },
      { name: "years", label: "Years of experience", type: "number" },
      { name: "relatedProjects", label: "Related projects", type: "list", pickFrom: "projects", hint: "Tick the projects that use this skill" },
      { name: "category", label: "Category", type: "text", maxLength: SHORT },
      imageField,
      orderField,
      visibleField,
    ],
  },
  experience: {
    label: "Experience",
    titleField: "company",
    slugSourceField: "company",
    fields: [
      slugField,
      { name: "company", label: "Company", type: "text", maxLength: ONE_LINER },
      { name: "role", label: "Role", type: "text", maxLength: ONE_LINER },
      { name: "summary", label: "Summary", type: "textarea", maxLength: PARAGRAPH },
      { name: "location", label: "Location", type: "text", maxLength: ONE_LINER, isOptional: true },
      { name: "period", label: "Period", type: "text", maxLength: SHORT },
      { name: "bullets", label: "Achievements", type: "list", hint: LIST_HINT },
      { name: "tags", label: "Tech tags", type: "list", hint: LIST_HINT },
      { name: "impact", label: "Impact", type: "textarea", maxLength: PARAGRAPH },
      imageField,
      orderField,
      visibleField,
    ],
  },
  education: {
    label: "Education",
    titleField: "institution",
    slugSourceField: "institution",
    fields: [
      slugField,
      { name: "institution", label: "Institution", type: "text", maxLength: ONE_LINER },
      { name: "degree", label: "Degree", type: "text", maxLength: ONE_LINER },
      { name: "period", label: "Period", type: "text", maxLength: SHORT },
      { name: "description", label: "Description", type: "textarea", maxLength: PARAGRAPH, isOptional: true },
      imageField,
      orderField,
      visibleField,
    ],
  },
  texts: {
    label: "Texts",
    titleField: "key",
    fields: [
      { name: "key", label: "Key", type: "text", maxLength: 100, isLockedOnEdit: true },
      { name: "value", label: "Value", type: "textarea", maxLength: TEXT_VALUE, isOptional: true },
    ],
  },
};
