# Constraints

These constraints apply to the repository until superseded by an accepted ADR.

## Product Constraints

- AIDOS exists to improve AI-assisted development consistency, not to maximize automation for its own sake.
- The repository artifacts are the source of truth.
- The future application or CLI must support the knowledge model instead of replacing it.

## Technical Constraints

- Runtime stack is TypeScript on Node.js, accepted by `docs/decisions/ADR-002-product-form-and-stack.md`.
- Package manager is npm.
- No CI/CD platform is selected yet.
- No deployment target is selected yet.
- No persistence model is selected yet.

CI/CD, deployment, persistence, and UI still require ADR coverage before implementation.

## Operating Trade-Offs

```text
Correctness > Delivery Speed
Maintainability > Performance
Explicitness > Convenience
Traceability > Minimal Process
Human Control > Full Autonomy
```

## Agent Constraints

- Agents must read the required context before changing files.
- Agents must not invent durable decisions silently.
- Agents must report verification status.
- Agents must not treat missing tests or missing docs as acceptable without explanation.
- Agents must preserve project memory.

## Scope Constraints

The current implementation phase allows CLI-first validation code under the accepted ADR. It does not add UI, persistence, external integrations, or deployment.
