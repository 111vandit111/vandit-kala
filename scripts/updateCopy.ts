import mongoose from "mongoose";
import { updateCopy } from "../lib/server/seedService";

function printList(title: string, items: string[]): void {
  console.log(`${title} (${items.length})`);
  for (const item of items) console.log(`  - ${item}`);
}

async function main(): Promise<void> {
  try {
    const { added, changed, keptOwnerEdits } = await updateCopy();
    printList("Added", added);
    printList("Changed", changed);
    printList("Kept (value differs from the old seed, so it was edited or already updated)", keptOwnerEdits);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err: unknown) => {
  console.error("Copy update failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
