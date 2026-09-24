# CI Governance

This project runs AIDOS governance with the installed `aidos` command. The project files are the source of truth.

## Prerequisites

- `aidos` is on `PATH`, or `AIDOS_ROOT` points at an AIDOS checkout used only as a tool.
- Node.js is available in the CI environment.

## Minimum Pipeline

1. `npm run aidos:validate`
2. `npm run aidos:trace`
3. `npm run aidos:review`

## Local Pre-Commit Option

Run the same commands before opening a pull request.

## Platform Examples

See `docs/ci-governance.md` in the AIDOS tooling repository for GitHub Actions, GitLab CI, and generic shell examples.
