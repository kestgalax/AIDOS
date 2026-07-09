#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const cliPath = path.resolve(currentDirectory, "..", "src", "cli.ts");

const result = spawnSync(process.execPath, ["--import", "tsx", cliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);
