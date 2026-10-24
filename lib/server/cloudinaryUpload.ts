import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PROFILE_FOLDER, buildCloudinaryUrl, cloudinaryPublicId } from "../imageUtils";

// Cloudinary hosts only the personal profile photos; every other image is a local file under public/img.
const UPLOAD_API = "https://api.cloudinary.com/v1_1";
const IMAGE_FILE = /\.(svg|webp|png|jpe?g)$/i;
const MIME_BY_EXTENSION: Record<string, string> = {
  svg: "image/svg+xml",
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
};

export interface CloudinaryCredentials {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
}

export interface LocalImageFile {
  folder: typeof PROFILE_FOLDER;
  slug: string;
  extension: string;
  filePath: string;
  publicId: string;
}

export function readCloudName(env: Record<string, string | undefined> = process.env): string {
  return (env.CLOUDINARY_CLOUD_NAME || env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
}

// Returns null while any credential is missing; callers must never print the values.
export function readCredentials(env: Record<string, string | undefined> = process.env): CloudinaryCredentials | null {
  const cloudName = readCloudName(env);
  const apiKey = (env.CLOUDINARY_API_KEY || "").trim();
  const apiSecret = (env.CLOUDINARY_API_SECRET || "").trim();
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

export interface UploadArgs {
  filePath: string;
  folder: string;
  isDryRun: boolean;
}

const FILE_FLAG = "--file";
const FOLDER_FLAG = "--folder";
const DRY_RUN_FLAG = "--dry-run";

function readFlagValue(argv: string[], flag: string): string | undefined {
  const index = argv.indexOf(flag);
  return index === -1 ? undefined : argv[index + 1];
}

export function parseUploadArgs(argv: string[]): UploadArgs {
  const filePath = readFlagValue(argv, FILE_FLAG);
  if (!filePath || filePath.startsWith("--")) throw new Error(`Pass the photo to upload: ${FILE_FLAG} <path> [${FOLDER_FLAG} ${PROFILE_FOLDER}] [${DRY_RUN_FLAG}]`);
  return { filePath: path.resolve(filePath), folder: readFlagValue(argv, FOLDER_FLAG) ?? PROFILE_FOLDER, isDryRun: argv.includes(DRY_RUN_FLAG) };
}

// Only profile photos may be uploaded; the file is read from the given path, never from the repo.
export function planUpload({ filePath, folder }: UploadArgs): LocalImageFile {
  if (folder !== PROFILE_FOLDER) throw new Error(`Only the "${PROFILE_FOLDER}" folder is supported; other images live in public/img`);
  if (!IMAGE_FILE.test(filePath)) throw new Error("The file must be an svg, webp, png or jpg image");
  if (!existsSync(filePath)) throw new Error(`${filePath} does not exist`);
  const extension = path.extname(filePath).slice(1).toLowerCase();
  const slug = path.basename(filePath, path.extname(filePath));
  return { folder: PROFILE_FOLDER, slug, extension, filePath, publicId: cloudinaryPublicId(folder, slug) };
}

export function deliveryUrl(cloudName: string, file: Pick<LocalImageFile, "publicId" | "extension">): string {
  return buildCloudinaryUrl(cloudName, file.publicId, file.extension);
}

export function signParams(params: Record<string, string>, apiSecret: string): string {
  const toSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return createHash("sha1").update(toSign + apiSecret).digest("hex");
}

export async function uploadFile(file: LocalImageFile, credentials: CloudinaryCredentials): Promise<void> {
  // Same public_id on every run + overwrite means a re-run replaces the asset instead of duplicating it.
  const params = { invalidate: "true", overwrite: "true", public_id: file.publicId, timestamp: String(Math.floor(Date.now() / 1000)) };
  const mime = MIME_BY_EXTENSION[file.extension] ?? "application/octet-stream";
  const form = new FormData();
  form.set("file", new Blob([readFileSync(file.filePath)], { type: mime }), path.basename(file.filePath));
  for (const [key, value] of Object.entries(params)) form.set(key, value);
  form.set("api_key", credentials.apiKey);
  form.set("signature", signParams(params, credentials.apiSecret));
  const response = await fetch(`${UPLOAD_API}/${credentials.cloudName}/image/upload`, { method: "POST", body: form });
  if (!response.ok) throw new Error(`Cloudinary upload of ${file.publicId} failed with HTTP ${response.status}`);
}
