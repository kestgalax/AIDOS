# Consumer Hardening First Slice

## Metadata

- Task ID: T-001
- Title: Consumer Hardening First Slice — validate ignore, ADR Impact, living docs

## Traceability

- Product Intent Link: docs/product-intent.md
- Roadmap Item: Milestone 8: Consumer Hardening (CarrotType lessons)
- Feature Spec: docs/specs/features/consumer-hardening-first-slice.md
- Related ADRs: docs/decisions/ADR-002-product-form-and-stack.md, docs/decisions/ADR-004-defer-write-back-persistence-and-deployment.md

## Scope

1. Add `shouldSkipDirectory` to `src/validate.ts` walk.
2. Expand ADR Impact allowed outcomes in `src/review.ts` (and dashboard copy); update task templates.
3. Document CarrotType as living consumer; sync roadmap/plan.

## Acceptance Criteria

- Validate ignores `.derivedData*` vendor markdown with broken links in fixtures.
- Review accepts `Follows accepted ADR` wording.
- Living consumer docs and README/quickstart references exist.

## Verification

- `npm test`
- `npm run validate`
- Optional sibling CarrotType `aidos:validate` sanity

## Documentation Updates

- `docs/living-consumers.md`, `docs/living-consumers.ru.md`
- README EN/RU, quickstart EN/RU, `docs/architecture.md`
- `docs/roadmap.md`, `plan/aidos-turnkey-implementation.md`

## ADR Impact

No ADR impact.
