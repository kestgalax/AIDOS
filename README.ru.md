# AI Development Operating System

> [English version](README.md)

AIDOS — самоописываемая среда разработки для проектов с участием AI.

Проект рассматривает репозиторий не только как исходный код, а как операционную систему для продуктового намерения, архитектурной памяти, выполнения задач и контроля качества. Его цель — помогать людям и AI-агентам принимать согласованные решения со временем.

## Зачем это нужно

AI-агенты умеют писать код, запускать тесты, открывать pull request и работать с внешними системами. Им всё равно нужен устойчивый контекст проекта: продуктовое намерение, архитектурные ограничения, ранее принятые решения и правила управления.

AIDOS предоставляет этот контекст как полноценные артефакты репозитория.

## Модель работы

```text
WHY
 ↓
WHAT
 ↓
HOW
 ↓
DECISIONS
 ↓
EXECUTION
 ↓
CONTROL
```

Каждый следующий слой уточняет предыдущий:

- Product intent определяет, зачем существует проект.
- Architecture определяет, как устроена система.
- ADR объясняют, почему приняты важные решения.
- Execution rules определяют, как агенты планируют, реализуют и проверяют работу.
- Governance rules определяют, что обязательно для каждого изменения.

## Карта репозитория

- `AGENTS.md` — точка входа для AI-агентов.
- `.ai/constitution.md` — обязательные правила управления проектом.
- `.ai/planner.md` — роль Planner Agent.
- `.ai/developer.md` — роль Developer Agent.
- `.ai/reviewer.md` — роль Reviewer Agent.
- `.ai/workflow.md` — жизненный цикл поставки.
- `.ai/constraints.md` — глобальные ограничения и компромиссы.
- `.ai/memory.md` — правила сохранения памяти проекта.
- `docs/product-intent.md` — контекст, миссия, видение, намерение, принципы, non-goals, trade-offs, критерии успеха.
- `docs/roadmap.md` — поэтапный roadmap от knowledge system к runtime-продукту.
- `docs/architecture.md` — архитектура самой AIDOS.
- `docs/product-form-decision.md` — руководство по следующему решению: CLI, web app или hybrid.
- `docs/quickstart-new-project.ru.md` — быстрый старт применения AIDOS в новом проекте.
- `docs/onboarding-project-lifecycle.ru.md` — поэтапный onboarding от идеи до первой feature.
- `docs/ci-governance.ru.md` — generic CI guidance для governance checks.
- `templates/project-starter/` — file-based skeleton для `aidos init`.
- `docs/decisions/` — Architecture Decision Records.
- `docs/specs/` — шаблоны feature, task и review.
- `ops/` — операционные заметки и будущая модель деплоя.
- `plan/aidos-turnkey-implementation.md` — практический план реализации AIDOS как продукта "под ключ".
- `examples/generated-project/` — пример проекта, созданный через `aidos init`.
- `examples/dashboard-starter/` — опциональный read-only dashboard scaffold для consumer projects.
- Живой consumer: [CarrotType](https://github.com/kestgalax/carrottype) (private / invite-only) — реальный macOS-продукт на AIDOS; клон как sibling `../carrottype`. См. `docs/living-consumers.ru.md`.

## С чего начать

Людям стоит прочитать:

1. `docs/product-intent.md`
2. `docs/roadmap.md`
3. `docs/architecture.md`
4. `docs/decisions/`

AI-агентам следует начать с `AGENTS.md` и следовать обязательному порядку чтения перед внесением изменений.

## Быстрый старт нового проекта

Чтобы применить AIDOS к новому проекту, используйте `docs/quickstart-new-project.ru.md`.

Чтобы посмотреть созданный пример, откройте `examples/generated-project/`.

Для живого consumer (private) см. `docs/living-consumers.ru.md` и sibling `../carrottype`, если есть доступ.

## Локальный CLI

Первая исполнимая возможность AIDOS — локальная проверка структуры:

```bash
npm install
npm run validate
```

Команда проверки анализирует обязательные AIDOS-файлы, структуру ADR, traceability-маркеры в spec-шаблонах, markdown-ссылки и наличие принятого ADR для runtime scaffold.

Также доступны первые генераторы артефактов:

```bash
npm exec aidos new adr "runtime packaging"
npm exec aidos new feature "first project setup"
npm exec aidos new task "validate docs"
npm exec aidos new review "validate docs"
npm exec aidos new flow "first user workflow"
```

`aidos new flow` создаёт связанные feature, task и review с autofill traceability.

Опциональный dashboard scaffold:

```bash
npm exec aidos new dashboard ./dashboard
```

Эти команды создают markdown-артефакты для review в `docs/decisions/` и `docs/specs/`.

Чтобы инициализировать AIDOS в новом проекте:

```bash
npm exec aidos init ./my-new-project
npm exec aidos init ./my-new-project --interactive
```

`init` flow создаёт валидный AIDOS skeleton и по умолчанию не перезаписывает существующие файлы. Интерактивный режим задаёт вопросы про mission, vision, principles, non-goals, product form и stack direction, затем использует ответы в `docs/product-intent.md` и первом ADR.

Чтобы обновить существующий AIDOS skeleton, используйте update mode с явным подтверждением перезаписи:

```bash
npm exec aidos init ./my-existing-project --update --confirm-overwrite
```

Update mode перезаписывает AIDOS-managed skeleton файлы только при наличии `--confirm-overwrite`.

Чтобы проверить состояние traceability:

```bash
npm exec aidos trace
```

Trace report считает feature, task, review и ADR артефакты и показывает незаполненные traceability-поля.

Чтобы запустить первый deterministic reviewer gate:

```bash
npm exec aidos review
```

Review report проверяет feature и task артефакты на конкретные acceptance criteria, verification evidence, documentation entries и ADR impact. Результат классифицируется как `Approve`, `Request Changes` или `Block`.

Чтобы собрать optional dashboard starter:

```bash
npm --prefix examples/dashboard-starter install
npm run dashboard:build
npm run dashboard:dev
```

Dashboard starter — опциональная read-only projection markdown-артефактов. Добавляется в consumer project через `aidos new dashboard`. Использует `AIDOS_PROJECT_ROOT`. `ADR-005` выводит dashboard из core surface AIDOS.

## Текущий статус

Документационное и governance-ядро уже создано. `ADR-002` принимает hybrid-модель продукта с CLI-first последовательностью реализации на TypeScript, Node.js и npm.

Текущая исполнимая область включает clone-template bootstrap через `templates/project-starter/`, `aidos init`, lifecycle onboarding docs, traceability autofill и `aidos new flow`, generic CI governance scripts, optional `aidos new dashboard`, `aidos validate`, `aidos trace`, `aidos review`, generators и shared trace/review report model. `ADR-004` откладывает write-back, persistence, hosted deployment, auth и external integrations до будущего ADR.
