# ADR-007: Behavior Specs, Archive, And Self-Contained Projects

## Status

Accepted

## Context

AIDOS records features, tasks, and reviews, but it has no canonical description of how the system behaves now. A finished feature stays a work record. Agents then rediscover current behavior from scattered specs.

OpenSpec showed a useful loop: a living behavior spec, a delta for one change, and an archive step that merges the delta back. AIDOS keeps its own gates. It does not adopt phase-free workflows, design notes as a substitute for ADRs, or agent judgment as the quality gate.

`ADR-006` let a new project run governance by pointing `toolingRoot` at a sibling AIDOS clone. That layout is a local development convenience. A project that is already underway must stand on its own files. The AIDOS install is the starter. Later contact with that install is an explicit update.

## Decision

Add a behavior layer and keep consumer projects self-contained.

- Current observable behavior lives in `docs/specs/domains/<domain>/spec.md`. The spec states purpose, requirements, and scenarios. Stack choices, class names, and implementation plans stay in architecture, ADRs, and tasks.
- A feature carries `## Behavior Delta`: a domain spec path plus `ADDED`, `MODIFIED`, and `REMOVED` requirements. `No behavior change` is valid when the feature does not change observable behavior.
- `aidos archive <feature-slug>` merges that delta into the domain spec. It writes only when the linked review has `Schema: 2`, `Outcome: Approve`, and concrete evidence. This is a CLI markdown edit in the same class as `aidos new`. It is not dashboard write-back deferred by `ADR-004`.
- A spike is research. It does not authorize implementation. Implementation starts from a feature and a task.
- Review Outcome and Evidence are blocking only for review artifacts marked `Schema: 2`. Older reviews stay advisory.
- `aidos validate` requires the domain and spike templates only when `aidos.config.json` has `"schema": 2`.
- After `aidos init`, the project does not store a path to an AIDOS clone. Commands run through the installed `aidos` on `PATH`, with the project directory as the working directory. `AIDOS_ROOT` remains an optional override for AIDOS development.
- `aidos init --update --confirm-overwrite` refreshes governance files and spec templates, creates missing starter files, and leaves product memory in place. It does not rewrite existing product intent, architecture, roadmap, ADRs, or filled specs.

This decision amends the consumer tooling path in `ADR-006` for newly initialized projects. It does not require an existing project to run update.

## Alternatives

### Keep Features As The Only Behavior Record

Rationale: rejected because finished features do not state current behavior, and later work cannot show a precise delta.

### Require Every Existing Project To Adopt Schema 2 Immediately

Rationale: rejected because a CLI upgrade would fail reviews and validation in projects that have not asked for the new workflow.

### Keep Sibling `toolingRoot` As The Product Contract

Rationale: rejected because a working project must not depend on a neighboring AIDOS checkout.

## Consequences

- New flows include a behavior delta and a schema 2 review.
- `aidos archive` is the step that promotes accepted behavior into the domain spec.
- Existing features and reviews without the new sections continue to validate and review.
- An existing project receives the new templates only when someone runs update.
- CI installs or clones AIDOS as a tool and runs it inside the product repository.
