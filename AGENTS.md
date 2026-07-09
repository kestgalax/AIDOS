# Agent Operating Instructions

This file is the required entry point for AI agents working in this repository.

## Required Reading Order

Before planning or changing anything, read these files in order:

1. `README.md`
2. `docs/product-intent.md`
3. `docs/roadmap.md`
4. `docs/architecture.md`
5. Current ADRs in `docs/decisions/`
6. `.ai/constitution.md`
7. The role file for your task:
   - `.ai/planner.md`
   - `.ai/developer.md`
   - `.ai/reviewer.md`

If a referenced file does not exist, treat that as a repository health issue and either create it as part of the assigned bootstrap task or report the blocker.

## Global Rules

- Preserve product intent and architecture before optimizing local implementation details.
- Do not introduce a runtime stack, framework, package manager, CI system, or deployment target without an ADR.
- Keep changes small, reviewable, and traceable.
- Update documentation when behavior, workflow, architecture, or decisions change.
- After every completed implementation task, update `docs/roadmap.md` and `plan/aidos-turnkey-implementation.md` so project status and next steps stay current.
- Add or update an ADR when a decision changes architecture, technology, persistence, security, deployment, or long-term governance.
- Do not remove project memory unless explicitly instructed by a human maintainer.
- Prefer explicit instructions and templates over hidden conventions.

## Traceability Requirement

Every meaningful change should connect to at least one of:

- product intent;
- roadmap item;
- feature spec;
- task;
- ADR;
- review finding;
- release note.

When traceability is missing, add it before implementation or document why it is not applicable.

## Role Selection

Use the narrowest role that matches the work:

- Planner Agent: turns roadmap or feature intent into executable tasks.
- Developer Agent: implements tasks and updates tests/docs.
- Reviewer Agent: evaluates changes against architecture, ADRs, governance, and verification evidence.

Do not mix roles in a way that bypasses review. A Developer can self-check, but Reviewer rules still apply before work is considered complete.

## Completion Standard

A task is not complete until:

- requested functionality or documentation is implemented;
- relevant tests or validations are run when available;
- architecture and ADR consistency are checked;
- documentation is updated when needed;
- `docs/roadmap.md` and `plan/aidos-turnkey-implementation.md` reflect the completed work and next focus;
- open risks or skipped checks are reported.
