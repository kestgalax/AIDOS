# ADR-001: AIDOS Repository Structure

## Status

Accepted

## Context

AIDOS starts from an empty repository. The project needs a structure that gives AI agents durable context before application code exists.

The structure must represent:

- product intent;
- architecture;
- decision history;
- agent execution rules;
- governance;
- future operational knowledge.

Without this structure, agents would have to infer project intent from scattered files or conversation history, which would recreate the drift AIDOS is meant to prevent.

## Decision

Use a documentation-first repository structure:

```text
.ai/
docs/
  decisions/
  specs/
ops/
AGENTS.md
README.md
```

Responsibilities:

- `.ai/` stores operating instructions for agents and governance.
- `docs/product-intent.md` stores product direction.
- `docs/architecture.md` stores system architecture.
- `docs/decisions/` stores ADRs.
- `docs/specs/` stores feature, task, and review templates.
- `ops/` stores operational knowledge.
- `AGENTS.md` is the required agent entry point.
- `README.md` is the human entry point.

## Alternatives

### Single README

Rejected because it would mix product intent, architecture, decisions, and execution rules into one file that would become too large and ambiguous.

### Application Scaffold First

Rejected for the bootstrap phase because choosing a stack before capturing intent and decisions would create architectural drift immediately.

### External Knowledge Base

Rejected because project memory must live with the repository and be reviewable with code changes.

## Consequences

- Agents have a deterministic reading order.
- Governance can exist before runtime code.
- Future tooling can validate and generate artifacts from stable paths.
- The repository initially contains more documentation than code by design.
- Any future restructure requires a new ADR.
