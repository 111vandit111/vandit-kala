import { access } from "node:fs/promises";
import path from "node:path";
import type { Model } from "mongoose";
import { connectDb } from "./db";
import Project from "./models/Project";
import Skill from "./models/Skill";
import Experience from "./models/Experience";
import Education from "./models/Education";
import { IMAGE_RESOURCES, isReplaceableImage, seedImageUrl, type ImageResource } from "./seed/seedImages";

export const PUBLIC_DIR = path.join(process.cwd(), "public");

export const IMAGE_MODELS: Record<ImageResource, Model<Record<string, unknown>>> = {
  skills: Skill,
  projects: Project,
  experience: Experience,
  education: Education,
};

export interface ImageDoc {
  _id: unknown;
  slug: string;
  image?: unknown;
}

export interface ApplyImagesResult {
  resource: ImageResource;
  updated: string[];
  kept: number;
  missingAsset: string[];
}

export async function listImageDocs(resource: ImageResource): Promise<ImageDoc[]> {
  const docs = await IMAGE_MODELS[resource].find({}, { slug: 1, image: 1 }).lean();
  return docs as unknown as ImageDoc[];
}

async function assetExists(imagePath: string): Promise<boolean> {
  try {
    await access(path.join(PUBLIC_DIR, imagePath));
    return true;
  } catch {
    return false;
  }
}

async function applyForResource(resource: ImageResource): Promise<ApplyImagesResult> {
  const result: ApplyImagesResult = { resource, updated: [], kept: 0, missingAsset: [] };
  for (const doc of await listImageDocs(resource)) {
    if (!isReplaceableImage(doc.image)) {
      result.kept += 1;
      continue;
    }
    const imageUrl = seedImageUrl(resource, doc.slug);
    if (!(await assetExists(imageUrl))) {
      result.missingAsset.push(doc.slug);
      continue;
    }
    // Filtering on the old value keeps this safe if the owner edits the image while the script runs.
    const update = await IMAGE_MODELS[resource].updateOne({ _id: doc._id, image: doc.image }, { $set: { image: imageUrl } });
    if (update.modifiedCount > 0) result.updated.push(doc.slug);
  }
  return result;
}

// Only overwrites an image that is empty, the old placeholder or a migrated vandit-portfolio Cloudinary URL; owner-chosen images are kept.
export async function applyLocalImages(): Promise<ApplyImagesResult[]> {
  await connectDb();
  const results: ApplyImagesResult[] = [];
  for (const resource of IMAGE_RESOURCES) results.push(await applyForResource(resource));
  return results;
}
