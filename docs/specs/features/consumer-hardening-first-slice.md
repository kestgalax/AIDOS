# Consumer Hardening First Slice

## Metadata

- Feature ID: F-001
- Title: Consumer Hardening First Slice

## Traceability

- Product Intent Link: docs/product-intent.md
- Roadmap Item: Milestone 8: Consumer Hardening (CarrotType lessons)
- Related ADRs: docs/decisions/ADR-002-product-form-and-stack.md, docs/decisions/ADR-004-defer-write-back-persistence-and-deployment.md
- Living consumer: docs/living-consumers.md

## Problem

Real consumer repos (first proof: CarrotType) fail AIDOS CONTROL gates for reasons unrelated to project health: vendor markdown under DerivedData/SPM, and human-written ADR Impact wording that follows accepted ADRs but does not match a narrow regex. In-repo `examples/` also do not show what a living AIDOS product looks like.

## Proposed Behavior

1. `aidos validate` skips build/vendor directory trees when checking markdown links.
2. `aidos review` accepts `Follows accepted ADR…` as a valid ADR Impact outcome.
3. Documentation distinguishes in-repo examples from the external living consumer CarrotType.

## Acceptance Criteria

- Markdown under `.derivedData*` (and related vendor trees) does not cause validate failures.
- A task whose ADR Impact says `Follows Accepted ADR-002…` can receive review outcome Approve when other sections are complete.
- `docs/living-consumers.md` documents CarrotType as private sibling/GitHub living consumer; README and quickstart link to it.

## Verification Plan

- `npm test` covering validate ignore fixture and Follows-accepted review case.
- `npm run validate` on the AIDOS repo.
- Optional: `npm run aidos:validate` in sibling `../carrottype` without DerivedData link noise.

## Documentation Impact

- README / README.ru, quickstart EN/RU, architecture, living-consumers docs.
- Roadmap and turnkey plan updated for Milestone 8 / Фаза 9 first slice.
