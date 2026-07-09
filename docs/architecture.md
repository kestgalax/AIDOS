# Architecture

AIDOS is a knowledge-first operating system for AI-assisted development. Its architecture starts with repository artifacts and later grows into executable tooling.

## System Layers

```text
WHY         Product Intent
WHAT        Roadmap and Features
HOW         Architecture
DECISIONS   ADRs
EXECUTION   Agent Roles, Specs, Tasks
CONTROL     Governance, Reviews, Verification
```

## Core Components

### Product Intent Layer

Source: `docs/product-intent.md`

Defines the reason the project exists, the mission, the desired future state, non-goals, principles, trade-offs, and success criteria.

This layer constrains all lower layers.

### Architecture Layer

Source: `docs/architecture.md`

Defines system structure, component boundaries, integration rules, and technical constraints. Architecture must be updated when the system shape changes.

### Decision Layer

Source: `docs/decisions/`

Stores Architecture Decision Records. ADRs explain why the system is the way it is, not only what the current state is.

### Execution Layer

Sources:

- `.ai/planner.md`
- `.ai/developer.md`
- `.ai/reviewer.md`
- `.ai/workflow.md`
- `docs/specs/`

Defines how agents turn roadmap items into feature specs, tasks, implementation, review, and release evidence.

### Governance Layer

Sources:

- `.ai/constitution.md`
- `.ai/constraints.md`
- `.ai/memory.md`
- `docs/specs/review-template.md`

Defines mandatory rules, quality gates, security expectations, documentation rules, and change management.

### Future Runtime Layer

Source: `docs/decisions/ADR-002-product-form-and-stack.md` and `src/`.

The accepted runtime direction is a hybrid product with a CLI-first implementation sequence. The first executable capability is local structural validation through `aidos validate`.

### Dashboard Layer

Source: `docs/decisions/ADR-003-dashboard-ui-stack-and-boundary.md`, `ADR-005-optional-dashboard-scaffold.md`, and `examples/dashboard-starter`.

The accepted dashboard direction is a separate Next.js App Router application using shadcn/ui. It is a presentation and navigation layer over markdown repository artifacts and CLI/core report models, not a replacement source of truth.

The first dashboard shell reads product intent, roadmap status, and ADR metadata directly from markdown files. shadcn/ui component installation is pending local access to `ui.shadcn.com`.

## Integration Rules

- `AGENTS.md` is the agent entry point.
- `docs/product-intent.md` is the product direction source.
- `docs/architecture.md` is the technical structure source.
- `docs/decisions/` explains durable decisions.
- `.ai/` defines behavior for agents.
- `docs/specs/` defines executable work formats.
- `ops/` contains environment and operational knowledge.

## Change Rules

- Product intent changes require explicit human approval.
- Architecture changes require ADR coverage.
- Runtime stack selection requires ADR coverage.
- Agent role changes require updates to `.ai/` files.
- Workflow changes require updates to `.ai/workflow.md`.
- Review criteria changes require updates to `.ai/constitution.md` or `docs/specs/review-template.md`.

## Future Product Architecture

`ADR-002-product-form-and-stack.md` accepts TypeScript on Node.js with npm for the first CLI/core implementation.

The expected product capabilities are:

- validate repository structure;
- validate ADRs and specs;
- generate new ADR/spec/task/review artifacts;
- maintain traceability links;
- produce governance reports;
- optionally expose a UI for navigation and visualization.

`ADR-003-dashboard-ui-stack-and-boundary.md` accepts a read-only dashboard boundary.

`ADR-005-optional-dashboard-scaffold.md` places the reference dashboard in `examples/dashboard-starter/` as an optional consumer scaffold.

`ADR-006-generic-ci-governance-scripts.md` allows generic CI governance scripts in the project starter.

`ADR-004-defer-write-back-persistence-and-deployment.md` defers write-back, persistence, hosted deployment, authentication, and external integrations until a future ADR is accepted for a concrete trigger.

## New Project Bootstrap

AIDOS bootstraps consumer projects through:

- clone-template workflow documented in `docs/quickstart-new-project.md`;
- `templates/project-starter/` copied by `aidos init`;
- lifecycle gates in `docs/onboarding-project-lifecycle.md`;
- linked artifact generation through `aidos new flow`;
- optional dashboard scaffold through `aidos new dashboard`.

## Source Of Truth Rule

Executable tooling may help create, validate, or visualize AIDOS artifacts. It must not become the only place where project knowledge exists. Repository files remain the durable source of truth.
