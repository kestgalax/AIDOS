# CI Governance For AIDOS Projects

AIDOS projects should run governance checks in local development and in CI with the installed `aidos` command. The product repository does not need to sit next to an AIDOS clone.

## Minimum Pipeline

From the project root:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

These scripts use `scripts/run-aidos.mjs`. It runs `aidos` from `PATH`. `AIDOS_ROOT` is an optional override for developing AIDOS itself.

## Generic Shell Example

```bash
cd my-project
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

CI may clone AIDOS as a tool and point `AIDOS_ROOT` at that checkout. The product repository stays the working directory.

## GitHub Actions Reference

```yaml
name: AIDOS Governance

on: [push, pull_request]

jobs:
  governance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/checkout@v4
        with:
          repository: your-org/AIDOS
          path: AIDOS
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm --prefix AIDOS install
      - run: npm run aidos:validate
        working-directory: my-project
        env:
          AIDOS_ROOT: ${{ github.workspace }}/AIDOS
```

## GitLab CI Reference

```yaml
aidos-governance:
  script:
    - export AIDOS_ROOT=$CI_PROJECT_DIR/../AIDOS
    - npm run aidos:validate
    - npm run aidos:trace
    - npm run aidos:review
```

## Pre-Commit Option

Run the same three commands before opening a pull request.
