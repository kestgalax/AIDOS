import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

export type ReviewOutcome = "Approve" | "Request Changes" | "Block";

export interface ReviewFinding {
  file: string;
  message: string;
}

export interface ReviewFindings {
  blocking: ReviewFinding[];
  requestedChanges: ReviewFinding[];
  advisory: ReviewFinding[];
}

export interface ReviewReport {
  outcome: ReviewOutcome;
  findings: ReviewFindings;
  text: string;
}

const placeholderEntries = new Set([
  "Criterion 1",
  "Criterion 2",
  "Check 1:",
  "Check 2:",
  "Evidence 1",
  "Evidence 2",
  "Work item 1",
  "Work item 2",
]);

export async function reviewProject(rootDirectory: string): Promise<ReviewReport> {
  const root = path.resolve(rootDirectory);
  const taskFiles = await listMarkdownFiles(path.join(root, "docs", "specs", "tasks"));
  const featureFiles = await listMarkdownFiles(path.join(root, "docs", "specs", "features"));
  const findings: ReviewFindings = {
    blocking: [],
    requestedChanges: [],
    advisory: [],
  };

  await Promise.all([
    ...taskFiles.map(async (filePath) => {
      await reviewTaskFile(root, filePath, findings);
    }),
    ...featureFiles.map(async (filePath) => {
      await reviewFeatureFile(root, filePath, findings);
    }),
  ]);

  findings.blocking.sort(compareFindings);
  findings.requestedChanges.sort(compareFindings);
  findings.advisory.sort(compareFindings);

  const outcome = classifyOutcome(findings);
  return {
    outcome,
    findings,
    text: formatReviewReport(outcome, findings),
  };
}

async function reviewTaskFile(root: string, filePath: string, findings: ReviewFindings): Promise<void> {
  const contents = await readFile(filePath, "utf8");
  const file = normalizePath(path.relative(root, filePath));

  if (!hasConcreteListEntry(readSection(contents, "Acceptance Criteria"))) {
    findings.blocking.push({
      file,
      message: "Acceptance Criteria has no concrete entries",
    });
  }

  if (!hasConcreteListEntry(readSection(contents, "Verification"))) {
    findings.requestedChanges.push({
      file,
      message: "Verification has no concrete evidence or checks",
    });
  }

  if (!hasConcreteListEntry(readSection(contents, "Documentation Updates"))) {
    findings.requestedChanges.push({
      file,
      message: "Documentation Updates has no concrete entries",
    });
  }

  const adrImpact = readSection(contents, "ADR Impact");
  if (!adrImpact || !hasAllowedAdrImpact(adrImpact)) {
    findings.blocking.push({
      file,
      message: "ADR Impact is missing or does not use an allowed outcome",
    });
  }
}

/** Allowed ADR Impact outcomes for deterministic review. */
export function hasAllowedAdrImpact(section: string): boolean {
  return /No ADR impact|New ADR required|Existing ADR must be superseded or amended|Follows\s+accepted\s+`?ADR/i.test(
    section,
  );
}

async function reviewFeatureFile(root: string, filePath: string, findings: ReviewFindings): Promise<void> {
  const contents = await readFile(filePath, "utf8");
  const file = normalizePath(path.relative(root, filePath));

  if (!hasConcreteListEntry(readSection(contents, "Acceptance Criteria"))) {
    findings.blocking.push({
      file,
      message: "Acceptance Criteria has no concrete entries",
    });
  }

  if (!hasConcreteListEntry(readSection(contents, "Verification Plan"))) {
    findings.requestedChanges.push({
      file,
      message: "Verification Plan has no concrete checks",
    });
  }

  if (!hasConcreteListEntry(readSection(contents, "Documentation Impact"))) {
    findings.requestedChanges.push({
      file,
      message: "Documentation Impact has no concrete entries",
    });
  }
}

function classifyOutcome(findings: ReviewFindings): ReviewOutcome {
  if (findings.blocking.length > 0) {
    return "Block";
  }
  if (findings.requestedChanges.length > 0) {
    return "Request Changes";
  }
  return "Approve";
}

function formatReviewReport(outcome: ReviewOutcome, findings: ReviewFindings): string {
  return [
    "# AIDOS Review Report",
    "",
    "## Metadata",
    "",
    `- Outcome: ${outcome}`,
    "",
    "## Traceability Check",
    "",
    "- Product Intent Link: checked through existing artifacts when present.",
    "- Roadmap Item: checked through existing artifacts when present.",
    "- Feature Spec: checked through existing artifacts when present.",
    "- Task: checked through task artifacts when present.",
    "- Related ADRs: task ADR Impact is checked.",
    "- Pull Request: not checked by local markdown review.",
    "",
    "## Review Summary",
    "",
    `Outcome: ${outcome}`,
    "",
    "## Findings",
    "",
    "### Blocking Findings",
    "",
    ...formatFindings(findings.blocking),
    "",
    "### Requested Changes",
    "",
    ...formatFindings(findings.requestedChanges),
    "",
    "### Advisory Notes",
    "",
    ...formatFindings(findings.advisory),
    "",
    "## Governance Checklist",
    "",
    "- Product intent respected: review manually.",
    "- Architecture respected: review manually.",
    "- ADRs respected or updated: checked for task ADR Impact.",
    "- Documentation updated: checked for task documentation entries.",
    "- Verification evidence present: checked for task verification entries.",
    "- Security and human-control rules respected: review manually.",
    "- Scope stayed focused: review manually.",
    "",
    "## Verification Review",
    "",
    "Checks reviewed:",
    "",
    "- Check: AIDOS deterministic review checks",
    `  Result: ${outcome}`,
    "",
    "Checks missing or skipped:",
    "",
    "- Check: Human judgment for product intent, architecture, security, and scope",
    "  Risk: deterministic markdown checks cannot replace maintainer review.",
    "",
    "## Decision",
    "",
    `Outcome: ${outcome}`,
    "",
    "## Follow-Up",
    "",
    outcome === "Approve" ? "None" : "Resolve blocking findings and requested changes before approval.",
  ].join("\n");
}

function formatFindings(findings: ReviewFinding[]): string[] {
  if (findings.length === 0) {
    return ["- None"];
  }

  return findings.map((finding) => `- ${finding.file}: ${finding.message}`);
}

function readSection(contents: string, heading: string): string | null {
  const lines = contents.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) {
    return null;
  }

  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) {
      break;
    }
    body.push(line);
  }

  return body.join("\n").trim();
}

function hasConcreteListEntry(section: string | null): boolean {
  if (section === null) {
    return false;
  }

  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .some((entry) => entry.length > 0 && !placeholderEntries.has(entry));
}

async function listMarkdownFiles(directory: string): Promise<string[]> {
  if (!(await directoryExists(directory))) {
    return [];
  }

  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(directory, entry.name))
    .sort();
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

function compareFindings(left: ReviewFinding, right: ReviewFinding): number {
  return `${left.file}:${left.message}`.localeCompare(`${right.file}:${right.message}`);
}

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}
