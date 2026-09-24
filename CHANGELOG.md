# Changelog

## Unreleased

Behavior loop from `ADR-007`: domain specs, behavior deltas, archive, spikes, and a self-contained project. Existing projects are not updated unless someone runs `aidos init --update --confirm-overwrite`.

| Before | After |
| --- | --- |
| A feature was only a work record. Current behavior had no canonical spec. | `docs/specs/domains/<domain>/spec.md` is the current observable behavior. A feature carries `## Behavior Delta` (`ADDED` / `MODIFIED` / `REMOVED`, or `No behavior change`). |
| Review ignored files in `docs/specs/reviews/`. An empty Outcome could pass. | Schema 2 reviews block without Outcome and concrete Evidence. Older reviews stay advisory. |
| Nothing promoted an accepted change into current behavior. | `aidos archive <feature-slug>` merges an approved delta and sets the feature Status to `Archived`. |
| Research lived outside the artifact set, or was mixed into a feature. | `aidos new spike` records research. A spike does not authorize implementation. |
| A new project stored `toolingRoot: "../AIDOS"` and ran a sibling clone. | The project is self-contained. Commands use installed `aidos` on `PATH`. `AIDOS_ROOT` is only an override for AIDOS development. |
| `aidos init --update` rewrote the whole starter, including product intent, architecture, roadmap, and the first ADRs. | Update refreshes `.ai/`, spec templates, and `scripts/run-aidos.mjs`. It adds missing starter files. Product memory stays in place. |

### Added

- `ADR-007` for behavior specs, archive, and self-contained projects.
- `aidos new domain`, `aidos new spike`, and `aidos archive`.
- Domain and spike templates. Feature templates include Behavior Delta. Review templates include `Schema: 2`.
- Schema 2 validation requires those templates. Projects without `"schema": 2` keep the previous required-file set.

### Changed

- Workflow order is review, then archive, then merge.
- Planner may write a spike before a feature. Developer does not implement from a spike.

## 2026-09-22

- Consumer hardening slice: `aidos validate` ignores vendor and build trees. `aidos review` accepts `Follows accepted ADR…`. CarrotType is documented as a living consumer.
