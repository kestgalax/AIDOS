#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const packageRoot = path.resolve(currentDirectory, "..");
const cliPath = path.resolve(packageRoot, "src", "cli.ts");
const tsxLoader = pathToFileURL(path.resolve(packageRoot, "node_modules", "tsx", "dist", "loader.mjs")).href;

const result = spawnSync(process.execPath, ["--import", tsxLoader, cliPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_PATH: [path.resolve(packageRoot, "node_modules"), process.env.NODE_PATH]
      .filter(Boolean)
      .join(path.delimiter),
  },
});

process.exit(result.status ?? 1);
