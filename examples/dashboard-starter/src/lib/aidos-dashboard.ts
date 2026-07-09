import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

import {
  createAidosReportModel,
  type ReviewDetail,
  type ReviewOutcome,
  type TraceabilityDetail,
} from "./aidos-core/report-model";
import { getAidosProjectRoot } from "./project-root";

export interface MissingLink {
  file: string;
  field: string;
}
export interface DashboardAdr {
  id: string;
  title: string;
  status: string;
  path: string;
}

export interface AdrDetail extends DashboardAdr {
  sections: Record<string, string>;
}

export interface DashboardData {
  productIntent: {
    mission: string;
  };
  roadmap: {
    currentStatus: string[];
  };
  adrs: DashboardAdr[];
  health: {
    adrs: number;
  };
  traceability: {
    missingLinks: MissingLink[];
  };
  review: {
    outcome: ReviewOutcome;
    blockingFindings: Array<{
      file: string;
      message: string;
    }>;
    requestedChanges: Array<{
      file: string;
      message: string;
    }>;
  };
}

const adrSectionNames = ["Status", "Context", "Decision", "Alternatives", "Consequences"] as const;

export async function getDashboardData(rootDirectory: string): Promise<DashboardData> {
  const root = path.resolve(rootDirectory);
  const productIntent = await readOptionalFile(path.join(root, "docs", "product-intent.md"));
  const roadmap = await readOptionalFile(path.join(root, "docs", "roadmap.md"));
  const adrs = await readAdrs(root);
  const reports = await createAidosReportModel(root);

  return {
    productIntent: {
      mission: readSection(productIntent, "Mission") || "Mission is not documented.",
    },
    roadmap: {
      currentStatus: readListItems(readSection(roadmap, "Current Status")),
    },
    adrs,
    health: {
      adrs: adrs.length,
    },
    traceability: {
      missingLinks: reports.traceability.missingLinks,
    },
    review: {
      outcome: reports.review.outcome,
      blockingFindings: reports.review.blockingFindings,
      requestedChanges: reports.review.requestedChanges,
    },
  };
}

export async function getAdrDetail(rootDirectory: string, adrId: string): Promise<AdrDetail | null> {
  const root = path.resolve(rootDirectory);
  const adrs = await readAdrs(root);
  const adr = adrs.find((entry) => entry.id === adrId);
  if (!adr) {
    return null;
  }

  const contents = await readOptionalFile(path.join(root, adr.path));
  return {
    ...adr,
    sections: Object.fromEntries(adrSectionNames.map((section) => [section, readSection(contents, section)])),
  };
}

export async function getTraceabilityDetail(rootDirectory: string): Promise<TraceabilityDetail> {
  const root = path.resolve(rootDirectory);
  const reports = await createAidosReportModel(root);
  return reports.traceability.detail;
}

export async function getReviewDetail(rootDirectory: string): Promise<ReviewDetail> {
  const root = path.resolve(rootDirectory);
  const reports = await createAidosReportModel(root);
  return reports.review.detail;
}

async function readAdrs(root: string): Promise<DashboardAdr[]> {
  const decisionsDirectory = path.join(root, "docs", "decisions");
  if (!(await directoryExists(decisionsDirectory))) {
    return [];
  }

  const entries = await readdir(decisionsDirectory, { withFileTypes: true });
  const adrFiles = entries
    .filter((entry) => entry.isFile() && /^ADR-\d+.*\.md$/.test(entry.name))
    .map((entry) => path.join(decisionsDirectory, entry.name))
    .sort();

  return await Promise.all(
    adrFiles.map(async (filePath) => {
      const contents = await readFile(filePath, "utf8");
      const fileName = path.basename(filePath);
      const heading = contents.split("\n").find((line) => line.startsWith("# ")) ?? "# ADR: Untitled";
      const headingMatch = /^# (ADR-\d+):\s*(.+)$/.exec(heading);

      return {
        id: headingMatch?.[1] ?? fileName.replace(/\.md$/, ""),
        title: headingMatch?.[2] ?? "Untitled",
        status: readSection(contents, "Status") || "Unknown",
        path: normalizePath(path.relative(root, filePath)),
      };
    }),
  );
}

function readSection(contents: string, heading: string): string {
  const lines = contents.split("\n");
  const start = lines.findIndex((line) => line.trim() === `## ${heading}`);
  if (start === -1) {
    return "";
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

function readListItems(section: string): string[] {
  return section
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter((line) => line.length > 0);
}

async function readOptionalFile(filePath: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return "";
    }
    throw error;
  }
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

function normalizePath(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

