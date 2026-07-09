import { reviewProject, type ReviewOutcome } from "./review";
import { traceProject, type MissingLink } from "./trace";

export type { ReviewOutcome };

export interface TraceabilityDetail {
  files: Array<{
    file: string;
    missingFields: string[];
  }>;
}

export interface ReviewDetail {
  outcome: ReviewOutcome;
  files: Array<{
    file: string;
    blocking: string[];
    requestedChanges: string[];
  }>;
}

export interface AidosReportModel {
  traceability: {
    missingLinks: MissingLink[];
    detail: TraceabilityDetail;
  };
  review: {
    outcome: ReviewOutcome;
    blockingFindings: Array<{ file: string; message: string }>;
    requestedChanges: Array<{ file: string; message: string }>;
    detail: ReviewDetail;
  };
}

export async function createAidosReportModel(rootDirectory: string): Promise<AidosReportModel> {
  const [traceReport, reviewReport] = await Promise.all([traceProject(rootDirectory), reviewProject(rootDirectory)]);
  const blockingFindings = reviewReport.findings.blocking;
  const requestedChanges = reviewReport.findings.requestedChanges;

  return {
    traceability: {
      missingLinks: traceReport.missingLinks,
      detail: groupTraceability(traceReport.missingLinks),
    },
    review: {
      outcome: reviewReport.outcome,
      blockingFindings,
      requestedChanges,
      detail: groupReviewFindings(reviewReport.outcome, blockingFindings, requestedChanges),
    },
  };
}

function groupTraceability(missingLinks: MissingLink[]): TraceabilityDetail {
  const grouped = new Map<string, string[]>();

  for (const link of missingLinks) {
    grouped.set(link.file, [...(grouped.get(link.file) ?? []), link.field]);
  }

  return {
    files: Array.from(grouped.entries())
      .map(([file, missingFields]) => ({ file, missingFields }))
      .sort((left, right) => left.file.localeCompare(right.file)),
  };
}

function groupReviewFindings(
  outcome: ReviewOutcome,
  blockingFindings: Array<{ file: string; message: string }>,
  requestedChanges: Array<{ file: string; message: string }>,
): ReviewDetail {
  const grouped = new Map<string, { blocking: string[]; requestedChanges: string[] }>();

  for (const finding of blockingFindings) {
    const entry = grouped.get(finding.file) ?? { blocking: [], requestedChanges: [] };
    entry.blocking.push(finding.message);
    grouped.set(finding.file, entry);
  }

  for (const finding of requestedChanges) {
    const entry = grouped.get(finding.file) ?? { blocking: [], requestedChanges: [] };
    entry.requestedChanges.push(finding.message);
    grouped.set(finding.file, entry);
  }

  return {
    outcome,
    files: Array.from(grouped.entries())
      .map(([file, findings]) => ({ file, ...findings }))
      .sort((left, right) => left.file.localeCompare(right.file)),
  };
}
