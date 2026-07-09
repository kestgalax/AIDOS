# AIDOS Constitution

The constitution defines mandatory rules for all contributors and agents.

## Authority Order

When instructions conflict, resolve them in this order:

1. Human maintainer instructions.
2. Product intent in `docs/product-intent.md`.
3. Accepted ADRs in `docs/decisions/`.
4. Architecture in `docs/architecture.md`.
5. Agent role instructions in `.ai/`.
6. Local implementation preferences.

## Definition Of Done

Any task is complete only when all applicable conditions are true:

- The requested outcome is implemented.
- Verification has been run or a reason is recorded for why it could not be run.
- Documentation is updated when the change affects usage, architecture, workflow, or decisions.
- `docs/roadmap.md` and `plan/aidos-turnkey-implementation.md` are updated after every completed implementation task.
- ADRs are added or updated for durable architectural or technology decisions.
- The change follows the active product intent and trade-offs.
- Reviewer-facing evidence is available.

## Quality Rules

- Prefer simple, explicit, maintainable solutions.
- Keep artifacts focused on one responsibility.
- Avoid abstractions that do not reduce real complexity.
- Do not optimize for automation speed at the cost of traceability.
- Treat unclear requirements as planning issues, not implementation details.

## Documentation Rules

- Documentation is part of the product.
- Every long-lived decision needs durable context.
- Roadmap and implementation plan status must stay current after each completed task.
- Templates should be updated when repeated work reveals a better structure.
- Do not leave placeholders such as `TBD`, `TODO`, or `later` in accepted project governance documents.

## Security Rules

- Humans retain control over secrets, credentials, production access, destructive operations, and external account changes.
- Do not commit secrets or environment-specific credentials.
- Prefer secure defaults over convenience.
- Any security-sensitive architectural decision requires an ADR.

## Review Rules

Reviewer Agent must classify outcomes as:

- Approve: no blocking issues remain.
- Request Changes: fixable issues exist.
- Block: change violates product intent, architecture, security, or governance.

Reviews must prioritize correctness, maintainability, traceability, and security before style preferences.

## Change Management Rules

- Changing product intent requires explicit human approval.
- Changing architecture requires an ADR.
- Changing an ADR requires a new ADR that supersedes or amends it.
- Changing agent workflow requires updating `.ai/workflow.md` and any affected role files.
