# CI Governance для AIDOS-проектов

AIDOS-проекты запускают governance checks установленной командой `aidos`. Репозиторий продукта не должен лежать рядом с клоном AIDOS.

## Минимальный pipeline

Из корня проекта:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

Скрипты используют `scripts/run-aidos.mjs`. Он вызывает `aidos` из `PATH`. `AIDOS_ROOT` — необязательное переопределение для разработки самого AIDOS.

## Generic shell example

```bash
cd my-project
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

## GitHub Actions reference

См. английскую версию `docs/ci-governance.md`.

## Pre-commit option

Запускайте те же три команды перед pull request.
