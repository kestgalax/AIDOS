# Roadmap

This roadmap moves AIDOS from a knowledge-first repository to a runtime product that helps humans and AI agents plan, execute, and review software work.

## Current Status

Completed for the first CLI/core increment:

- Knowledge and governance core.
- Product-form decision through `ADR-002`.
- TypeScript on Node.js CLI scaffold with npm.
- Structural validation through `aidos validate`.
- Artifact generators through `aidos new adr|feature|task|review`.
- Project skeleton initialization through `aidos init [target]`.
- Interactive onboarding through `aidos init [target] --interactive`.
- Existing skeleton update mode through `aidos init [target] --update --confirm-overwrite`.
- Project starter template in `templates/project-starter/` with `package.json`, `aidos.config.json`, and `scripts/run-aidos.mjs`.
- Lifecycle onboarding in `docs/onboarding-project-lifecycle.md` and `.ru.md`.
- Traceability autofill and `aidos new flow`.
- Generic CI governance in `docs/ci-governance.md`, `ADR-006`, and `ops/ci.md` in the starter.
- Optional dashboard scaffold in `examples/dashboard-starter/` through `aidos new dashboard` and `ADR-005`.
- New-project quickstart in `docs/quickstart-new-project.md` and `docs/quickstart-new-project.ru.md`.
- Generated example project in `examples/generated-project/`.
- Traceability reporting through `aidos trace`.
- Deterministic reviewer gate through `aidos review`.
- Shared CLI/core report model through `src/report-model.ts`.
- Governance rule requiring `docs/roadmap.md` and `plan/aidos-turnkey-implementation.md` updates after every completed implementation task.

Current focus:

- Strengthen file-based workflows, CLI/core quality, and read-only dashboard clarity within the boundaries set by `ADR-004`.
- Keep markdown repository artifacts as the source of truth.
- Keep this roadmap and the turnkey implementation plan current after each task.

Immediate remaining queue:

- None for the current MVP increment. New work requires a roadmap item, feature spec, or superseding ADR.

## Milestone 0: Knowledge Core

Status: Complete.

Goal: create the minimum self-describing repository structure.

Deliverables:

- Product intent document.
- Architecture document.
- Governance constitution.
- Agent role instructions.
- ADR directory and initial ADRs.
- Feature, task, and review templates.
- Operational placeholders for future deployment decisions.

Exit criteria:

- Every layer from `WHY` to `CONTROL` has a corresponding artifact.
- `AGENTS.md` gives agents a deterministic entry point.
- Runtime stack selection was deferred until `ADR-002`, then accepted before runtime code was added.

## Milestone 1: Decision Gate For Product Form

Status: Complete.

Goal: decide whether the first runtime product is CLI-first, web app-first, or hybrid.

Options:

- CLI-first: fastest path to validation, generation, and automation.
- Web app-first: strongest path for visual traceability and human navigation.
- Hybrid: CLI as executable core, web UI after model stabilization.

Exit criteria:

- `ADR-002-product-form-and-stack.md` is accepted or superseded.
- Package manager, language, runtime, test strategy, and CI direction are selected.
- The first executable scope is defined.

Current result:

- Product form: hybrid with CLI-first implementation sequence.
- Runtime: TypeScript on Node.js.
- Package manager: npm.
- First executable scope: local structural validation through `aidos validate`.

## Milestone 2: Structural Validation

Status: Complete for the first CLI/core increment.

Goal: build the first automation that checks repository health.

Candidate capabilities:

- Verify required files exist.
- Validate ADR file naming and required sections.
- Validate spec templates contain traceability fields.
- Check links between core documents.
- Produce a human-readable governance report.

Exit criteria:

- A single command can validate the AIDOS knowledge core.
- Validation failure messages are actionable.
- The command is suitable for local use and CI.

Current result:

- `npm run validate` runs `aidos validate`.
- Validation checks required files, ADR sections, spec traceability markers, markdown links, and ADR-backed runtime scaffold.
- Automated tests cover passing skeletons, missing files, incomplete ADRs, and broken markdown links.

## Milestone 3: Artifact Generation

Status: Complete for the first CLI/core increment.

Goal: reduce manual work while preserving explicit human control.

Candidate capabilities:

- Generate ADR skeletons.
- Generate feature specs from templates.
- Generate task files from feature specs.
- Generate review checklists from governance rules.

Exit criteria:

