import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export interface MissingLink {
  file: string;
  field: string;
}

export interface TraceSummary {
  features: number;
  tasks: number;
  reviews: number;
  adrs: number;
}

export interface TraceReport {
  summary: TraceSummary;
  missingLinks: MissingLink[];
  text: string;
}

const traceabilityFields = {
  feature: ["Product Intent Link", "Roadmap Item", "Related ADRs"],
  task: ["Product Intent Link", "Roadmap Item", "Feature Spec", "Related ADRs"],
  review: ["Product Intent Link", "Roadmap Item", "Feature Spec", "Task", "Related ADRs"],
} as const;

export async function traceProject(rootDirectory: string): Promise<TraceReport> {
  const root = path.resolve(rootDirectory);
  const featureFiles = await listMarkdownFiles(path.join(root, "docs", "specs", "features"));
  const taskFiles = await listMarkdownFiles(path.join(root, "docs", "specs", "tasks"));
  const reviewFiles = await listMarkdownFiles(path.join(root, "docs", "specs", "reviews"));
  const adrFiles = await listMarkdownFiles(path.join(root, "docs", "decisions"));

  const missingLinks = [
    ...(await findMissingLinks(root, featureFiles, traceabilityFields.feature)),
    ...(await findMissingLinks(root, taskFiles, traceabilityFields.task)),
    ...(await findMissingLinks(root, reviewFiles, traceabilityFields.review)),
  ].sort((a, b) => `${a.file}:${a.field}`.localeCompare(`${b.file}:${b.field}`));

  const summary = {
    features: featureFiles.length,
    tasks: taskFiles.length,
    reviews: reviewFiles.length,
    adrs: adrFiles.length,
  };

  return {
    summary,
    missingLinks,
    text: formatTraceReport(summary, missingLinks),
  };
}

async function findMissingLinks(
  root: string,
  files: string[],
  fields: readonly string[],
): Promise<MissingLink[]> {
  const results: MissingLink[] = [];

  await Promise.all(
    files.map(async (filePath) => {
      const contents = await readFile(filePath, "utf8");
      const relativePath = normalizePath(path.relative(root, filePath));

      for (const field of fields) {
        const value = readField(contents, field);
        if (value === null || value.trim() === "") {
          results.push({ file: relativePath, field });
        }
      }
    }),
  );

  return results;
}

function readField(contents: string, field: string): string | null {
  const escapedField = escapeRegExp(field);
  const match = new RegExp(`^- ${escapedField}:[ \\t]*(.*)$`, "m").exec(contents);
  return match?.[1] ?? null;
}

function formatTraceReport(summary: TraceSummary, missingLinks: MissingLink[]): string {
  const lines = [
    "Traceability Report",
    "",
    `Features: ${summary.features}`,
    `Tasks: ${summary.tasks}`,
    `Reviews: ${summary.reviews}`,
    `ADRs: ${summary.adrs}`,
    "",
    "Missing Links",
    "",
  ];

  if (missingLinks.length === 0) {
    lines.push("None");
  } else {
    lines.push(...missingLinks.map((link) => `- ${link.file} -> ${link.field}`));
  }

  return lines.join("\n");
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  if (!(await directoryExists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort();

  return files;
}

async function directoryExists(directory: string): Promise<boolean> {
  try {
    return (await stat(directory)).isDirectory();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
