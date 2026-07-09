# ADR-003: Dashboard UI Stack And Boundary

## Status

Accepted

## Context

AIDOS has completed the first CLI/core increment: validation, artifact generation, project initialization, traceability reporting, reviewer automation, and explicit update mode.

The next product step is a UI/dashboard that helps humans navigate project intent, roadmap, ADRs, traceability, and review blockers. This must not weaken the core AIDOS principle that repository markdown artifacts remain the durable source of truth.

The project needs a UI stack decision before scaffolding any dashboard application.

## Decision

Build the first AIDOS dashboard as a separate application under `apps/dashboard`.

Use:

- Next.js App Router for the dashboard application;
- React and TypeScript for UI code;
- shadcn/ui for ready-made accessible components and dashboard composition;
- Tailwind CSS through the shadcn/ui setup;
- local markdown files and CLI/core report models as the data source.

The dashboard is a presentation and navigation layer. It may read, visualize, and link AIDOS artifacts, but it must not become the only place where project knowledge exists.

The first dashboard scope should focus on:

- an app shell with sidebar navigation;
- product intent, roadmap, ADR, traceability, and review sections;
- cards for project health summary;
- tables or lists for ADRs and findings;
- visible missing-link and review-blocker states.

## Alternatives

### Keep CLI-Only

Rationale: rejected as the only next step because CLI is sufficient for automation but weak for human navigation and visual traceability.

### Build Custom UI Without A Component System

Rationale: rejected because it would create unnecessary design and accessibility work before the dashboard model is proven.

### Use shadcn/ui Inside The CLI Package Root

Rationale: rejected because mixing dashboard scaffolding with the CLI/core root would blur product boundaries and make it harder to preserve the CLI as the automation core.

### Use A Different Full-Stack UI Framework

Rationale: deferred. Next.js App Router is a strong default for a local dashboard and future web deployment, while shadcn/ui provides ready-made dashboard components without forcing a hosted backend or database.

## Consequences

- UI implementation is now allowed only inside the accepted dashboard boundary.
- CLI/core remains the source of validation, generation, traceability, and review logic.
- Markdown repository artifacts remain the source of truth.
- The dashboard may use generated JSON or direct filesystem reads only as a projection of markdown artifacts.
- Any persistence layer, external integration, authentication, hosted deployment, or write-back workflow still requires a future ADR.
- shadcn/ui components should be installed and composed inside `apps/dashboard`, not in the CLI/core root.
