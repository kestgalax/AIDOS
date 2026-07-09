import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { generateArtifact } from "../src/generate.js";

test("generates the next numbered ADR skeleton", async () => {
  const fixture = await createGenerationFixture();

  try {
    await writeFile(
      path.join(fixture, "docs", "decisions", "ADR-001-existing.md"),
      "# ADR-001: Existing\n",
      "utf8",
    );

    const result = await generateArtifact(fixture, "adr", "runtime packaging");
    const contents = await readFile(path.join(fixture, result.path), "utf8");

    assert.equal(result.path, "docs/decisions/ADR-002-runtime-packaging.md");
    assert.match(contents, /^# ADR-002: Runtime Packaging/m);
    assert.match(contents, /## Status/);
    assert.match(contents, /## Context/);
    assert.match(contents, /## Decision/);
    assert.match(contents, /## Alternatives/);
    assert.match(contents, /## Consequences/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("generates a feature spec from the feature template", async () => {
  const fixture = await createGenerationFixture();

  try {
    const result = await generateArtifact(fixture, "feature", "first project setup");
    const contents = await readFile(path.join(fixture, result.path), "utf8");

    assert.equal(result.path, "docs/specs/features/first-project-setup.md");
    assert.match(contents, /^# First Project Setup/m);
    assert.match(contents, /Feature ID:/);
    assert.match(contents, /Product Intent Link:/);
    assert.match(contents, /Acceptance Criteria/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("generates a task from the task template", async () => {
  const fixture = await createGenerationFixture();

  try {
    const result = await generateArtifact(fixture, "task", "validate docs");
    const contents = await readFile(path.join(fixture, result.path), "utf8");

    assert.equal(result.path, "docs/specs/tasks/validate-docs.md");
    assert.match(contents, /^# Validate Docs/m);
    assert.match(contents, /Task ID:/);
    assert.match(contents, /Feature Spec:/);
    assert.match(contents, /Verification/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("generates a review checklist from the review template", async () => {
  const fixture = await createGenerationFixture();

  try {
    const result = await generateArtifact(fixture, "review", "validate docs");
    const contents = await readFile(path.join(fixture, result.path), "utf8");

    assert.equal(result.path, "docs/specs/reviews/validate-docs.md");
    assert.match(contents, /^# Validate Docs Review/m);
    assert.match(contents, /Review ID:/);
    assert.match(contents, /Outcome:/);
    assert.match(contents, /Governance Checklist/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createGenerationFixture(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-generate-"));
  await mkdir(path.join(root, "docs", "decisions"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs"), { recursive: true });

  await writeFile(
    path.join(root, "docs", "specs", "feature-template.md"),
    [
      "# Feature Spec Template",
      "",
      "## Metadata",
      "",
      "- Feature ID:",
      "- Title:",
      "",
      "## Traceability",
      "",
      "- Product Intent Link:",
      "",
      "## Acceptance Criteria",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(root, "docs", "specs", "task-template.md"),
    [
      "# Task Template",
      "",
      "## Metadata",
      "",
      "- Task ID:",
      "",
      "## Traceability",
      "",
      "- Feature Spec:",
      "",
      "## Verification",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(root, "docs", "specs", "review-template.md"),
    [
      "# Review Template",
      "",
      "## Metadata",
      "",
      "- Review ID:",
      "- Outcome:",
      "",
      "## Governance Checklist",
    ].join("\n"),
    "utf8",
  );

  return root;
}
