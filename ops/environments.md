# Environments

Environment strategy is intentionally deferred until the runtime product form and stack are selected.

## Current State

There are no application environments yet.

The repository currently contains knowledge, governance, architecture, ADRs, and templates. It does not contain runtime code, deployment configuration, databases, or external services.

## Future Environment Model

When runtime implementation begins, define:

- local development environment;
- automated test environment;
- preview or staging environment;
- production environment if applicable;
- secrets and configuration model;
- data persistence model;
- access control rules.

## Environment Rules

- Do not commit secrets.
- Do not rely on undocumented local state.
- Document required setup commands once a stack exists.
- Keep production operations behind explicit human approval.
- Record environment-affecting decisions as ADRs.

## Agent Guidance

If an agent needs an environment that is not documented here, it must stop and request or create the missing decision artifact before proceeding.
