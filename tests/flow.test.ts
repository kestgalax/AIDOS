import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { generateArtifact, generateFlow } from "../src/generate.js";
import { traceProject } from "../src/trace.js";

test("generates feature spec with traceability autofill", async () => {
  const fixture = await createGenerationFixture();

  try {
    const result = await generateArtifact(fixture, "feature", "first project setup");
    const contents = await readFile(path.join(fixture, result.path), "utf8");

    assert.match(contents, /Product Intent Link: docs\/product-intent\.md/);
    assert.match(contents, /Roadmap Item: Milestone 2: First Feature/);
    assert.match(contents, /Related ADRs: docs\/decisions\/ADR-002-runtime-stack\.md/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("generates linked flow artifacts without missing traceability fields", async () => {
  const fixture = await createGenerationFixture();

  try {
    const result = await generateFlow(fixture, "first user workflow");
    const trace = await traceProject(fixture);

    assert.equal(result.feature.path, "docs/specs/features/first-user-workflow.md");
    assert.equal(result.task.path, "docs/specs/tasks/first-user-workflow.md");
    assert.equal(result.review.path, "docs/specs/reviews/first-user-workflow.md");
    assert.equal(trace.missingLinks.length, 0);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createGenerationFixture(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-generate-"));
  await mkdir(path.join(root, "docs", "decisions"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs"), { recursive: true });

  await writeFile(path.join(root, "docs", "decisions", "ADR-002-runtime-stack.md"), "# ADR-002\n", "utf8");

  await writeFile(
    path.join(root, "docs", "specs", "feature-template.md"),
    [
      "# Feature Spec Template",
      "",
      "## Traceability",
      "",
      "- Product Intent Link:",
      "- Roadmap Item:",
      "- Related ADRs:",
      "",
      "## Acceptance Criteria",
      "",
      "- Criterion:",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(root, "docs", "specs", "task-template.md"),
    [
      "# Task Template",
      "",
      "## Traceability",
      "",
      "- Product Intent Link:",
      "- Roadmap Item:",
      "- Feature Spec:",
      "- Related ADRs:",
      "",
      "## Acceptance Criteria",
      "",
      "- Criterion:",
      "",
      "## Verification",
      "",
      "- Check:",
      "",
      "## Documentation Updates",
      "",
      "- Update:",
      "",
      "## ADR Impact",
      "",
      "No ADR impact",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(root, "docs", "specs", "review-template.md"),
    [
      "# Review Template",
      "",
      "## Traceability Check",
      "",
      "- Product Intent Link:",
      "- Roadmap Item:",
      "- Feature Spec:",
      "- Task:",
      "- Related ADRs:",
      "",
      "## Governance Checklist",
      "",
      "- Product intent respected:",
    ].join("\n"),
    "utf8",
  );

  return root;
}
