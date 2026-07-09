import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import { initProject } from "../src/init.js";
import { validateProject } from "../src/validate.js";

test("initializes a valid AIDOS skeleton in the target directory", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-init-"));

  try {
    const result = await initProject(fixture);
    const validation = await validateProject(fixture);

    assert.equal(result.createdFiles.length, 24);
    assert.equal(validation.ok, true);
    assert.deepEqual(validation.errors, []);
    assert.match(
      await readFile(path.join(fixture, "docs", "decisions", "ADR-002-runtime-stack.md"), "utf8"),
      /Runtime Stack/,
    );
    assert.match(await readFile(path.join(fixture, "docs", "product-intent.md"), "utf8"), /## Mission/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("does not overwrite existing files by default", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-init-"));
  const readmePath = path.join(fixture, "README.md");

  try {
    await writeFile(readmePath, "# Existing Project\n", "utf8");

    await assert.rejects(
      () => initProject(fixture),
      /Refusing to overwrite existing file: README\.md/,
    );

    assert.equal(await readFile(readmePath, "utf8"), "# Existing Project\n");
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("update mode requires explicit overwrite confirmation", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-init-"));
  const readmePath = path.join(fixture, "README.md");

  try {
    await initProject(fixture);
    await writeFile(readmePath, "# Customized Existing Project\n", "utf8");

    await assert.rejects(
      () => initProject(fixture, { update: true }),
      /Update mode requires --confirm-overwrite/,
    );

    assert.equal(await readFile(readmePath, "utf8"), "# Customized Existing Project\n");
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("update mode overwrites skeleton files when explicitly confirmed", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-init-"));
  const readmePath = path.join(fixture, "README.md");

  try {
    await initProject(fixture);
    await writeFile(readmePath, "# Customized Existing Project\n", "utf8");

    const result = await initProject(fixture, {
      update: true,
      confirmOverwrite: true,
      answers: {
        mission: "Updated mission",
      },
    });

    assert.equal(result.createdFiles.length, 0);
    assert.equal(result.updatedFiles.length, 24);
    assert.match(await readFile(readmePath, "utf8"), /# New AIDOS Project/);
    assert.match(
      await readFile(path.join(fixture, "docs", "product-intent.md"), "utf8"),
      /Updated mission/,
    );
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});

test("uses onboarding answers to personalize product intent and the first ADR", async () => {
  const fixture = await mkdtemp(path.join(tmpdir(), "aidos-init-"));

  try {
    await initProject(fixture, {
      answers: {
        mission: "Help teams ship governed AI-assisted projects",
        vision: "Every new project starts with durable intent and decision memory",
        principles: ["Explicit over magic", "Human control"],
        nonGoals: ["Replace product owners", "Make production decisions automatically"],
        plannedProductForm: "Hybrid CLI-first product",
        stackDecision: "TypeScript on Node.js for the initial CLI",
      },
    });

    const productIntent = await readFile(path.join(fixture, "docs", "product-intent.md"), "utf8");
    const firstAdr = await readFile(
      path.join(fixture, "docs", "decisions", "ADR-001-initial-project-structure.md"),
      "utf8",
    );

    assert.match(productIntent, /Help teams ship governed AI-assisted projects/);
    assert.match(productIntent, /Every new project starts with durable intent and decision memory/);
    assert.match(productIntent, /- Explicit over magic/);
    assert.match(productIntent, /- Replace product owners/);
    assert.match(firstAdr, /Hybrid CLI-first product/);
    assert.match(firstAdr, /TypeScript on Node\.js for the initial CLI/);
  } finally {
    await rm(fixture, { recursive: true, force: true });
  }
});
