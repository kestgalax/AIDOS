# Living Consumers

AIDOS ships **in-repo examples** under `examples/` and learns from **external living consumers** — real products that use AIDOS day to day but are not copied into this repository.

| Kind | Location | Purpose |
|------|----------|---------|
| Generated skeleton | `examples/generated-project/` | Shows output of `aidos init` |
| Dashboard scaffold | `examples/dashboard-starter/` | Optional read-only UI via `aidos new dashboard` |
| Living consumer | External repo (sibling workspace) | Proof that knowledge + ADR + CONTROL work on a real product |

## CarrotType

[CarrotType](https://github.com/kestgalax/carrottype) is a native macOS menu-bar dictation app (hotkey → on-device STT → caret paste). It is the first documented living consumer of AIDOS.

- **Access:** private / invite-only repository and releases.
- **Local layout:** clone next to AIDOS as `../carrottype` (same workspace pattern as the new-project quickstart).
- **What to inspect:** `docs/product-intent.md`, `docs/architecture.md`, `docs/decisions/`, `docs/roadmap.md`, `aidos.config.json`, and `AGENTS.md`.
- **Status at documentation time:** private GitHub Release `v0.1.0` (unsigned DMG).

CarrotType lessons drive AIDOS Milestone 8 (Consumer Hardening): validate ignore for build/vendor trees, clearer ADR Impact wording in `aidos review`, and further CONTROL improvements still on the roadmap.

Do not treat CarrotType as a substitute for `examples/generated-project/`. The skeleton teaches structure; the living consumer teaches how AIDOS behaves after months of real product work.