- Generated artifacts are deterministic.
- Every generated artifact still requires human or reviewer approval.
- Templates remain the source of truth.

Current focus:

- `aidos new adr` creates numbered ADR skeletons.
- `aidos new feature` creates feature specs.
- `aidos new task` creates task specs.
- `aidos new review` creates review checklists.
- Generated documents are reviewable markdown artifacts.

## Milestone 4: Project Initialization

Status: Complete for the first interactive CLI/core increment.

Goal: let users start a new project with a valid AIDOS skeleton.

Candidate capabilities:

- Create `.ai/`, `docs/`, `docs/decisions/`, `docs/specs/`, and `ops/`.
- Create `AGENTS.md` and `README.md`.
- Create the first ADR.
- Refuse to overwrite existing files by default.
- Validate the generated skeleton.

Exit criteria:

- `aidos init [target]` creates a valid AIDOS skeleton.
- Generated projects pass `aidos validate`.
- Existing files are protected by default.

Current result:

- `aidos init ./my-new-project` creates the first non-interactive skeleton.
- Automated tests cover skeleton validity and overwrite protection.
- `aidos init ./my-new-project --interactive` asks onboarding questions and uses answers to personalize product intent and the first ADR.
- Automated tests cover onboarding answer handling.
- `aidos init ./my-new-project --update --confirm-overwrite` refreshes existing AIDOS-managed skeleton files only with explicit overwrite confirmation.
- Automated tests cover update refusal without confirmation and confirmed updates.
- New-project quickstart documentation is available in English and Russian.
- `examples/generated-project/` shows a generated project and is covered by validation tests.

Next focus:

- Keep non-interactive initialization available for automation.
- Continue dashboard work through Milestone 7 while preserving `aidos init` as the onboarding entry point.

## Milestone 5: Traceability Graph

Status: Complete for the first CLI/core increment.

Goal: make it possible to answer why a task, decision, or code change exists.

Candidate capabilities:

- Represent relationships between intent, roadmap, features, tasks, ADRs, commits, PRs, and releases.
- Detect missing traceability links.
- Render a textual or visual graph.

Exit criteria:

- A feature can be traced to product intent and ADRs.
- Missing links are reported before review.
- The model can support a future UI.

Current result:

- `aidos trace` reports feature, task, review, and ADR counts.
- `aidos trace` reports missing traceability fields in feature, task, and review artifacts.
- Automated tests cover linked and missing traceability fields.

## Milestone 6: Reviewer Automation

Status: Complete for the first CLI/core increment.

Goal: give Reviewer Agent a consistent quality gate.

Candidate capabilities:

- Review changes against architecture, ADRs, templates, and Definition of Done.
- Flag missing tests, missing docs, or missing ADR updates.
- Classify findings as approve, request changes, or block.

Exit criteria:

- Review output follows `docs/specs/review-template.md`.
- Blocking issues are clearly separated from advisory suggestions.
- The review process can run locally before pull request creation.

Current result:

- `aidos review` produces a deterministic local review report.
- The report classifies outcomes as `Approve`, `Request Changes`, or `Block`.
- The first checks cover concrete acceptance criteria, verification evidence, documentation entries, and ADR impact in feature/task artifacts.
- Automated tests cover blocking and approving review outcomes.

## Milestone 7: Product Interface

Status: Read-only shell and detail routes implemented.

Goal: expose AIDOS through the product form selected by ADR.

Candidate capabilities:

- CLI commands.
- Web UI.
- Local dashboard.
- Integration with Cursor, GitHub, or CI.

Exit criteria:

- The interface helps humans and agents navigate intent, decisions, tasks, and reviews.
- It does not replace the repository artifacts as the source of truth.

Current decision:

- `ADR-003` accepts a read-only dashboard boundary.
- `ADR-005` places the reference dashboard in `examples/dashboard-starter/`.
- The dashboard stack is Next.js App Router, React, TypeScript, shadcn/ui, and Tailwind CSS.
- Dashboard data must remain a projection of markdown repository artifacts.

Current result:

- `examples/dashboard-starter` contains a Next.js App Router dashboard with overview and detail routes.
- `aidos new dashboard` copies the starter into consumer projects.
- The dashboard reads project artifacts through `AIDOS_PROJECT_ROOT`.
- `npm run dashboard:build` builds the reference dashboard starter.

Next focus:

- Apply clone-template bootstrap to new projects.
- Add new capabilities only through roadmap items, feature specs, or superseding ADRs.
