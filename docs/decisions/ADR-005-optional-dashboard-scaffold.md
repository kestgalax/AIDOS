# ADR-005: Optional Dashboard Scaffold Placement

## Status

Accepted

## Context

AIDOS previously shipped a dashboard inside `apps/dashboard` as part of the core repository. That suggested the dashboard is required to use AIDOS, even though the product model is CLI-first and markdown source of truth.

New projects need an optional way to visualize governance artifacts without coupling every consumer project to the AIDOS monorepo layout.

## Decision

Treat the dashboard as an optional consumer scaffold, not a core AIDOS surface.

- Move the reference dashboard to `examples/dashboard-starter/`.
- Add `aidos new dashboard [target]` to copy the starter into a consumer project.
- Dashboard reads project artifacts through `AIDOS_PROJECT_ROOT`.
- Dashboard remains read-only and does not mutate repository files.

The AIDOS core repository keeps CLI, templates, and documentation as the primary product surface.

## Alternatives

### Keep Dashboard In apps/dashboard

Rationale: rejected because it implies the dashboard is part of the required AIDOS product boundary.

### Remove Dashboard Entirely

Rationale: rejected because a reference UI still helps humans navigate traceability and review findings.

## Consequences

- `ADR-003` read-only boundary still applies to any dashboard scaffold.
- Core AIDOS development no longer requires building `apps/dashboard` by default.
- Consumer projects may add a dashboard when visualization becomes useful.
- Future dashboard enhancements should land in `examples/dashboard-starter` unless a new ADR expands scope.
