import mongoose from "mongoose";
import { seedAll } from "../lib/server/seedService";

async function main(): Promise<void> {
  try {
    const { created, updated } = await seedAll();
    console.log(`Seed finished: ${created} created, ${updated} updated`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err: unknown) => {
  console.error("Seed failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
