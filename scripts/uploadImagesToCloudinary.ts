import {
  deliveryUrl,
  parseUploadArgs,
  planUpload,
  readCloudName,
  readCredentials,
  uploadFile,
} from "../lib/server/cloudinaryUpload";

// Uploads one personal profile photo: npm run images:cloudinary -- --file <path> --folder profile [--dry-run]
async function main(): Promise<void> {
  const args = parseUploadArgs(process.argv.slice(2));
  const file = planUpload(args);
  if (args.isDryRun) {
    console.log("Dry run: nothing is uploaded.");
    console.log(`Credentials found in env: ${readCredentials() ? "yes" : "no"}`);
    console.log(`Would upload ${file.filePath} -> ${file.publicId}`);
    console.log(`Delivery URL: ${deliveryUrl(readCloudName() || "<cloud-name>", file)}`);
    return;
  }
  const credentials = readCredentials();
  if (!credentials) {
    throw new Error("Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.local");
  }
  await uploadFile(file, credentials);
  console.log(`Uploaded ${file.publicId}: ${deliveryUrl(credentials.cloudName, file)}`);
}

main().catch((err: unknown) => {
  console.error("Cloudinary upload failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
