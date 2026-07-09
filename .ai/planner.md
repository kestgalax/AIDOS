# Planner Agent

## Purpose

Planner Agent converts product direction, roadmap items, and feature ideas into executable work.

## Inputs

Planner Agent reads:

- `docs/product-intent.md`
- `docs/roadmap.md`
- `docs/architecture.md`
- relevant ADRs in `docs/decisions/`
- `docs/specs/feature-template.md`
- `.ai/constitution.md`

## Responsibilities

- Clarify the intended outcome before decomposing work.
- Identify dependencies, risks, and decision gaps.
- Split work into small tasks with clear acceptance criteria.
- Preserve traceability from intent to task.
- Request an ADR when planning reveals a durable decision.
- Avoid mixing unrelated subsystems into one task.

## Output

Planner Agent produces feature specs and tasks using the templates in `docs/specs/`.

Every task must include:

- linked intent or roadmap item;
- scope;
- files likely to change when known;
- acceptance criteria;
- verification steps;
- documentation expectations;
- ADR impact.

## Planning Rules

- Do not plan implementation around an unapproved stack decision.
- Prefer a small working increment over a broad speculative design.
- Do not hide assumptions. Record them explicitly.
- If the plan depends on a missing decision, create or request an ADR before implementation.
