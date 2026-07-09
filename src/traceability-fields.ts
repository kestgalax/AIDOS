export const traceabilityFields = {
  feature: ["Product Intent Link", "Roadmap Item", "Related ADRs"],
  task: ["Product Intent Link", "Roadmap Item", "Feature Spec", "Related ADRs"],
  review: ["Product Intent Link", "Roadmap Item", "Feature Spec", "Task", "Related ADRs"],
} as const;

export type TraceableArtifactType = keyof typeof traceabilityFields;

export interface TraceabilityContext {
  productIntentLink?: string;
  roadmapItem?: string;
  featureSpec?: string;
  taskSpec?: string;
  relatedAdrs?: string[];
}

export const defaultTraceabilityContext: TraceabilityContext = {
  productIntentLink: "docs/product-intent.md",
  roadmapItem: "Milestone 2: First Feature",
  relatedAdrs: ["docs/decisions/ADR-002-runtime-stack.md"],
};

export function fillTraceabilityFields(template: string, type: TraceableArtifactType, context: TraceabilityContext): string {
  const values: Record<string, string> = {
    "Product Intent Link": context.productIntentLink ?? defaultTraceabilityContext.productIntentLink ?? "",
    "Roadmap Item": context.roadmapItem ?? defaultTraceabilityContext.roadmapItem ?? "",
    "Feature Spec": context.featureSpec ?? "",
    Task: context.taskSpec ?? "",
    "Related ADRs": (context.relatedAdrs ?? defaultTraceabilityContext.relatedAdrs ?? []).join(", "),
  };

  let result = template;
  for (const field of traceabilityFields[type]) {
    const value = values[field] ?? "";
    if (value.length === 0) {
      continue;
    }
    const escapedField = escapeRegExp(field);
    result = result.replace(new RegExp(`^- ${escapedField}:[ \\t]*$`, "m"), `- ${field}: ${value}`);
  }

  return result;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function featureSpecPath(slug: string): string {
  return `docs/specs/features/${slug}.md`;
}

export function taskSpecPath(slug: string): string {
  return `docs/specs/tasks/${slug}.md`;
}

export function reviewSpecPath(slug: string): string {
  return `docs/specs/reviews/${slug}.md`;
}
