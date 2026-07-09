import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { validateProject } from "../src/validate.js";

test("valid AIDOS skeleton passes validation", async () => {
  const fixture = await createValidProject();

  try {
    const result = await validateProject(fixture);

    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, []);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("missing required files are reported", async () => {
  const fixture = await createValidProject();

  try {
    await rm(path.join(fixture, "docs", "product-intent.md"));

    const result = await validateProject(fixture);

    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /Missing required file: docs\/product-intent\.md/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("ADRs must contain required sections", async () => {
  const fixture = await createValidProject();

  try {
    await writeFile(
      path.join(fixture, "docs", "decisions", "ADR-001-test.md"),
      "# ADR-001: Test\n\n## Status\n\nAccepted\n",
      "utf8",
    );

    const result = await validateProject(fixture);

    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /ADR-001-test\.md missing section: Context/);
    assert.match(result.errors.join("\n"), /ADR-001-test\.md missing section: Decision/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("broken markdown links are reported", async () => {
  const fixture = await createValidProject();

  try {
    const readmePath = path.join(fixture, "README.md");
    const readme = await readFile(readmePath, "utf8");
    await writeFile(readmePath, `${readme}\n[Broken](docs/missing.md)\n`, "utf8");

    const result = await validateProject(fixture);

    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /Broken markdown link in README\.md: docs\/missing\.md/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createValidProject(): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-"));
  await mkdir(path.join(root, ".ai"), { recursive: true });
  await mkdir(path.join(root, "docs", "decisions"), { recursive: true });
  await mkdir(path.join(root, "docs", "specs"), { recursive: true });
  await mkdir(path.join(root, "ops"), { recursive: true });

  const files: Record<string, string> = {
    "README.md": "# Test\n\nSee [Product Intent](docs/product-intent.md).\n",
    "AGENTS.md": [
      "# Agent Operating Instructions",
      "",
      "Required reading: README.md, docs/product-intent.md, docs/architecture.md.",
    ].join("\n"),
    ".ai/constitution.md": "# Constitution\n",
    ".ai/planner.md": "# Planner\n",
    ".ai/developer.md": "# Developer\n",
    ".ai/reviewer.md": "# Reviewer\n",
    ".ai/workflow.md": "# Workflow\n",
    ".ai/constraints.md": "# Constraints\n",
    ".ai/memory.md": "# Memory\n",
    "docs/product-intent.md": "# Product Intent\n",
    "docs/roadmap.md": "# Roadmap\n",
    "docs/architecture.md": "# Architecture\n",
    "docs/decisions/ADR-001-test.md": [
      "# ADR-001: Test",
      "",
      "## Status",
      "",
      "Accepted",
      "",
      "## Context",
      "",
      "Context.",
      "",
      "## Decision",
      "",
      "Decision.",
      "",
      "## Alternatives",
      "",
      "Alternatives.",
      "",
      "## Consequences",
      "",
      "Consequences.",
    ].join("\n"),
    "docs/specs/feature-template.md": "# Feature Spec Template\n\n## Traceability\n",
    "docs/specs/task-template.md": "# Task Template\n\n## Traceability\n",
    "docs/specs/review-template.md": "# Review Template\n\n## Traceability Check\n",
    "ops/deploy.md": "# Deploy\n",
    "ops/environments.md": "# Environments\n",
    "ops/troubleshooting.md": "# Troubleshooting\n",
  };

  await Promise.all(
    Object.entries(files).map(async ([relativePath, contents]) => {
      await writeFile(path.join(root, relativePath), contents, "utf8");
    }),
  );

  return root;
}
