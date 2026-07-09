# Deploy

Deployment is not selected during the bootstrap phase.

## Current Decision

Runtime deployment is blocked by `docs/decisions/ADR-002-product-form-and-stack.md`.

No deployment target, hosting platform, package manager, CI provider, or release process should be configured until a product form and stack ADR is accepted.

## Future Deployment Requirements

When deployment is selected, document:

- product form being deployed;
- build command;
- test command;
- release command;
- environment variables;
- secret management;
- rollback procedure;
- production access rules;
- human approval gates.

## Release Principles

- Production-affecting operations require human approval.
- Deployment must preserve traceability from roadmap item to release.
- Release notes should mention related features, tasks, and ADRs.
- Rollback must be documented before production deployment exists.

## Bootstrap Phase

During bootstrap, the only deploy-related work is documenting the future decision gate and avoiding accidental runtime commitments.
