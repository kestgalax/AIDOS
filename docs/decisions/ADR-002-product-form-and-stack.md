# ADR-002: Product Form And Runtime Stack

## Status

Accepted

## Context

AIDOS is intended to become a working product, not only a documentation structure. The product may be delivered as a CLI, a web application, or a hybrid system.

The repository currently has no package manager, language runtime, framework, test runner, CI configuration, deployment target, or persistence layer. Selecting these prematurely would make the first implementation decision accidental instead of intentional.

## Decision

Use a hybrid product model with a CLI-first implementation sequence.

The first executable product is a local CLI that validates and later generates repository artifacts. A web UI or dashboard may be added after the CLI/core model stabilizes.

Initial stack:

- product form: hybrid, implemented CLI-first;
- primary language and runtime: TypeScript on Node.js;
- package manager: npm;
- test strategy: Node.js built-in test runner with TypeScript executed through `tsx`;
- validation strategy: `aidos validate` and `npm run validate`;
- CI direction: run `npm test`, `npm run typecheck`, and `npm run validate` once CI is introduced;
- distribution model: local npm package first, publishable CLI package later;
- persistence model: markdown files in the repository; no database until the traceability model proves it is needed.

The first executable scope is structural validation of the AIDOS knowledge core.

## Alternatives

### CLI-First

Pros:

- Fastest path to validating repository structure.
- Works well for local development and CI.
- Can generate ADRs, specs, tasks, and reports.
- Keeps the source of truth in files.

Cons:

- Less useful for visual exploration and traceability graphs.
- Requires later UI work if human navigation becomes a priority.

### Web App-First

Pros:

- Better for browsing knowledge, visualizing traceability, and presenting status.
- Friendlier for non-terminal users.

Cons:

- Requires earlier decisions about frontend, backend, deployment, auth, and persistence.
- Higher risk of building UI before the underlying model stabilizes.

### Hybrid

Pros:

- CLI can become the automation core.
- Web UI can later reuse the same model.
- Balances validation and future human experience.

Cons:

- Requires careful boundary design to avoid two products diverging.

## Consequences

- Runtime implementation is now allowed inside the accepted CLI-first scope.
- The first implementation must stay focused on local validation.
- UI, dashboard, CI, external integrations, and persistence remain future decisions.
- Repository markdown artifacts remain the source of truth.
- npm and TypeScript become part of the project baseline.
