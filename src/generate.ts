import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

import {
  defaultTraceabilityContext,
  featureSpecPath,
  fillTraceabilityFields,
  reviewSpecPath,
  taskSpecPath,
  type TraceabilityContext,
} from "./traceability-fields.js";

export type ArtifactType = "adr" | "feature" | "task" | "review" | "domain" | "spike";

export interface GenerateOptions {
  traceability?: TraceabilityContext;
}

export interface GenerateResult {
  path: string;
}

export interface GenerateFlowResult {
  feature: GenerateResult;
  task: GenerateResult;
  review: GenerateResult;
}

export async function generateArtifact(
  rootDirectory: string,
  type: ArtifactType,
  titleInput: string,
  options: GenerateOptions = {},
): Promise<GenerateResult> {
  const root = path.resolve(rootDirectory);
  const title = toTitleCase(titleInput);
  const slug = toSlug(titleInput);

  if (slug === "") {
    throw new Error("Artifact title must contain at least one letter or number");
  }

  switch (type) {
    case "adr":
      return await generateAdr(root, title, slug);
    case "feature":
      return await generateFromTemplate(root, "feature", title, slug, options.traceability);
    case "task":
      return await generateFromTemplate(root, "task", title, slug, options.traceability);
    case "review":
      return await generateFromTemplate(root, "review", `${title} Review`, slug, options.traceability);
    case "domain":
      return await generateDomain(root, title, slug);
    case "spike":
      return await generateFromTemplate(root, "spike", title, slug, options.traceability);
  }
}

export async function generateFlow(
  rootDirectory: string,
  titleInput: string,
  options: GenerateOptions = {},
): Promise<GenerateFlowResult> {
  const slug = toSlug(titleInput);
  if (slug === "") {
    throw new Error("Artifact title must contain at least one letter or number");
  }

  const baseContext: TraceabilityContext = {
    ...defaultTraceabilityContext,
    ...options.traceability,
  };

  const feature = await generateArtifact(rootDirectory, "feature", titleInput, {
    traceability: baseContext,
  });

  const task = await generateArtifact(rootDirectory, "task", titleInput, {
    traceability: {
      ...baseContext,
      featureSpec: featureSpecPath(slug),
    },
  });

  const review = await generateArtifact(rootDirectory, "review", titleInput, {
    traceability: {
      ...baseContext,
      featureSpec: featureSpecPath(slug),
      taskSpec: taskSpecPath(slug),
    },
  });

  return { feature, task, review };
}

async function generateAdr(root: string, title: string, slug: string): Promise<GenerateResult> {
  const decisionsDirectory = path.join(root, "docs", "decisions");
  await mkdir(decisionsDirectory, { recursive: true });

  const nextNumber = await getNextAdrNumber(decisionsDirectory);
  const paddedNumber = String(nextNumber).padStart(3, "0");
  const relativePath = path.join("docs", "decisions", `ADR-${paddedNumber}-${slug}.md`);

  await writeFile(
    path.join(root, relativePath),
    [
      `# ADR-${paddedNumber}: ${title}`,
      "",
      "## Status",
      "",
      "Proposed",
      "",
      "## Context",
      "",
      "Describe the problem, forces, and constraints that led to this decision.",
      "",
      "## Decision",
      "",
      "Describe the chosen decision.",
      "",
      "## Alternatives",
      "",
      "- Option:",
      "  Rationale:",
      "",
      "## Consequences",
      "",
      "- Consequence:",
    ].join("\n"),
    "utf8",
  );

  return { path: normalizePath(relativePath) };
}

async function generateDomain(root: string, title: string, slug: string): Promise<GenerateResult> {
  const templatePath = path.join(root, "docs", "specs", "domain-spec-template.md");
  const template = await readFile(templatePath, "utf8");
  const relativePath = path.join("docs", "specs", "domains", slug, "spec.md");
  await mkdir(path.dirname(path.join(root, relativePath)), { recursive: true });
  const titled = template.replace("# Domain Spec Template", `# ${title}`);
  await writeFile(path.join(root, relativePath), titled, "utf8");
  return { path: normalizePath(relativePath) };
}

async function generateFromTemplate(
  root: string,
  type: "feature" | "task" | "review" | "spike",
  title: string,
  slug: string,
  traceability: TraceabilityContext = {},
): Promise<GenerateResult> {
  const templatePath = path.join(root, "docs", "specs", `${type}-template.md`);
  const template = await readFile(templatePath, "utf8");
  const outputDirectory = path.join(root, "docs", "specs", `${type}s`);
  const relativePath = path.join("docs", "specs", `${type}s`, `${slug}.md`);

  await mkdir(outputDirectory, { recursive: true });

  const titledTemplate = applyTemplateTitle(template, title);
  const tracedTemplate =
    type === "spike" ? titledTemplate : fillTraceabilityFields(titledTemplate, type, traceability);
  await writeFile(path.join(root, relativePath), tracedTemplate, "utf8");

  return { path: normalizePath(relativePath) };
}

async function getNextAdrNumber(decisionsDirectory: string): Promise<number> {
  const entries = await readdir(decisionsDirectory).catch(() => []);
  const numbers = entries
    .map((entry) => /^ADR-(\d+)/.exec(entry)?.[1])
    .filter((entry): entry is string => entry !== undefined)
    .map((entry) => Number.parseInt(entry, 10))
    .filter((entry) => Number.isFinite(entry));

  return numbers.length === 0 ? 1 : Math.max(...numbers) + 1;
}

function applyTemplateTitle(template: string, title: string): string {
  const lines = template.split("\n");
  const firstHeadingIndex = lines.findIndex((line) => line.startsWith("# "));

  if (firstHeadingIndex === -1) {
    return `# ${title}\n\n${template}`;
  }

  lines[firstHeadingIndex] = `# ${title}`;
  return lines.join("\n");
}

function toSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/[\s_-]+/)
    .filter((part) => part.length > 0)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export { toSlug };
