import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { archiveReviewError } from "./review.js";

export interface ArchiveResult {
  message: string;
}

interface RequirementBlock {
  name: string;
  text: string;
}

export async function archiveFeature(rootDirectory: string, slug: string): Promise<ArchiveResult> {
  const root = path.resolve(rootDirectory);
  const featureRelative = `docs/specs/features/${slug}.md`;
  const reviewRelative = `docs/specs/reviews/${slug}.md`;
  const featurePath = path.join(root, featureRelative);
  const reviewPath = path.join(root, reviewRelative);
  const feature = await readRequired(featurePath, `Missing feature: ${featureRelative}`);
  const review = await readRequired(reviewPath, `Missing review: ${reviewRelative}`);
  const reviewError = archiveReviewError(review);
  if (reviewError) {
    throw new Error(reviewError);
  }

  const delta = readSection(feature, "Behavior Delta");
  if (delta === null) {
    throw new Error("Feature has no Behavior Delta");
  }

  if (/No behavior change/i.test(delta)) {
    await writeFile(featurePath, setStatus(feature, "Archived"), "utf8");
    return { message: `Archived ${slug} with no behavior change` };
  }

  const domainRelative = readDomainSpecPath(delta);
  if (domainRelative === null) {
    throw new Error("Behavior Delta is missing Domain spec path");
  }

  const domainPath = path.join(root, domainRelative);
  const domain = await readRequired(domainPath, `Missing domain spec: ${domainRelative}`);
  const merged = applyDelta(domain, delta);
  await writeFile(domainPath, merged, "utf8");
  await writeFile(featurePath, setStatus(feature, "Archived"), "utf8");
  return { message: `Archived ${slug} into ${domainRelative}` };
}

function applyDelta(domain: string, delta: string): string {
  let requirements = splitRequirements(domain);
  for (const block of blocksIn(delta, "ADDED Requirements")) {
    if (requirements.some((requirement) => requirement.name === block.name)) {
      throw new Error(`ADDED requirement already exists: ${block.name}`);
    }
    requirements.push(block);
  }
  for (const block of blocksIn(delta, "MODIFIED Requirements")) {
    const index = requirements.findIndex((requirement) => requirement.name === block.name);
    if (index === -1) {
      throw new Error(`MODIFIED requirement was not found: ${block.name}`);
    }
    requirements[index] = block;
  }
  for (const block of blocksIn(delta, "REMOVED Requirements")) {
    const next = requirements.filter((requirement) => requirement.name !== block.name);
    if (next.length === requirements.length) {
      throw new Error(`REMOVED requirement was not found: ${block.name}`);
    }
    requirements = next;
  }

  return replaceRequirements(domain, requirements);
}

function blocksIn(delta: string, heading: string): RequirementBlock[] {
  const section = readSection(delta, heading, "### ");
  if (section === null) {
    return [];
  }
  return splitRequirements(section);
}

function splitRequirements(contents: string): RequirementBlock[] {
  const lines = contents.split("\n");
  const blocks: RequirementBlock[] = [];
  let current: string[] | null = null;
  let name = "";

  const flush = () => {
    if (current === null) {
      return;
    }
    blocks.push({ name, text: current.join("\n").trimEnd() });
    current = null;
  };

  for (const line of lines) {
    const match = /^#### Requirement:\s*(.+)$/.exec(line.trim());
    if (match) {
      flush();
      name = match[1]?.trim() ?? "";
      current = [line.trimEnd()];
      continue;
    }
    if (current !== null) {
      if (line.startsWith("### ") || line.startsWith("## ")) {
        flush();
      } else {
        current.push(line);
      }
    }
  }
  flush();
  return blocks.filter((block) => block.name.length > 0 && block.name !== "Requirement name");
}

function replaceRequirements(domain: string, requirements: RequirementBlock[]): string {
  const lines = domain.split("\n");
  const start = lines.findIndex((line) => line.trim() === "## Requirements");
  if (start === -1) {
    throw new Error("Domain spec is missing ## Requirements");
  }

  let end = lines.length;
  for (let index = start + 1; index < lines.length; index += 1) {
    if (lines[index]?.startsWith("## ")) {
      end = index;
      break;
    }
  }

  const body = requirements.map((requirement) => requirement.text).join("\n\n");
  const next = [
    ...lines.slice(0, start + 1),
    "",
    body,
    "",
    ...lines.slice(end),
  ];
  return `${next.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`;
}

function readDomainSpecPath(delta: string): string | null {
  const match = delta.match(/^Domain spec:\s*(.+)$/m);
  const value = match?.[1]?.trim() ?? "";
  return value.length === 0 ? null : value;
}

function readSection(contents: string, heading: string, marker = "## "): string | null {
  const lines = contents.split("\n");
  const start = lines.findIndex((line) => line.trim() === `${marker}${heading}`);
  if (start === -1) {
    return null;
  }

  const body: string[] = [];
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith(marker)) {
      break;
    }
    body.push(line);
  }
  return body.join("\n").trim();
}

function setStatus(contents: string, status: string): string {
  if (/^- Status:/m.test(contents)) {
    return contents.replace(/^- Status:.*$/m, `- Status: ${status}`);
  }
  if (/^## Metadata$/m.test(contents)) {
    return contents.replace(/^## Metadata$/m, `## Metadata\n\n- Status: ${status}`);
  }
  return contents;
}

async function readRequired(filePath: string, message: string): Promise<string> {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new Error(message);
    }
    throw error;
  }
}
