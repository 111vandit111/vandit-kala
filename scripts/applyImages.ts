import mongoose from "mongoose";
import { applyLocalImages } from "../lib/server/imageService";

async function main(): Promise<void> {
  try {
    for (const { resource, updated, kept, missingAsset } of await applyLocalImages()) {
      console.log(`${resource}: ${updated.length} updated, ${kept} kept (already set), ${missingAsset.length} without a local image file`);
      if (missingAsset.length > 0) console.log(`  no file for: ${missingAsset.join(", ")}`);
    }
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err: unknown) => {
  console.error("Apply images failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
