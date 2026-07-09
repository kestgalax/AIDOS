import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import {
  getAdrDetail,
  getDashboardData,
  getReviewDetail,
  getTraceabilityDetail,
} from "../examples/dashboard-starter/src/lib/aidos-dashboard.js";

test("dashboard data projects AIDOS markdown artifacts without changing source of truth", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-dashboard-"));

  try {
    await mkdir(path.join(fixture, "docs", "decisions"), { recursive: true });
    await mkdir(path.join(fixture, "docs", "specs", "features"), { recursive: true });
    await mkdir(path.join(fixture, "docs", "specs", "tasks"), { recursive: true });
    await mkdir(path.join(fixture, "docs", "specs", "reviews"), { recursive: true });
    await writeFile(
      path.join(fixture, "docs", "product-intent.md"),
      ["# Product Intent", "", "## Mission", "", "Keep project knowledge durable."].join("\n"),
      "utf8",
    );
    await writeFile(
      path.join(fixture, "docs", "roadmap.md"),
      ["# Roadmap", "", "## Current Status", "", "- Dashboard implementation next."].join("\n"),
      "utf8",
    );
    await writeFile(
      path.join(fixture, "docs", "decisions", "ADR-001-test.md"),
      [
        "# ADR-001: Test",
        "",
        "## Status",
        "",
        "Accepted",
        "",
        "## Context",
        "",
        "A detail view should show ADR context.",
        "",
        "## Decision",
        "",
        "Expose ADR sections.",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      path.join(fixture, "docs", "specs", "features", "dashboard.md"),
      [
        "# Dashboard",
        "",
        "## Traceability",
        "",
        "- Product Intent Link: docs/product-intent.md",
        "- Roadmap Item: Milestone 7",
        "- Related ADRs: docs/decisions/ADR-001-test.md",
        "",
        "## Acceptance Criteria",
        "",
        "- Dashboard shows report status.",
        "",
        "## Verification Plan",
        "",
        "- Check 1: npm test",
        "",
        "## Documentation Impact",
        "",
        "- README.md",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      path.join(fixture, "docs", "specs", "tasks", "dashboard-task.md"),
      [
        "# Dashboard Task",
        "",
        "## Traceability",
        "",
        "- Product Intent Link: docs/product-intent.md",
        "- Roadmap Item: Milestone 7",
        "- Feature Spec:",
        "- Related ADRs: docs/decisions/ADR-001-test.md",
        "",
        "## Acceptance Criteria",
        "",
        "- Criterion 1",
        "",
        "## Verification",
        "",
        "Expected evidence:",
        "",
        "- Evidence 1",
        "",
        "## Documentation Updates",
        "",
        "- README.md",
        "",
        "## ADR Impact",
        "",
        "- No ADR impact.",
      ].join("\n"),
      "utf8",
    );
    await writeFile(
      path.join(fixture, "docs", "specs", "reviews", "dashboard-review.md"),
      [
        "# Dashboard Review",
        "",
        "## Traceability Check",
        "",
        "- Product Intent Link: docs/product-intent.md",
        "- Roadmap Item: Milestone 7",
        "- Feature Spec: docs/specs/features/dashboard.md",
        "- Task:",
        "- Related ADRs: docs/decisions/ADR-001-test.md",
      ].join("\n"),
      "utf8",
    );

    const data = await getDashboardData(fixture);

    assert.equal(data.productIntent.mission, "Keep project knowledge durable.");
    assert.equal(data.roadmap.currentStatus.length, 1);
    assert.deepEqual(data.adrs, [
      {
        id: "ADR-001",
        title: "Test",
        status: "Accepted",
        path: "docs/decisions/ADR-001-test.md",
      },
    ]);
    assert.equal(data.health.adrs, 1);
    assert.equal(data.traceability.missingLinks.length, 2);
    assert.deepEqual(data.traceability.missingLinks, [
      {
        file: "docs/specs/reviews/dashboard-review.md",
        field: "Task",
      },
      {
        file: "docs/specs/tasks/dashboard-task.md",
        field: "Feature Spec",
      },
    ]);
    assert.equal(data.review.outcome, "Block");
    assert.equal(data.review.blockingFindings.length, 1);

    const adrDetail = await getAdrDetail(fixture, "ADR-001");
    assert.equal(adrDetail?.title, "Test");
    assert.equal(adrDetail?.sections.Context, "A detail view should show ADR context.");
    assert.equal(adrDetail?.sections.Decision, "Expose ADR sections.");

    const traceabilityDetail = await getTraceabilityDetail(fixture);
    assert.deepEqual(traceabilityDetail.files, [
      {
        file: "docs/specs/reviews/dashboard-review.md",
        missingFields: ["Task"],
      },
      {
        file: "docs/specs/tasks/dashboard-task.md",
        missingFields: ["Feature Spec"],
      },
    ]);

    const reviewDetail = await getReviewDetail(fixture);
    assert.equal(reviewDetail.outcome, "Block");
    assert.deepEqual(reviewDetail.files, [
      {
        file: "docs/specs/tasks/dashboard-task.md",
        blocking: ["Acceptance Criteria has no concrete entries"],
        requestedChanges: ["Verification has no concrete evidence or checks"],
      },
    ]);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
