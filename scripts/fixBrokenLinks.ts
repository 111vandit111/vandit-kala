import mongoose from "mongoose";
import { connectDb } from "../lib/server/db";
import Project from "../lib/server/models/Project";
import { probeUrl, type LinkResult } from "../lib/server/linkCheck";

const APPLY_FLAG = "--apply";

interface ProjectLinks {
  slug: string;
  liveUrl?: string;
  repoUrl?: string;
}

function summary(result: LinkResult): string {
  return `${result.url} -> ${result.status ?? result.error}`;
}

async function checkProject({ slug, liveUrl, repoUrl }: ProjectLinks, isApply: boolean): Promise<void> {
  if (repoUrl) {
    const repo = await probeUrl(repoUrl);
    if (repo.isBroken) console.log(`BROKEN repo (kept) ${slug}: ${summary(repo)}`);
  }
  if (!liveUrl) return;
  const live = await probeUrl(liveUrl);
  if (!live.isBroken) return;
  console.log(`BROKEN live ${slug}: ${summary(live)}`);
  if (isApply) {
    await Project.updateOne({ slug }, { $unset: { liveUrl: "" } });
    console.log(`  cleared liveUrl for ${slug}`);
  }
}

async function main(): Promise<void> {
  const isApply = process.argv.includes(APPLY_FLAG);
  try {
    await connectDb();
    const projects = await Project.find({}, "slug liveUrl repoUrl").lean<ProjectLinks[]>();
    for (const project of projects) await checkProject(project, isApply);
    console.log(`Checked ${projects.length} projects${isApply ? " (applied)" : " (dry run, pass --apply to clear broken live URLs)"}`);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((err: unknown) => {
  console.error("Link check failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
