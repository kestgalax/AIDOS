# ADR-004: Defer Write-Back, Persistence, Deployment, And Integrations

## Status

Accepted

## Context

AIDOS has reached the minimal MVP described in `plan/aidos-turnkey-implementation.md`:

- CLI validation, generation, initialization, traceability, and review automation;
- a read-only dashboard in `apps/dashboard`;
- a shared trace/review report model in `src/report-model.ts`;
- markdown repository artifacts as the durable source of truth.

The next open product questions were whether AIDOS should add:

- write-back from the dashboard into repository files;
- a persistence layer beyond markdown files;
- hosted deployment for the dashboard or CLI;
- authentication for multi-user access;
- external integrations with GitHub, Cursor, or CI systems.

These capabilities would change architecture, security, operations, and governance boundaries. They should not be added implicitly while the product is still stabilizing around file-based knowledge and local CLI workflows.

## Decision

Defer write-back workflow, persistence, hosted deployment, authentication, and external integrations for the current product increment.

Continue with the accepted model:

- markdown files in the repository remain the only durable source of truth;
- CLI commands (`aidos init`, `aidos new`, `aidos validate`, `aidos trace`, `aidos review`) remain the mutation and automation surface;
- `apps/dashboard` remains a read-only projection of repository artifacts and CLI/core report models;
- distribution remains local-first through npm scripts and the CLI package;
- CI, hosted deployment, auth, database storage, and third-party integrations require a future ADR before implementation.

Revisit this decision when at least one concrete trigger appears:

- humans need to edit AIDOS artifacts from the dashboard instead of files or CLI;
- multiple users need concurrent access with authorization boundaries;
- traceability or review data outgrows file-based reporting and needs indexed storage;
- the project needs a hosted dashboard or published service boundary;
- GitHub, Cursor, or CI integration becomes a required workflow instead of an optional convenience.

## Alternatives

### Add Dashboard Write-Back Now

Rationale: rejected. It would introduce edit permissions, conflict handling, and audit requirements before the read-only dashboard model is fully exercised.

### Add A Database For Traceability And Review State

Rationale: rejected for now. File-based artifacts already satisfy the MVP, and a database would duplicate source of truth unless carefully bounded.

### Deploy The Dashboard As A Hosted Product Surface

Rationale: deferred. Local `npm run dashboard:dev` and `npm run dashboard:build` are sufficient for the current increment.

### Add GitHub, Cursor, Or CI Integrations Immediately

Rationale: deferred. Integrations should follow explicit workflow design and security review, not ad hoc scripting.

### Introduce Authentication For The Dashboard

Rationale: deferred. The current dashboard is a local read-only projection and does not expose mutating actions.

## Consequences

- No write-back, persistence, auth, hosted deployment, or external integration work may start without a superseding ADR.
- Product work should focus on strengthening file-based workflows, CLI/core quality, and read-only dashboard clarity.
- `ADR-003` dashboard boundary remains valid: presentation only, no repository mutation.
- Future ADRs may split these topics if one trigger becomes urgent, for example a dedicated deployment ADR or integration ADR.
- Roadmap items for persistence, CI, and integrations remain future milestones rather than immediate implementation tasks.
