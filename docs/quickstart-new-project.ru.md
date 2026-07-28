# Быстрый старт нового проекта

Этот документ показывает, как использовать AIDOS при запуске нового проекта через clone-template workflow.

## Цель

После прохождения сценария новый проект получает:

- product intent;
- roadmap со stack и dev-environment gates;
- заготовку architecture;
- директорию ADR со structure и runtime stack placeholders;
- инструкции для Planner, Developer и Reviewer агентов;
- шаблоны feature, task и review;
- tooling scripts для `validate`, `trace` и `review`;
- проверку через `aidos validate`.

## 1. Клонировать AIDOS и установить зависимости

```bash
git clone <your-aidos-repo-url> AIDOS
cd AIDOS
npm install
```

Во время локальной разработки команды запускаются через npm:

```bash
npm exec aidos -- <command>
```

## 2. Инициализировать новый проект

Рекомендуемая раскладка workspace:

```text
workspace/
  AIDOS/
  my-new-project/
```

Интерактивный onboarding:

```bash
npm exec aidos -- init ../my-new-project --interactive
```

AIDOS спросит mission, vision, principles, non-goals, planned product form и initial stack direction.

Неинтерактивный режим:

```bash
npm exec aidos -- init ../my-new-project
```

Обновление существующего skeleton:

```bash
npm exec aidos -- init ../my-new-project --update --confirm-overwrite
```

## 3. Пройти lifecycle проекта

Прочитайте `docs/onboarding-project-lifecycle.ru.md` в клоне AIDOS.

Ключевые gates:

1. Идея -> product intent
2. Stack ADR gate -> принять `docs/decisions/ADR-002-runtime-stack.md`
3. Dev environment -> описать в `ops/environments.md`
4. Первая feature -> `aidos new flow`

## 4. Проверить созданный проект

```bash
cd ../my-new-project
npm run aidos:validate
```

Ожидаемый результат:

```text
AIDOS validation passed
```

## 5. Создать первый traced feature flow

Из директории нового проекта:

```bash
npm exec --prefix ../AIDOS aidos -- new flow "first user workflow"
```

Команда создаёт связанные feature, task и review с autofill traceability.

Проверка traceability:

```bash
npm run aidos:trace
```

Review gate:

```bash
npm run aidos:review
```

## 6. Опциональный dashboard scaffold

```bash
npm exec --prefix ../AIDOS aidos -- new dashboard ./dashboard
```

Dashboard starter находится в `examples/dashboard-starter/` внутри клона AIDOS.

## 7. CI governance

См. `docs/ci-governance.ru.md` в клоне AIDOS и `ops/ci.md` в новом проекте.

Минимальный pipeline:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

## Пример проекта

`examples/generated-project/` показывает сгенерированный skeleton.

## Живой consumer

Примеры в `examples/` — это scaffolds. **Живой consumer** — внешний продукт, который ведёт разработку через AIDOS.

Первый задокументированный живой consumer — [CarrotType](https://github.com/kestgalax/carrottype) (private / invite-only macOS-приложение для диктовки). Рекомендуемый layout:

```text
workspace/
  AIDOS/
  carrottype/
```

Смотрите intent, ADR, roadmap и `aidos.config.json`. Подробности: `docs/living-consumers.ru.md`.

## Текущие ограничения

- AIDOS используется из клонированного репозитория, а не как опубликованный npm-пакет.
- Application runtime scaffold намеренно не создаётся через `aidos init`.
- Reviewer automation deterministic и проверяет только markdown-артефакты.
