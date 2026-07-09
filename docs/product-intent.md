# Product Intent

## Context

Modern software projects increasingly rely on AI agents for implementation, testing, pull requests, infrastructure work, and integration with external systems.

The main failure mode is no longer that an agent cannot generate code. The failure mode is that the agent does not understand the project deeply enough:

- why the project exists;
- what trade-offs are acceptable;
- which architectural decisions are already settled;
- how previous work shaped the current system;
- what quality bar every change must satisfy.

Without a durable operating context, projects drift. Architecture becomes inconsistent, decisions are repeated or contradicted, and knowledge disappears between sessions.

## Mission

Make AI-assisted software development reproducible, traceable, and governed by durable project knowledge.

## Vision

Any qualified human or AI agent can enter the repository, understand the product direction, follow the architecture, explain why code exists, and deliver a reviewed change without rediscovering project context from scratch.

## Intent

AIDOS must reduce ambiguity for development agents.

Every project artifact should help answer one of these questions:

- Why does this project exist?
- What outcome are we pursuing?
- How is the system structured?
- Why did we choose this path?
- How should work be executed?
- How is quality controlled?

If an artifact does not improve decision quality, traceability, or execution reliability, it should not be added.

## Principles

### Product Intent First

Product direction constrains architecture and implementation. Code should not be written before the reason for the change is clear.

### Explicit Over Magic

Agent instructions, workflows, constraints, and decision records must be readable and explicit. Hidden conventions are treated as missing documentation.

### Human Control

AI agents can propose, implement, and review. Humans retain control over product direction, critical trade-offs, security-sensitive decisions, and irreversible operations.

### Traceability By Default

Every meaningful change should trace back to product intent, roadmap, feature, task, ADR, commit, pull request, or release note.

### Incremental Evolution

AIDOS should evolve in small, reviewable increments. Large rewrites require explicit architectural justification.

### Knowledge Is A Product Asset

Documentation, ADRs, templates, and review rules are not secondary to code. They are part of the system.

### Runtime After Model

The application or CLI should be built only after the knowledge model, governance rules, and decision process are clear.

## Non-Goals

- AIDOS does not replace human product ownership.
- AIDOS does not make business decisions autonomously.
- AIDOS does not hide architectural trade-offs behind generated code.
- AIDOS does not require a specific runtime stack before an ADR selects it.
- AIDOS does not optimize for speed at the cost of long-term coherence.

## Trade-Offs

```text
Correctness > Delivery Speed
Maintainability > Performance
Explicitness > Convenience
Traceability > Minimal Process
Human Control > Full Autonomy
Architecture Consistency > Local Optimization
```

## Success Criteria

- A new agent can identify the required reading order in less than 2 minutes.
- A new feature can be traced from intent to task and review criteria.
- Any major technical decision is captured as an ADR.
- The repository can explain why its structure exists.
- Runtime stack selection happens through a documented decision, not accident.
- The first working automation validates documentation structure before application code is built.
