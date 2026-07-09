# Memory

AIDOS memory is the set of durable artifacts that explain why the project is shaped the way it is.

## Memory Sources

- Product intent: `docs/product-intent.md`
- Roadmap: `docs/roadmap.md`
- Architecture: `docs/architecture.md`
- Decisions: `docs/decisions/`
- Governance: `.ai/constitution.md`
- Workflow: `.ai/workflow.md`
- Specs and tasks: `docs/specs/`
- Operational knowledge: `ops/`

## Update Rules

Update memory when:

- product direction changes;
- architecture changes;
- a new durable decision is made;
- repeated work reveals a missing template or rule;
- review findings expose a systemic issue;
- operational procedures become known.

## ADR Memory

ADRs are append-only decision memory. Do not rewrite accepted ADRs to hide history. If a decision changes, create a new ADR that supersedes the old one.

## Agent Session Memory

Agent session notes are temporary unless converted into repository artifacts. Important lessons from a session should be captured in specs, ADRs, governance docs, or ops notes.

## Memory Quality Bar

Good memory is:

- specific;
- traceable;
- useful for future decisions;
- concise enough to be read before work starts;
- explicit about consequences and trade-offs.
