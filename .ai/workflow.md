# Workflow

This workflow defines how work moves through AIDOS.

## Lifecycle

```text
Product Intent
      ↓
Roadmap
      ↓
Feature
      ↓
Planning
      ↓
Tasks
      ↓
Implementation
      ↓
Review
      ↓
Merge
      ↓
Release
      ↓
Roadmap Update
```

## Required Flow

1. Start from product intent or roadmap.
2. Create or update a feature spec.
3. Identify relevant architecture and ADRs.
4. Decompose into executable tasks.
5. Implement one task at a time.
6. Verify behavior and documentation.
7. Review against governance.
8. Merge only after review criteria are satisfied.
9. Update `docs/roadmap.md` and `plan/aidos-turnkey-implementation.md` after every completed implementation task.
10. Update memory or ADRs when the change affects future work or durable decisions.

## Decision Gates

Create or update an ADR before:

- selecting a runtime stack;
- changing repository structure;
- adding persistence;
- adding deployment or CI strategy;
- changing agent governance;
- introducing security-sensitive behavior;
- changing architecture boundaries.

## Traceability Chain

Every major change should preserve this chain when applicable:

```text
Context
    ↓
Mission
    ↓
Roadmap
    ↓
Feature
    ↓
Task
    ↓
Commit
    ↓
Pull Request
    ↓
Release
```

If a link is absent, the task or review should explain why.
