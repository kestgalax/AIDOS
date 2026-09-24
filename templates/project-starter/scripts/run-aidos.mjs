#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, "..");
const command = process.argv[2];
const commandArgs = process.argv.slice(3);

if (!command) {
  console.error("Usage: node scripts/run-aidos.mjs <validate|trace|review|archive|new> [args]");
  process.exit(1);
}

const toolingRoot = process.env.AIDOS_ROOT;
const result = toolingRoot
  ? spawnSync(process.execPath, [path.resolve(projectRoot, toolingRoot, "bin", "aidos.js"), command, ...commandArgs], {
      cwd: projectRoot,
      stdio: "inherit",
    })
  : spawnSync("aidos", [command, ...commandArgs], {
      cwd: projectRoot,
      stdio: "inherit",
    });

process.exit(result.status ?? 1);
