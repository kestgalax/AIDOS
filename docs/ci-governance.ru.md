# CI Governance для AIDOS-проектов

AIDOS-проекты должны запускать governance checks локально и в CI через клон репозитория AIDOS.

## Минимальный pipeline

Из корня проекта:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

Скрипты используют `scripts/run-aidos.mjs`, который находит AIDOS через `AIDOS_ROOT` или `aidos.config.json`.

## Раскладка workspace

```text
workspace/
  AIDOS/
  my-project/
```

В проекте:

```json
{
  "toolingRoot": "../AIDOS"
}
```

Или:

```bash
export AIDOS_ROOT=../AIDOS
```

## Generic shell example

```bash
cd my-project
export AIDOS_ROOT=../AIDOS
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

## GitHub Actions reference

См. английскую версию `docs/ci-governance.md`.

## Pre-commit option

Запускайте те же три команды перед pull request.
