import type { Model } from "mongoose";
import { connectDb } from "./db";
import { DuplicateError, NotFoundError } from "./errors";
import type { Resource } from "./limits";
import Education from "./models/Education";
import Experience from "./models/Experience";
import Project from "./models/Project";
import Skill from "./models/Skill";
import TextContent from "./models/TextContent";

const MONGO_DUPLICATE_KEY = 11000;

export type ContentDoc = Record<string, unknown>;
export type PageRequest = { page: number; pageSize: number };

const models: Record<Resource, Model<ContentDoc>> = {
  projects: Project,
  skills: Skill,
  experience: Experience,
  education: Education,
  texts: TextContent,
};

const SORT_BY_ORDER = { order: 1, createdAt: 1 } as const;

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === MONGO_DUPLICATE_KEY;
}

async function rethrowDuplicate<T>(work: Promise<T>): Promise<T> {
  try {
    return await work;
  } catch (err) {
    if (isDuplicateKeyError(err)) throw new DuplicateError();
    throw err;
  }
}

export async function listPublic(resource: Resource): Promise<ContentDoc[]> {
  await connectDb();
  if (resource === "texts") return models.texts.find().lean();
  return models[resource].find({ isVisible: true }).sort(SORT_BY_ORDER).lean();
}

export async function getPublicBySlug(resource: Resource, slug: string): Promise<ContentDoc> {
  await connectDb();
  const filter = resource === "texts" ? { key: slug } : { slug, isVisible: true };
  const doc = await models[resource].findOne(filter).lean();
  if (!doc) throw new NotFoundError();
  return doc;
}

export async function getTextMap(): Promise<Record<string, string>> {
  const docs = await listPublic("texts");
  return Object.fromEntries(docs.map((doc) => [String(doc.key), String(doc.value ?? "")]));
}

export async function listAdmin(
  resource: Resource,
  { page, pageSize }: PageRequest
): Promise<{ items: ContentDoc[]; total: number }> {
  await connectDb();
  const model = models[resource];
  const [items, total] = await Promise.all([
    model
      .find()
      .sort(SORT_BY_ORDER)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    model.countDocuments(),
  ]);
  return { items, total };
}

export async function createItem(resource: Resource, input: ContentDoc): Promise<ContentDoc> {
  await connectDb();
  const created = await rethrowDuplicate(models[resource].create(input));
  return created.toObject();
}

export async function updateItem(resource: Resource, id: string, input: ContentDoc): Promise<ContentDoc> {
  await connectDb();
  const updated = await rethrowDuplicate(
    models[resource].findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true }).lean().exec()
  );
  if (!updated) throw new NotFoundError();
  return updated;
}

export async function deleteItem(resource: Resource, id: string): Promise<void> {
  await connectDb();
  const deleted = await models[resource].findByIdAndDelete(id).lean();
  if (!deleted) throw new NotFoundError();
}
