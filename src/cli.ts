#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";

import { validateProject } from "./validate.js";
import { generateArtifact, generateFlow, type ArtifactType } from "./generate.js";
import { initProject, type OnboardingAnswers } from "./init.js";
import { traceProject } from "./trace.js";
import { reviewProject } from "./review.js";
import { scaffoldDashboard } from "./scaffold-dashboard.js";
import { defaultTraceabilityContext, type TraceabilityContext } from "./traceability-fields.js";

const command = process.argv[2];

if (command === "validate") {
  const result = await validateProject(process.cwd());

  if (result.ok) {
    console.log("AIDOS validation passed");
    process.exitCode = 0;
  } else {
    console.error("AIDOS validation failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  }
} else if (command === "new") {
  await handleNewCommand(process.argv.slice(3));
} else if (command === "init") {
  const initArgs = process.argv.slice(3);
  const interactive = initArgs.includes("--interactive");
  const update = initArgs.includes("--update");
  const confirmOverwrite = initArgs.includes("--confirm-overwrite");
  const targetDirectory = initArgs.find((arg) => !arg.startsWith("--")) ?? process.cwd();
  const answers = interactive ? await askOnboardingQuestions() : undefined;
  const result = await initProject(targetDirectory, { answers, update, confirmOverwrite });

  console.log(`Initialized AIDOS project in ${targetDirectory}`);
  console.log(`Created ${result.createdFiles.length} files`);
  console.log(`Updated ${result.updatedFiles.length} files`);
  printPostInitInstructions(interactive);
  process.exitCode = 0;
} else if (command === "trace") {
  const result = await traceProject(process.cwd());
  console.log(result.text);
  process.exitCode = result.missingLinks.length === 0 ? 0 : 1;
} else if (command === "review") {
  const result = await reviewProject(process.cwd());
  console.log(result.text);
  process.exitCode = result.outcome === "Approve" ? 0 : 1;
} else if (command === "archive") {
  const { archiveFeature } = await import("./archive.js");
  const slug = process.argv[3] ?? "";
  if (slug === "") {
    console.error("Usage: aidos archive <feature-slug>");
    process.exitCode = 1;
  } else {
    try {
      const result = await archiveFeature(process.cwd(), slug);
      console.log(result.message);
      process.exitCode = 0;
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Archive failed");
      process.exitCode = 1;
    }
  }
} else {
  console.error("Usage: aidos <validate|new|init|trace|review|archive>");
  process.exitCode = 1;
}

async function handleNewCommand(args: string[]): Promise<void> {
  const artifactType = args[0];

  if (artifactType === "flow") {
    const title = getPositionalTitle(args.slice(1));
    if (title === "") {
      console.error('Usage: aidos new flow "<title>" [--roadmap-item <item>] [--related-adrs <paths>]');
      process.exitCode = 1;
      return;
    }

    const options = parseGenerateOptions(args.slice(1));
    const result = await generateFlow(process.cwd(), title, options);
    console.log(`Created ${result.feature.path}`);
    console.log(`Created ${result.task.path}`);
    console.log(`Created ${result.review.path}`);
    process.exitCode = 0;
    return;
  }

  if (artifactType === "dashboard") {
    const target = args.find((arg) => !arg.startsWith("--")) ?? path.join(process.cwd(), "dashboard");
    await scaffoldDashboard(target);
    console.log(`Created dashboard scaffold in ${target}`);
    console.log("Set AIDOS_PROJECT_ROOT to your project root when running the dashboard.");
    process.exitCode = 0;
    return;
  }

  const title = getPositionalTitle(args.slice(1));
  if (!isArtifactType(artifactType) || title === "") {
    console.error("Usage: aidos new <adr|feature|task|review|domain|spike|flow|dashboard> <title> [options]");
    process.exitCode = 1;
    return;
  }

  const options = parseGenerateOptions(args.slice(1));
  const result = await generateArtifact(process.cwd(), artifactType, title, options);
  console.log(`Created ${result.path}`);
  process.exitCode = 0;
}

function parseGenerateOptions(args: string[]): { traceability?: TraceabilityContext } {
  const traceability: TraceabilityContext = { ...defaultTraceabilityContext };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--product-intent-link") {
      traceability.productIntentLink = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--roadmap-item") {
      traceability.roadmapItem = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--feature") {
      traceability.featureSpec = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--task") {
      traceability.taskSpec = args[index + 1];
      index += 1;
      continue;
    }
    if (arg === "--related-adrs") {
      traceability.relatedAdrs = (args[index + 1] ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);
      index += 1;
    }
  }

  return { traceability };
}

function getPositionalTitle(args: string[]): string {
  return args.filter((arg) => !arg.startsWith("--") && !isOptionValue(args, arg)).join(" ").trim();
}

function isOptionValue(args: string[], value: string): boolean {
  const optionFlags = ["--product-intent-link", "--roadmap-item", "--feature", "--task", "--related-adrs"];
  for (let index = 0; index < args.length; index += 1) {
    if (optionFlags.includes(args[index] ?? "") && args[index + 1] === value) {
      return true;
    }
  }
  return false;
}

function isArtifactType(value: string | undefined): value is ArtifactType {
  return (
    value === "adr" ||
    value === "feature" ||
    value === "task" ||
    value === "review" ||
    value === "domain" ||
    value === "spike"
  );
}

async function askOnboardingQuestions(): Promise<OnboardingAnswers> {
  const readline = createInterface({ input, output });

  try {
    const mission = await readline.question("Mission: ");
    const vision = await readline.question("Vision: ");
    const principles = await readline.question("Principles (comma-separated): ");
    const nonGoals = await readline.question("Non-goals (comma-separated): ");
    const plannedProductForm = await readline.question("Planned product form: ");
    const stackDecision = await readline.question("Initial stack direction: ");

    return {
      mission: emptyToUndefined(mission),
      vision: emptyToUndefined(vision),
      principles: splitList(principles),
      nonGoals: splitList(nonGoals),
      plannedProductForm: emptyToUndefined(plannedProductForm),
      stackDecision: emptyToUndefined(stackDecision),
    };
  } finally {
    readline.close();
  }
}

function printPostInitInstructions(interactive: boolean): void {
  if (!interactive) {
    return;
  }

  console.log("");
  console.log("Next steps:");
  console.log("1. Read docs/onboarding-project-lifecycle.md in your AIDOS clone.");
  console.log("2. Accept docs/decisions/ADR-002-runtime-stack.md before runtime code.");
  console.log("3. Run npm run aidos:validate from the new project.");
  console.log("4. Create the first traced feature with: aidos new flow \"first feature\"");
}

function splitList(value: string): string[] | undefined {
  const items = value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  return items.length === 0 ? undefined : items;
}

function emptyToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}
