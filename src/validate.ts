import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

const requiredFiles = [
  "README.md",
  "AGENTS.md",
  ".ai/constitution.md",
  ".ai/planner.md",
  ".ai/developer.md",
  ".ai/reviewer.md",
  ".ai/workflow.md",
  ".ai/constraints.md",
  ".ai/memory.md",
  "docs/product-intent.md",
  "docs/roadmap.md",
  "docs/architecture.md",
  "docs/specs/feature-template.md",
  "docs/specs/task-template.md",
  "docs/specs/review-template.md",
  "ops/deploy.md",
  "ops/environments.md",
  "ops/troubleshooting.md",
] as const;

const requiredAdrSections = ["Status", "Context", "Decision", "Alternatives", "Consequences"] as const;

const requiredTraceabilityMarkers = {
  "docs/specs/feature-template.md": "Traceability",
  "docs/specs/task-template.md": "Traceability",
  "docs/specs/review-template.md": "Traceability",
} as const;

export async function validateProject(rootDirectory: string): Promise<ValidationResult> {
  const root = path.resolve(rootDirectory);
  const errors: string[] = [];

  await validateRequiredFiles(root, errors);
  await validateAgentsEntryPoint(root, errors);
  await validateSpecTemplates(root, errors);
  await validateAdrs(root, errors);
  await validateMarkdownLinks(root, errors);
  await validateRuntimeDecision(root, errors);

  return {
    ok: errors.length === 0,
    errors,
  };
}

async function validateRequiredFiles(root: string, errors: string[]): Promise<void> {
  await Promise.all(
    requiredFiles.map(async (relativePath) => {
      if (!(await fileExists(path.join(root, relativePath)))) {
        errors.push(`Missing required file: ${relativePath}`);
      }
    }),
  );
}

async function validateAgentsEntryPoint(root: string, errors: string[]): Promise<void> {
  const agentsPath = path.join(root, "AGENTS.md");
  const contents = await readOptionalFile(agentsPath);
  if (contents === null) {
    return;
  }

  for (const requiredReference of ["README.md", "docs/product-intent.md", "docs/architecture.md"]) {
    if (!contents.includes(requiredReference)) {
      errors.push(`AGENTS.md missing required reading reference: ${requiredReference}`);
    }
  }
}

async function validateSpecTemplates(root: string, errors: string[]): Promise<void> {
  await Promise.all(
    Object.entries(requiredTraceabilityMarkers).map(async ([relativePath, marker]) => {
      const contents = await readOptionalFile(path.join(root, relativePath));
      if (contents !== null && !contents.includes(marker)) {
        errors.push(`${relativePath} missing traceability marker: ${marker}`);
      }
    }),
  );
}

async function validateAdrs(root: string, errors: string[]): Promise<void> {
  const decisionsDirectory = path.join(root, "docs", "decisions");
  if (!(await directoryExists(decisionsDirectory))) {
    errors.push("Missing required directory: docs/decisions");
    return;
  }

  const adrFiles = (await readdir(decisionsDirectory))
    .filter((entry) => /^ADR-\d+.*\.md$/.test(entry))
    .sort();

  if (adrFiles.length === 0) {
    errors.push("No ADR files found in docs/decisions");
    return;
  }

  await Promise.all(
    adrFiles.map(async (fileName) => {
      const contents = await readFile(path.join(decisionsDirectory, fileName), "utf8");

      for (const section of requiredAdrSections) {
        if (!contents.includes(`## ${section}`)) {
          errors.push(`${fileName} missing section: ${section}`);
        }
      }
    }),
  );
}

async function validateMarkdownLinks(root: string, errors: string[]): Promise<void> {
  const markdownFiles = await listMarkdownFiles(root);

  await Promise.all(
    markdownFiles.map(async (filePath) => {
      const contents = await readFile(filePath, "utf8");
      const relativeFilePath = path.relative(root, filePath);

      for (const link of extractMarkdownLinks(contents)) {
        if (isExternalOrAnchorLink(link)) {
          continue;
        }

        const linkedPath = link.split("#", 1)[0];
        if (linkedPath === undefined || linkedPath === "") {
          continue;
        }

        const resolvedLink = path.resolve(path.dirname(filePath), linkedPath);
        if (!(await fileOrDirectoryExists(resolvedLink))) {
          errors.push(`Broken markdown link in ${relativeFilePath}: ${link}`);
        }
      }
    }),
  );
}

async function validateRuntimeDecision(root: string, errors: string[]): Promise<void> {
  const packageJsonPath = path.join(root, "package.json");
  if (!(await fileExists(packageJsonPath))) {
    return;
  }

  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    scripts?: Record<string, string>;
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };

  const scriptNames = Object.keys(packageJson.scripts ?? {});
  const isAidosToolingOnly =
    scriptNames.length > 0 && scriptNames.every((name) => name.startsWith("aidos:"));
  const hasApplicationDependencies =
    Object.keys(packageJson.dependencies ?? {}).length > 0 ||
    Object.keys(packageJson.devDependencies ?? {}).length > 0;

  if (isAidosToolingOnly && !hasApplicationDependencies) {
    return;
  }

  const adrPath = path.join(root, "docs", "decisions", "ADR-002-product-form-and-stack.md");
  const adr = await readOptionalFile(adrPath);
  if (adr === null || !adr.includes("## Status") || !adr.includes("Accepted")) {
    errors.push("Runtime scaffold exists before ADR-002 is accepted");
  }
}

async function listMarkdownFiles(root: string): Promise<string[]> {
  const results: string[] = [];
  await walk(root, results);
  return results;
}

async function walk(directory: string, results: string[]): Promise<void> {
  const entries = await readdir(directory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === ".git") {
          return;
        }
        await walk(entryPath, results);
        return;
      }

      if (entry.isFile() && entry.name.endsWith(".md")) {
        results.push(entryPath);
      }
    }),
  );
}

function extractMarkdownLinks(contents: string): string[] {
  return Array.from(contents.matchAll(/\[[^\]]+\]\(([^)]+)\)/g), (match) => match[1]).filter(
    (link): link is string => link !== undefined,
  );
}

function isExternalOrAnchorLink(link: string): boolean {
  return link.includes("://") || link.startsWith("#") || link.startsWith("mailto:");
}

async function readOptionalFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

async function directoryExists(directoryPath: string): Promise<boolean> {
  try {
    return (await stat(directoryPath)).isDirectory();
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

async function fileOrDirectoryExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (isNotFoundError(error)) {
      return false;
    }
    throw error;
  }
}

function isNotFoundError(error: unknown): boolean {
  return error instanceof Error && "code" in error && error.code === "ENOENT";
}
