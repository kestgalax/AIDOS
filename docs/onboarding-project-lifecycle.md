# Project Lifecycle Onboarding

This guide describes how to move from an initial idea to the first traced feature in a new AIDOS project.

## Prerequisites

1. Clone the AIDOS tooling repository once.
2. Initialize your project:

```bash
npm exec aidos -- init ../my-new-project --interactive
```

3. Set `AIDOS_ROOT` or update `aidos.config.json` in the new project.

## Phase 1: Idea

Goal: capture why the project exists.

Artifacts:

- `docs/product-intent.md`
- `docs/roadmap.md` Milestone 0

Exit criteria:

- Mission and vision are concrete enough for planning.
- Non-goals are explicit.

## Phase 2: Stack ADR Gate

Goal: choose runtime direction before application code.

Artifacts:

- `docs/decisions/ADR-002-runtime-stack.md`
- updated `docs/architecture.md`

Rules:

- Do not scaffold application runtime code before ADR-002 is Accepted.
- Use `aidos new adr "runtime stack"` if ADR-002 needs replacement instead of amendment.

Exit criteria:

- ADR-002 status is Accepted.
- Architecture document reflects the chosen stack.

## Phase 3: Dev Environment

Goal: define how developers run and verify the accepted stack locally.

Artifacts:

- `ops/environments.md`
- `ops/ci.md`

Checklist:

- Local runtime and package manager are documented.
- Validation commands are documented.
- CI expectations are documented without binding to one vendor.

Exit criteria:

- A developer can run the project locally using documented steps.
- Governance commands are runnable from the project root.

## Phase 4: First Feature

Goal: create linked feature, task, and review artifacts.

Command:

```bash
npm exec --prefix ../AIDOS aidos -- new flow "first user workflow"
```

Then run:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

Optional:

```bash
npm exec --prefix ../AIDOS aidos -- new dashboard ./dashboard
```

Exit criteria:

- Traceability report has no missing required fields for the first flow.
- Review outcome is understood before merge.
