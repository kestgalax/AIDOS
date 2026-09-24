import { mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

import { getPackageRoot } from "./package-root.js";

export interface InitResult {
  createdFiles: string[];
  updatedFiles: string[];
  skippedFiles: string[];
}

export interface InitOptions {
  force?: boolean;
  update?: boolean;
  confirmOverwrite?: boolean;
  answers?: OnboardingAnswers;
}

export interface OnboardingAnswers {
  mission?: string;
  vision?: string;
  principles?: string[];
  nonGoals?: string[];
  plannedProductForm?: string;
  stackDecision?: string;
}

export function getProjectStarterTemplateDirectory(): string {
  return path.join(getPackageRoot(), "templates", "project-starter");
}

export async function initProject(
  targetDirectory: string,
  options: InitOptions = {},
): Promise<InitResult> {
  const root = path.resolve(targetDirectory);
  const createdFiles: string[] = [];
  const updatedFiles: string[] = [];
  const skippedFiles: string[] = [];
  const templateDirectory = getProjectStarterTemplateDirectory();
  const replacements = buildReplacements(options.answers);

  if (options.update === true && options.confirmOverwrite !== true) {
    throw new Error("Update mode requires --confirm-overwrite");
  }

  await walkTemplate(templateDirectory, root, "", async (relativePath, contents) => {
    const absolutePath = path.join(root, relativePath);
    const exists = await fileExists(absolutePath);
    const fileClass = classifyStarterFile(relativePath);

    if (!options.update && !options.force && exists) {
      throw new Error(`Refusing to overwrite existing file: ${relativePath}`);
    }

    if (options.update && exists && fileClass === "keep") {
      skippedFiles.push(relativePath);
      return;
    }

    if (options.update && exists && fileClass === "create") {
      skippedFiles.push(relativePath);
      return;
    }

    await mkdir(path.dirname(absolutePath), { recursive: true });

    if (fileClass === "config" && exists) {
      await writeFile(absolutePath, await mergeProjectConfig(absolutePath), "utf8");
    } else {
      await writeFile(absolutePath, applyReplacements(contents, replacements, relativePath), "utf8");
    }

    if (exists) {
      updatedFiles.push(relativePath);
    } else {
      createdFiles.push(relativePath);
    }
  });

  return {
    createdFiles: createdFiles.sort(),
    updatedFiles: updatedFiles.sort(),
    skippedFiles: skippedFiles.sort(),
  };
}

function classifyStarterFile(relativePath: string): "refresh" | "keep" | "config" | "create" {
  if (relativePath === "aidos.config.json") {
    return "config";
  }
  if (
    relativePath.startsWith(".ai/") ||
    relativePath === "scripts/run-aidos.mjs" ||
    /^docs\/specs\/[^/]+-template\.md$/.test(relativePath)
  ) {
    return "refresh";
  }

  const kept = [
    "docs/product-intent.md",
    "docs/architecture.md",
    "docs/roadmap.md",
    "README.md",
    "AGENTS.md",
  ];
  if (
    kept.includes(relativePath) ||
    relativePath.startsWith("docs/decisions/") ||
    relativePath.startsWith("docs/specs/features/") ||
    relativePath.startsWith("docs/specs/tasks/") ||
    relativePath.startsWith("docs/specs/reviews/") ||
    relativePath.startsWith("docs/specs/domains/") ||
    relativePath.startsWith("docs/specs/spikes/") ||
    relativePath.startsWith("ops/")
  ) {
    return "keep";
  }

  return "create";
}

async function mergeProjectConfig(absolutePath: string): Promise<string> {
  const parsed: unknown = JSON.parse(await readFile(absolutePath, "utf8"));
  const config = typeof parsed === "object" && parsed !== null ? { ...parsed } : {};
  return `${JSON.stringify({ ...config, schema: 2 }, null, 2)}\n`;
}

async function walkTemplate(
  sourceDirectory: string,
  targetDirectory: string,
  relativeDirectory: string,
  writeFileCallback: (relativePath: string, contents: string) => Promise<void>,
): Promise<void> {
  const entries = await readdir(sourceDirectory, { withFileTypes: true });

  await Promise.all(
    entries.map(async (entry) => {
      const sourcePath = path.join(sourceDirectory, entry.name);
      const relativePath = toPosixPath(path.join(relativeDirectory, entry.name));

      if (entry.isDirectory()) {
        await mkdir(path.join(targetDirectory, entry.name), { recursive: true });
        await walkTemplate(sourcePath, path.join(targetDirectory, entry.name), relativePath, writeFileCallback);
        return;
      }

      if (!entry.isFile()) {
        return;
      }

      const contents = await readFile(sourcePath, "utf8");
      await writeFileCallback(relativePath, contents);
    }),
  );
}

function buildReplacements(answers: OnboardingAnswers = {}): Record<string, string> {
  return {
    MISSION: answers.mission ?? "Describe the product mission in one short statement.",
    VISION: answers.vision ?? "Describe the desired future state.",
    PRINCIPLES: toMarkdownList(answers.principles ?? ["Explicit over magic.", "Human control.", "Incremental evolution."]),
    NON_GOALS: toMarkdownList(answers.nonGoals ?? ["Non-goal:"]),
    PLANNED_PRODUCT_FORM: answers.plannedProductForm ?? "Not selected yet.",
    STACK_DECISION: answers.stackDecision ?? "Not selected yet.",
  };
}

function applyReplacements(contents: string, replacements: Record<string, string>, relativePath: string): string {
  const templatedFiles = new Set([
    "docs/product-intent.md",
    "docs/decisions/ADR-001-initial-project-structure.md",
    "docs/decisions/ADR-002-runtime-stack.md",
  ]);

  if (!templatedFiles.has(relativePath)) {
    return contents;
  }

  return Object.entries(replacements).reduce(
    (result, [token, value]) => result.replaceAll(`{{${token}}}`, value),
    contents,
  );
}

function toMarkdownList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function toPosixPath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
