# Product Form Decision Guide

This guide records the product-form analysis that led to `docs/decisions/ADR-002-product-form-and-stack.md`.

`ADR-002` is now accepted. The selected direction is hybrid with a CLI-first implementation sequence using TypeScript on Node.js and npm.

## Decision To Make

The decision evaluated the first runtime product form:

- CLI-first
- Web app-first
- Hybrid

The accepted decision selects the initial language, runtime, package manager, test strategy, validation strategy, and distribution direction. CI and deployment remain future decisions.

## Evaluation Criteria

Use these criteria:

- Fastest path to validating AIDOS artifacts.
- Ability to run in local development.
- Suitability for CI.
- Ease of preserving repository files as source of truth.
- Support for future traceability graph.
- Human usability.
- Implementation complexity.
- Risk of premature architecture commitment.

## Option 1: CLI-First

Best when the next goal is executable validation and artifact generation.

Strengths:

- simple local and CI execution;
- strong fit for repository validation;
- low UI complexity;
- deterministic commands;
- easy to keep files as source of truth.

Risks:

- weaker visual navigation;
- later UI may require new boundaries.

Recommended when Milestone 2 is the immediate priority.

## Option 2: Web App-First

Best when the next goal is human navigation, dashboards, and visual traceability.

Strengths:

- strong browsing experience;
- good for visual graphs;
- easier for non-terminal users.

Risks:

- early frontend/backend/deployment choices;
- higher implementation complexity;
- risk of UI outrunning the knowledge model.

Recommended only if a human-facing dashboard is the immediate MVP.

## Option 3: Hybrid

Best when the CLI validates and manipulates artifacts while a later UI visualizes them.

Strengths:

- CLI can become the automation core;
- web UI can reuse the same domain model later;
- balances agent automation and human experience.

Risks:

- requires clear boundaries between core model, CLI, and UI;
- more architecture design before coding.

Recommended if the project expects both automation and a visual interface.

## Default Recommendation

The accepted recommendation is hybrid with a CLI-first implementation sequence:

1. Build a CLI validation core.
2. Add artifact generation.
3. Add traceability graph data model.
4. Add web UI only after the model stabilizes.

This keeps the first executable product small while preserving the path to a richer interface.

## ADR Acceptance Checklist

`ADR-002` covers:

- selected product form;
- rejected alternatives;
- language and runtime;
- package manager;
- test runner;
- validation command;
- CI direction;
- distribution or deployment model;
- consequences for repository structure.
