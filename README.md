# AI Development Operating System

> [Русская версия](README.ru.md)

AIDOS is a self-describing development environment for AI-assisted software projects.

The project treats a repository not only as source code, but as an operating system for product intent, architectural memory, task execution, and quality control. Its purpose is to help human and AI contributors make consistent decisions over time.

## Why This Exists

AI agents can write code, run tests, open pull requests, and interact with external systems. They still need durable project context: product intent, architectural constraints, previous decisions, and governance rules.

AIDOS provides that context as first-class repository artifacts.

## Operating Model

```text
WHY
 ↓
WHAT
 ↓
HOW
 ↓
DECISIONS
 ↓
EXECUTION
 ↓
CONTROL
```

Each layer narrows the next one:

- Product intent defines why the project exists.
- Architecture defines how the system is shaped.
- ADRs explain why important decisions were made.
- Execution rules define how agents plan, implement, and review work.
- Governance rules define what is mandatory for every change.

## Repository Map

- `CHANGELOG.md` — what changed in AIDOS.
- `AGENTS.md` — entry point for AI agents.
- `.ai/constitution.md` — mandatory project governance.
- `.ai/planner.md` — Planner Agent role.
- `.ai/developer.md` — Developer Agent role.
- `.ai/reviewer.md` — Reviewer Agent role.
- `.ai/workflow.md` — delivery lifecycle.
- `.ai/constraints.md` — global constraints and trade-offs.
- `.ai/memory.md` — rules for preserving project memory.
- `docs/product-intent.md` — context, mission, vision, intent, principles, non-goals, trade-offs, success criteria.
- `docs/roadmap.md` — staged roadmap from knowledge system to runtime product.
- `docs/architecture.md` — architecture of AIDOS itself.
- `docs/product-form-decision.md` — guide for the next CLI, web app, or hybrid decision.
- `docs/quickstart-new-project.md` — quickstart for applying AIDOS to a new project.
- `docs/onboarding-project-lifecycle.md` — phased onboarding from idea to first feature.
- `docs/ci-governance.md` — generic CI guidance for governance checks.
- `templates/project-starter/` — file-based skeleton used by `aidos init`.
- `docs/decisions/` — Architecture Decision Records.
- `docs/specs/` — feature, task, review, domain, and spike templates.
- `ops/` — operational notes and future deployment model.
- `plan/aidos-turnkey-implementation.md` — practical plan for implementing AIDOS as a turnkey product.
- `examples/generated-project/` — example project produced by `aidos init`.
- `examples/dashboard-starter/` — optional read-only dashboard scaffold for consumer projects.
- Living consumer: [CarrotType](https://github.com/kestgalax/carrottype) (private / invite-only) — real macOS product using AIDOS; clone as sibling `../carrottype`. See `docs/living-consumers.md`.

## How To Start

Humans should read:

1. `docs/product-intent.md`
2. `docs/roadmap.md`
3. `docs/architecture.md`
4. `docs/decisions/`

AI agents should start with `AGENTS.md` and follow its required reading order before making changes.

## New Project Quickstart

To apply AIDOS to a new project, follow `docs/quickstart-new-project.md`.

For a generated example, inspect `examples/generated-project/`.

For a living consumer (private), see `docs/living-consumers.md` and sibling `../carrottype` when you have access.

## Local CLI

The first executable AIDOS capability is local structural validation:

```bash
npm install
npm run validate
```

The validation command checks required AIDOS files, ADR structure, spec traceability markers, markdown links, and whether runtime scaffold is backed by an accepted ADR.

The first artifact generators are also available:

```bash
npm exec aidos new adr "runtime packaging"
npm exec aidos new feature "first project setup"
npm exec aidos new task "validate docs"
npm exec aidos new review "validate docs"
npm exec aidos new flow "first user workflow"
npm exec aidos new domain "authentication"
npm exec aidos new spike "session expiration"
```

`aidos new flow` creates linked feature, task, and review artifacts with traceability autofill.

Optional dashboard scaffold for a consumer project:

```bash
npm exec aidos new dashboard ./dashboard
```

These commands create reviewable markdown artifacts under `docs/decisions/` and `docs/specs/`.

To initialize AIDOS in a new project directory:

```bash
npm exec aidos init ./my-new-project
npm exec aidos init ./my-new-project --interactive
```

The `init` flow creates a valid AIDOS skeleton and refuses to overwrite existing files by default. Interactive mode asks for mission, vision, principles, non-goals, product form, and stack direction, then uses those answers in `docs/product-intent.md` and the first ADR.

To refresh an existing AIDOS skeleton, use update mode with explicit overwrite confirmation:

```bash
npm exec aidos init ./my-existing-project --update --confirm-overwrite
```

Update mode refreshes governance files and spec templates after `--confirm-overwrite`. It does not rewrite product intent, architecture, roadmap, ADRs, or filled specs.

To inspect traceability health:

```bash
npm exec aidos trace
```

The trace report counts feature, task, review, and ADR artifacts and reports missing traceability fields.

To run the first deterministic reviewer gate:

```bash
npm exec aidos review
```

The review report checks feature and task artifacts for concrete acceptance criteria, verification evidence, documentation entries, and ADR impact. Schema 2 reviews must also have Outcome and Evidence. It classifies the result as `Approve`, `Request Changes`, or `Block`.

To merge an approved behavior delta into a domain spec:

```bash
npm exec aidos archive first-user-workflow
```

To build or run the optional dashboard starter:

```bash
npm --prefix examples/dashboard-starter install
npm run dashboard:build
npm run dashboard:dev
```

The dashboard starter is an optional read-only projection of markdown repository artifacts. Add it to a consumer project with `aidos new dashboard`. It uses `AIDOS_PROJECT_ROOT` to read project artifacts. `ADR-005` keeps the dashboard out of the AIDOS core surface.

## Current Status

This repository has completed the documentation and governance bootstrap. `ADR-002` accepts a hybrid product model with a CLI-first implementation sequence using TypeScript on Node.js and npm.

The current executable scope includes clone-template project bootstrap through `templates/project-starter/`, `aidos init`, a self-contained project that runs installed `aidos` (no sibling `toolingRoot`), lifecycle onboarding docs, traceability autofill and `aidos new flow`, domain specs and `aidos archive`, spikes, generic CI governance scripts, optional `aidos new dashboard`, `aidos validate`, `aidos trace`, `aidos review`, artifact generators, and a shared trace/review report model. See `CHANGELOG.md`. `ADR-004` defers dashboard write-back, persistence, hosted deployment, auth, and external integrations until a future ADR.
