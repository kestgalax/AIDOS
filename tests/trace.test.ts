import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { traceProject } from "../src/trace.js";

test("trace report counts artifacts and reports missing traceability fields", async () => {
  const fixture = await createTraceFixture();

  try {
    const report = await traceProject(fixture);

    assert.equal(report.summary.features, 1);
    assert.equal(report.summary.tasks, 2);
    assert.equal(report.summary.reviews, 1);
    assert.equal(report.summary.adrs, 1);
    assert.deepEqual(report.missingLinks, [
      {
        file: "docs/specs/tasks/missing-feature.md",
        field: "Feature Spec",
      },
    ]);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("trace report can be formatted for CLI output", async () => {
  const fixture = await createTraceFixture();

  try {
    const report = await traceProject(fixture);

    assert.match(report.text, /Traceability Report/);
    assert.match(report.text, /Features: 1/);
    assert.match(report.text, /Tasks: 2/);
    assert.match(report.text, /Missing Links/);
    assert.match(report.text, /docs\/specs\/tasks\/missing-feature\.md -> Feature Spec/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createTraceFixture(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-trace-"));
  await mkdir(path.join(root, "docs", "decisions"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs", "features"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs", "tasks"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs", "reviews"), { recursive: true });

  await writeFile(
    path.join(root, "docs", "decisions", "ADR-001-test.md"),
    "# ADR-001: Test\n\n## Status\n\nAccepted\n",
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "features", "first-feature.md"),
    [
      "# First Feature",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 1",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "tasks", "linked-task.md"),
    [
      "# Linked Task",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 1",
      "- Feature Spec: docs/specs/features/first-feature.md",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "tasks", "missing-feature.md"),
    [
      "# Missing Feature",
      "",
      "## Traceability",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 1",
      "- Feature Spec:",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs", "specs", "reviews", "first-review.md"),
    [
      "# First Review",
      "",
      "## Traceability Check",
      "",
      "- Product Intent Link: docs/product-intent.md",
      "- Roadmap Item: Milestone 1",
      "- Feature Spec: docs/specs/features/first-feature.md",
      "- Task: docs/specs/tasks/linked-task.md",
      "- Related ADRs: docs/decisions/ADR-001-test.md",
    ].join("\n"),
    "utf8",
  );

  return root;
}
