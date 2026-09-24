import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { archiveFeature } from "../src/archive.js";

test("archive adds, modifies, and removes requirements", async () => {
  const fixture = await createArchiveFixture({
    delta: [
      "Domain spec: docs/specs/domains/auth/spec.md",
      "",
      "### ADDED Requirements",
      "",
      "#### Requirement: Two-Factor Authentication",
      "",
      "The system MUST ask for a second factor.",
      "",
      "### MODIFIED Requirements",
      "",
      "#### Requirement: Session Expiration",
      "",
      "The system MUST expire sessions after 15 minutes.",
      "",
      "### REMOVED Requirements",
      "",
      "#### Requirement: Remember Me",
    ].join("\n"),
  });

  try {
    const result = await archiveFeature(fixture, "auth-change");
    const domain = await readFile(path.join(fixture, "docs/specs/domains/auth/spec.md"), "utf8");
    const feature = await readFile(path.join(fixture, "docs/specs/features/auth-change.md"), "utf8");

    assert.match(result.message, /Archived auth-change into docs\/specs\/domains\/auth\/spec.md/);
    assert.match(domain, /#### Requirement: Two-Factor Authentication/);
    assert.match(domain, /15 minutes/);
    assert.doesNotMatch(domain, /Remember Me/);
    assert.match(feature, /- Status: Archived/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("archive refuses a duplicate added requirement", async () => {
  const fixture = await createArchiveFixture({
    delta: [
      "Domain spec: docs/specs/domains/auth/spec.md",
      "",
      "### ADDED Requirements",
      "",
      "#### Requirement: Session Expiration",
      "",
      "Duplicate.",
    ].join("\n"),
  });

  try {
    await assert.rejects(() => archiveFeature(fixture, "auth-change"), /ADDED requirement already exists/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("archive refuses a missing modified requirement", async () => {
  const fixture = await createArchiveFixture({
    delta: [
      "Domain spec: docs/specs/domains/auth/spec.md",
      "",
      "### MODIFIED Requirements",
      "",
      "#### Requirement: Missing Rule",
      "",
      "Nope.",
    ].join("\n"),
  });

  try {
    await assert.rejects(() => archiveFeature(fixture, "auth-change"), /MODIFIED requirement was not found/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("archive refuses a review that is not approved", async () => {
  const fixture = await createArchiveFixture({
    delta: "No behavior change",
    outcome: "Request Changes",
  });

  try {
    await assert.rejects(() => archiveFeature(fixture, "auth-change"), /Outcome must be Approve/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("archive refuses placeholder evidence", async () => {
  const fixture = await createArchiveFixture({
    delta: "No behavior change",
    evidence: "Evidence:",
  });

  try {
    await assert.rejects(() => archiveFeature(fixture, "auth-change"), /evidence is missing/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("archive records no behavior change without editing the domain spec", async () => {
  const fixture = await createArchiveFixture({ delta: "No behavior change" });

  try {
    const before = await readFile(path.join(fixture, "docs/specs/domains/auth/spec.md"), "utf8");
    await archiveFeature(fixture, "auth-change");
    const after = await readFile(path.join(fixture, "docs/specs/domains/auth/spec.md"), "utf8");
    assert.equal(after, before);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

async function createArchiveFixture(options: {
  delta: string;
  outcome?: string;
  evidence?: string;
}): Promise<string> {
  const root = await mkdtemp(path.join(tmpdir(), "aidos-archive-"));
  await mkdir(path.join(root, "docs/specs/features"), { recursive: true });
  await mkdir(path.join(root, "docs/specs/reviews"), { recursive: true });
  await mkdir(path.join(root, "docs/specs/domains/auth"), { recursive: true });

  await writeFile(
    path.join(root, "docs/specs/domains/auth/spec.md"),
    [
      "# Auth",
      "",
      "## Purpose",
      "",
      "Authentication.",
      "",
      "## Requirements",
      "",
      "#### Requirement: Session Expiration",
      "",
      "The system MUST expire sessions after 30 minutes.",
      "",
      "#### Requirement: Remember Me",
      "",
      "The system MAY remember the user.",
      "",
    ].join("\n"),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs/specs/features/auth-change.md"),
    ["# Auth Change", "", "## Metadata", "", "- Status: Draft", "", "## Behavior Delta", "", options.delta, ""].join(
      "\n",
    ),
    "utf8",
  );
  await writeFile(
    path.join(root, "docs/specs/reviews/auth-change.md"),
    [
      "# Review",
      "",
      "## Metadata",
      "",
      "- Schema: 2",
      `- Outcome: ${options.outcome ?? "Approve"}`,
      "",
      `- ${options.evidence ?? "Evidence: npm test passed."}`,
      "",
    ].join("\n"),
    "utf8",
  );

  return root;
}
