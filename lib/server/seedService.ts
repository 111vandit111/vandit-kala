import type { Model } from "mongoose";
import { connectDb } from "./db";
import Project from "./models/Project";
import Skill from "./models/Skill";
import Experience from "./models/Experience";
import Education from "./models/Education";
import TextContent from "./models/TextContent";
import { EDUCATION, EXPERIENCE, PROJECTS, SKILLS, TEXTS } from "./seed/seedData";
import { LEGACY_FIELDS, LEGACY_TEXTS } from "./seed/legacyCopy";

export interface SeedResult {
  created: number;
  updated: number;
}

type KeyField = "slug" | "key";

// Every field is $setOnInsert, so re-running never overwrites edits the owner made in admin.
// Timestamps are set by hand because Mongoose would otherwise touch updatedAt on every run.
async function upsertAll<T extends { [K in KeyField]?: string }>(
  model: Model<Record<string, unknown>>,
  keyField: KeyField,
  items: T[]
): Promise<SeedResult> {
  if (items.length === 0) return { created: 0, updated: 0 };
  const now = new Date();
  const operations = items.map((item) => {
    const { [keyField]: keyValue, ...fields } = item;
    return {
      updateOne: {
        filter: { [keyField]: keyValue },
        update: { $setOnInsert: { ...fields, createdAt: now, updatedAt: now } },
        upsert: true,
        timestamps: false,
      },
    };
  });
  const result = await model.bulkWrite(operations);
  return { created: result.upsertedCount, updated: result.modifiedCount };
}

export async function seedAll(): Promise<SeedResult> {
  await connectDb();
  const texts = Object.entries(TEXTS).map(([key, value]) => ({ key, value }));
  const results = [
    await upsertAll(Project, "slug", PROJECTS),
    await upsertAll(Skill, "slug", SKILLS),
    await upsertAll(Experience, "slug", EXPERIENCE),
    await upsertAll(Education, "slug", EDUCATION),
    await upsertAll(TextContent, "key", texts),
  ];
  return results.reduce(
    (total, part) => ({ created: total.created + part.created, updated: total.updated + part.updated }),
    { created: 0, updated: 0 }
  );
}

export interface CopyUpdateResult {
  added: string[];
  changed: string[];
  keptOwnerEdits: string[];
}

const SEED_BY_RESOURCE = {
  projects: { model: Project, items: PROJECTS as unknown as Record<string, unknown>[] },
  skills: { model: Skill, items: SKILLS as unknown as Record<string, unknown>[] },
  experience: { model: Experience, items: EXPERIENCE as unknown as Record<string, unknown>[] },
  education: { model: Education, items: EDUCATION as unknown as Record<string, unknown>[] },
};

async function updateTexts(result: CopyUpdateResult): Promise<void> {
  const now = new Date();
  for (const [key, value] of Object.entries(TEXTS)) {
    const created = await TextContent.updateOne(
      { key },
      { $setOnInsert: { value, createdAt: now, updatedAt: now } },
      { upsert: true, timestamps: false }
    );
    if (created.upsertedCount > 0) {
      result.added.push(`text ${key}`);
      continue;
    }
    const legacy = LEGACY_TEXTS[key];
    if (legacy === undefined) continue;
    const replaced = await TextContent.updateOne({ key, value: legacy }, { $set: { value } });
    if (replaced.modifiedCount > 0) result.changed.push(`text ${key}`);
    else result.keptOwnerEdits.push(`text ${key}`);
  }
}

async function updateDocumentFields(result: CopyUpdateResult): Promise<void> {
  for (const { resource, slug, field, value } of LEGACY_FIELDS) {
    const { model, items } = SEED_BY_RESOURCE[resource];
    const next = items.find((item) => item.slug === slug)?.[field];
    if (typeof next !== "string" && !Array.isArray(next)) continue;
    const replaced = await model.updateOne({ slug, [field]: value }, { $set: { [field]: next } });
    const label = `${resource}/${slug} ${field}`;
    if (replaced.modifiedCount > 0) result.changed.push(label);
    else result.keptOwnerEdits.push(label);
  }
}

// Brings an already-seeded database up to the current copy: adds text keys that are missing and
// overwrites a stored value only when it still equals the value an earlier seed wrote.
export async function updateCopy(): Promise<CopyUpdateResult> {
  await connectDb();
  const result: CopyUpdateResult = { added: [], changed: [], keptOwnerEdits: [] };
  await updateTexts(result);
  await updateDocumentFields(result);
  return result;
}
