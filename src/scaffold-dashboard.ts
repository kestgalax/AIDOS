import { copyDirectory } from "./copy-template.js";
import { getPackageRoot } from "./package-root.js";
import { writeFile } from "node:fs/promises";
import path from "node:path";

export function getDashboardStarterDirectory(): string {
  return path.join(getPackageRoot(), "examples", "dashboard-starter");
}

export async function scaffoldDashboard(targetDirectory: string): Promise<void> {
  const target = path.resolve(targetDirectory);
  const source = getDashboardStarterDirectory();
  await copyDirectory(source, target, { exclude: [".next", "node_modules"] });
  await writeFile(path.join(target, ".env.local"), "AIDOS_PROJECT_ROOT=..\n", "utf8");
}
