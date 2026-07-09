import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { reviewProject } from "../src/review.js";

test("review blocks task artifacts that lack acceptance criteria", async () => {
  const fixture = await createReviewFixture({
    taskContents: [
      "# Incomplete Task",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 6",
      "- Feature Spec: docs/specs/features/reviewer-automation.md",
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
  });

  try {
    const report = await reviewProject(fixture);

    assert.equal(report.outcome, "Block");
    assert.deepEqual(report.findings.blocking, [
      {
        file: "docs/specs/tasks/reviewer-task.md",
        message: "Acceptance Criteria has no concrete entries",
      },
    ]);
    assert.match(report.text, /## Findings/);
    assert.match(report.text, /### Blocking Findings/);
    assert.match(report.text, /Outcome: Block/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("review approves task artifacts with concrete criteria and verification evidence", async () => {
  const fixture = await createReviewFixture({
    taskContents: [
      "# Complete Task",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 6",
      "- Feature Spec: docs/specs/features/reviewer-automation.md",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
      "",
      "## Acceptance Criteria",
      "",
      "- `aidos review` classifies incomplete tasks as Block.",
      "",
      "## Verification",
      "",
      "Commands or checks to run:",
      "",
      "- npm test",
      "",
      "Expected evidence:",
      "",
      "- Passing automated review tests.",
      "",
      "## Documentation Updates",
      "",
      "- Update README and quickstart with review command usage.",
      "",
      "## ADR Impact",
      "",
      "- No ADR impact.",
    ].join("\n"),
  });

  try {
    const report = await reviewProject(fixture);

    assert.equal(report.outcome, "Approve");
    assert.deepEqual(report.findings.blocking, []);
    assert.deepEqual(report.findings.requestedChanges, []);
    assert.match(report.text, /## Decision/);
    assert.match(report.text, /Outcome: Approve/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createReviewFixture(options: { taskContents: string }): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-review-"));
  await mkdir(path.join(root, "docs", "decisions"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs", "features"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs", "tasks"), { recursive: true });

  await writeFile(
    path.join(root, "docs", "decisions", "ADR-001-test.md"),
    "# ADR-001: Test\n\n## Status\n\nAccepted\n",
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "features", "reviewer-automation.md"),
    [
      "# Reviewer Automation",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 6",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
      "",
      "## Acceptance Criteria",
      "",
      "- Review command produces a deterministic outcome.",
      "",
      "## Verification Plan",
      "",
      "- Check 1: npm test",
      "",
      "## Documentation Impact",
      "",
      "- README.md",
      "",
      "## Decision Impact",
      "",
      "No ADR impact.",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "tasks", "reviewer-task.md"),
    options.taskContents,
    "utf8",
  );

  return root;
}
