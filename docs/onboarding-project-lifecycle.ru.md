# Жизненный цикл нового проекта

Этот документ описывает путь от начальной идеи до первой traced feature в новом AIDOS-проекте.

## Предварительные условия

1. Один раз клонируйте репозиторий AIDOS как tooling.
2. Инициализируйте проект:

```bash
npm exec aidos -- init ../my-new-project --interactive
```

3. Дальше запускайте `aidos` из `PATH` в каталоге нового проекта. Не указывайте проект на соседний клон AIDOS.

## Фаза 1: Идея

Цель: зафиксировать, зачем существует проект.

Артефакты:

- `docs/product-intent.md`
- `docs/roadmap.md`, Milestone 0

Критерий готовности:

- Mission и vision достаточно конкретны для планирования.
- Non-goals явно перечислены.

## Фаза 2: Stack ADR Gate

Цель: выбрать runtime-направление до прикладного кода.

Артефакты:

- `docs/decisions/ADR-002-runtime-stack.md`
- обновлённый `docs/architecture.md`

Правила:

- Не создавать application runtime scaffold до Accepted ADR-002.
- При необходимости используйте `aidos new adr "runtime stack"`.

Критерий готовности:

- ADR-002 в статусе Accepted.
- Architecture отражает выбранный стек.

## Фаза 3: Dev Environment

Цель: описать, как локально запускать и проверять принятый стек.

Артефакты:

- `ops/environments.md`
- `ops/ci.md`

Чеклист:

- Локальный runtime и package manager задокументированы.
- Команды validation задокументированы.
- CI expectations описаны без привязки к одному вендору.

Критерий готовности:

- Разработчик может запустить проект локально по документации.
- Governance-команды запускаются из корня проекта.

## Фаза 4: Первая feature

Цель: создать связанные feature, task и review артефакты.

Команда:

```bash
aidos new flow "first user workflow"
```

Затем:

```bash
npm run aidos:validate
npm run aidos:trace
npm run aidos:review
```

Опционально:

```bash
aidos new dashboard ./dashboard
```

Критерий готовности:

- Trace report не показывает missing fields для первого flow.
- Review outcome понятен до merge.
