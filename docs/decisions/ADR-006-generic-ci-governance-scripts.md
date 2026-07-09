# ADR-006: Generic CI Governance Scripts In Project Starter

## Status

Accepted

## Context

`ADR-004` deferred external integrations, including CI platform coupling. New AIDOS projects still need a predictable way to run `validate`, `trace`, and `review` in local development and automation.

The project starter should make governance checks runnable without publishing AIDOS as an npm package.

## Decision

Allow generic CI governance support in the project starter:

- `package.json` scripts: `aidos:validate`, `aidos:trace`, `aidos:review`;
- `scripts/run-aidos.mjs` resolves the cloned AIDOS tooling root;
- `aidos.config.json` stores the default tooling path;
- `ops/ci.md` in initialized projects documents the minimum pipeline;
- `docs/ci-governance.md` documents platform-neutral and reference CI examples.

This does not require choosing GitHub Actions, GitLab CI, or another vendor in the starter itself.

## Alternatives

### Add Mandatory GitHub Actions Workflow To Starter

Rationale: rejected for now because the user chose generic docs and scripts first.

### Wait For Published AIDOS Package

Rationale: deferred. Clone-template workflow is the current distribution model.

## Consequences

- Initialized projects can run governance checks through sibling AIDOS clone layout.
- CI examples remain reference documentation, not enforced platform choice.
- Future platform-specific templates may be added without changing the core starter contract.
