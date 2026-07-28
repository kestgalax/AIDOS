# План реализации AIDOS под ключ

Этот документ описывает следующие шаги, необходимые для превращения AIDOS из knowledge-first репозитория в готовый продукт, который можно использовать при старте новых проектов.

Цель: пользователь должен понимать, как применить AIDOS в новом проекте, а AI-агенты должны получать предсказуемую среду с продуктовым контекстом, архитектурными решениями, задачами, проверками и правилами review.

## Целевое состояние

AIDOS считается реализованным "под ключ", когда:

- его можно установить, скопировать или инициализировать в новом проекте;
- пользователь получает готовую структуру знаний, ADR, роли агентов, шаблоны, проверки и workflow;
- AI-агенты получают единый вход через `AGENTS.md`;
- новый проект может пройти базовую проверку структуры одной командой;
- пользователь понимает, как создать первую feature, task, ADR и review;
- критические решения остаются под контролем человека.

## Принцип реализации

Рекомендуемая продуктовая форма: hybrid product с CLI-first последовательностью.

Это означает:

- сначала строится CLI/core для проверки и генерации файлов;
- repository artifacts остаются source of truth;
- markdown-документы не заменяются базой данных;
- UI или dashboard добавляются только после стабилизации CLI/core-модели;
- все долгосрочные технические решения фиксируются через ADR.

## Текущее состояние

Выполнено для первого CLI/core инкремента:

- принято `ADR-002` по форме продукта и стеку;
- создан TypeScript/Node.js CLI scaffold на npm;
- реализован `aidos validate`;
- реализованы генераторы `aidos new adr|feature|task|review`;
- реализован неинтерактивный `aidos init [target]`;
- реализован интерактивный onboarding через `aidos init [target] --interactive`;
- реализован update mode через `aidos init [target] --update --confirm-overwrite`;
- описан quickstart нового проекта на английском и русском;
- добавлен пример generated project в `examples/generated-project/`;
- реализован traceability report через `aidos trace`;
- реализован deterministic reviewer gate через `aidos review`;
- добавлен общий CLI/core report model в `src/report-model.ts`;
- принят `ADR-003` по UI/dashboard stack и границе source of truth;
- dashboard starter перенесён в `examples/dashboard-starter/`; `aidos new dashboard` копирует optional scaffold;
- принят `ADR-005` по optional dashboard placement;
- принят `ADR-006` по generic CI governance scripts в project starter;
- `templates/project-starter/` используется `aidos init` вместо inline skeleton;
- добавлены lifecycle docs и stack ADR gate через `ADR-002-runtime-stack.md` placeholder;
- реализован traceability autofill и `aidos new flow`;
- добавлены `docs/ci-governance.md` и `ops/ci.md` в starter;
- добавлены тесты, typecheck и локальная validation-команда;
- введено обязательное правило обновлять roadmap и этот план после каждой завершённой implementation-задачи.

Текущий фокус:

- продолжить Milestone 8 / Фазу 9 после первого slice (validate ignore + ADR Impact + living-consumer docs);
- следующий пункт: gate на заполненный review Outcome/Evidence;
- сохранить markdown-файлы в репозитории как source of truth;
- не расширять dashboard/write-back без ADR.

Ближайшая очередь (из `docs/roadmap.md` Milestone 8):

1. ~~ignore-policy для `aidos validate` (DerivedData / SPM / vendor);~~ **Done**
2. ~~контракт `ADR Impact` в `aidos review` + шаблоны;~~ **Done** (+ living consumer docs для CarrotType)
3. gate на заполненный review Outcome/Evidence;
4. semantic freshness ссылок feature↔ADR;
5. дисциплина новых flows после MVP;
6. шаблоны research/spike/quality-gate;
7. stack-aware hooks в consumer `ops/`;
8. post-MVP consumer playbook.

## Фаза 1. Принять ADR по форме продукта и стеку

Статус: выполнено для первого CLI/core инкремента.

Перед написанием runtime-кода необходимо завершить `docs/decisions/ADR-002-product-form-and-stack.md`.

ADR должен зафиксировать:

- форму продукта: CLI-first, web app-first или hybrid;
- язык и runtime;
- package manager;
- test runner;
- validation command;
- CI direction;
- distribution model;
- последствия для структуры репозитория.

Рекомендуемый default:

- product form: hybrid;
- implementation sequence: CLI-first;
- runtime: TypeScript on Node.js;
- data source: markdown files in repository;
- first interface: local CLI validation;
- persistence: none until traceability model proves it is needed.

Результат фазы:

- `ADR-002` принят или заменён новым ADR;
- runtime scaffold разрешён только в рамках принятого решения;
- первый executable scope определён.

Текущее решение:

- product form: hybrid;
- implementation sequence: CLI-first;
- runtime: TypeScript on Node.js;
- package manager: npm;
- first executable scope: `aidos validate`.

## Фаза 2. Создать executable core

Статус: выполнено для первого CLI/core инкремента.

Executable core должен уметь проверять здоровье AIDOS-репозитория.

Минимальная CLI-команда:

```text
aidos validate
```

Проверки:

- обязательные файлы существуют;
- `AGENTS.md` содержит порядок чтения;
- `.ai/` содержит роли Planner, Developer, Reviewer и governance-файлы;
- `docs/product-intent.md`, `docs/roadmap.md`, `docs/architecture.md` существуют;
- `docs/decisions/` содержит ADR с обязательными секциями;
- `docs/specs/` содержит шаблоны feature, task и review;
- markdown-ссылки не битые;
- runtime stack не появляется без принятого ADR.

Результат фазы:

- одна команда проверяет knowledge core;
- ошибки понятны пользователю;
- команда пригодна для локального запуска и CI.

Текущий результат:

- `npm run validate` запускает `aidos validate`;
- проверяются обязательные файлы, ADR-секции, traceability-маркеры, markdown-ссылки и ADR-backed runtime scaffold;
- поведение покрыто автоматическими тестами.

## Фаза 3. Создать генераторы артефактов

Статус: выполнено для первого CLI/core инкремента.

Генераторы должны снижать ручную работу, но не скрывать решения.

Минимальные команды:

```text
aidos new adr
aidos new feature
aidos new task
aidos new review
```

Генераторы:

- используют `docs/specs/` как source of truth;
- создают файлы с понятными именами;
- вставляют обязательные traceability-поля;
- не принимают архитектурные решения автоматически;
- оставляют документ в состоянии, пригодном для человеческого review.

Результат фазы:

- пользователь может быстро создать ADR, feature spec, task и review checklist;
- все созданные артефакты следуют governance-правилам;
- шаблоны остаются главным источником формата.

Текущие команды:

```text
npm exec aidos new adr "runtime packaging"
npm exec aidos new feature "first project setup"
npm exec aidos new task "validate docs"
npm exec aidos new review "validate docs"
```

## Фаза 4. Поддержать запуск нового проекта

Статус: выполнено для первого интерактивного CLI/core инкремента.

AIDOS должен помогать пользователю стартовать новый проект с правильной структурой.

Минимальная команда или workflow:

```text
aidos init
```

`init` должен создавать:

- `.ai/`;
- `docs/product-intent.md`;
- `docs/roadmap.md`;
- `docs/architecture.md`;
- `docs/decisions/`;
- `docs/specs/`;
- `ops/`;
- `AGENTS.md`;
- `README.md`.

Интерактивные вопросы:

- mission;
- vision;
- principles;
- non-goals;
- default trade-offs;
- planned product form;
- whether ADR for stack is already known;
- which agent roles are needed.

Результат фазы:

- новый проект получает working AIDOS skeleton;
- человек понимает, что заполнить перед первой задачей;
- AI-агент получает обязательный entry point.

Текущий результат:

- `npm exec aidos init ./my-new-project` создаёт валидный skeleton;
- `npm exec aidos init ./my-new-project --interactive` задаёт вопросы и использует ответы для `docs/product-intent.md` и первого ADR;
- существующие файлы не перезаписываются по умолчанию;
- `npm exec aidos init ./my-new-project --update --confirm-overwrite` обновляет существующие AIDOS-managed skeleton файлы только при явном подтверждении;
- созданный skeleton проходит `aidos validate`.

Следующее улучшение:

- продолжать dashboard через Фазу 8, сохраняя `aidos init` как onboarding entry point.

## Фаза 5. Добавить traceability model

Статус: выполнено для первого CLI/core инкремента.

Traceability model должна отвечать на вопрос: "Почему существует это изменение?"

Минимальная цепочка:

```text
intent -> roadmap -> feature -> task -> ADR -> PR/release
```

Проверки:

- feature имеет ссылку на roadmap item или product intent;
- task имеет ссылку на feature или объяснение исключения;
- архитектурное изменение имеет ADR;
- review содержит verification evidence;
- release note или PR содержит связь с задачей.

Первый интерфейс:

```text
aidos trace
```

Результат фазы:

- AIDOS умеет находить отсутствующие traceability-ссылки;
- пользователь получает текстовый отчёт;
- модель готова для будущей визуализации.

Текущий результат:

- `npm exec aidos trace` выводит traceability report;
- отчёт считает feature, task, review и ADR артефакты;
- отчёт показывает незаполненные traceability-поля;
- поведение покрыто тестами.

## Фаза 6. Добавить reviewer automation

Статус: выполнено для первого CLI/core инкремента.

Reviewer automation должна помогать контролировать Definition of Done.

Минимальная команда:

```text
aidos review
```

Проверки:

- task или feature имеют acceptance criteria;
- verification evidence присутствует;
- docs обновлены при изменении поведения или workflow;
- ADR impact указан;
- security/human-control constraints не нарушены;
- результат можно классифицировать как Approve, Request Changes или Block.

Результат фазы:

- Reviewer Agent получает структурированный чеклист;
- блокирующие проблемы отделены от рекомендаций;
- review можно запускать до pull request.

Текущий результат:

- `npm exec aidos review` выводит deterministic review report;
- отчёт классифицирует результат как `Approve`, `Request Changes` или `Block`;
- первый набор проверок покрывает concrete acceptance criteria, verification evidence, documentation entries и ADR impact;
- поведение покрыто тестами.

## Фаза 7. Подготовить пользовательский onboarding

Статус: выполнено для первого CLI/core инкремента: quickstart и пример generated project добавлены.

Пользователь должен понимать, как применить AIDOS без знания внутренней архитектуры.

Нужно подготовить:

- quickstart для нового проекта;
- пример первого запуска;
- объяснение, какие документы читает человек;
- объяснение, какие документы читает AI-агент;
- сценарий создания первой feature;
- сценарий создания первого ADR;
- сценарий review перед merge.

Минимальный quickstart:

```text
1. Установить или скопировать AIDOS.
2. Запустить `aidos init`.
3. Заполнить product intent.
4. Принять первый ADR по стеку.
5. Запустить `aidos validate`.
6. Создать feature через `aidos new feature`.
7. Передать task Developer Agent.
8. Проверить результат через `aidos review`.
```

Результат фазы:

- пользователь может стартовать новый проект по инструкции;
- AI-агенты получают одинаковый operating context;
- onboarding не требует знания истории разработки AIDOS.

Текущий результат:

- `docs/quickstart-new-project.md` описывает англоязычный сценарий старта;
- `docs/quickstart-new-project.ru.md` описывает русскоязычный сценарий старта;
- README-файлы ссылаются на quickstart.
- `examples/generated-project/` показывает результат `aidos init --interactive` и проходит validation-тест.

## Фаза 8. Web UI или dashboard

Статус: read-only shell и detail routes реализованы.

UI добавляется только после CLI/core.

Назначение UI:

- показать слои AIDOS;
- визуализировать ADR;
- показать roadmap, feature и task status;
- отобразить traceability graph;
- помочь человеку увидеть missing links и review blockers.

Ограничения:

- UI не заменяет markdown source of truth;
- UI не принимает критические решения вместо человека;
- UI должен использовать ту же модель, что CLI/core.

Текущее решение:

- `ADR-003` задаёт read-only dashboard boundary;
- `ADR-005` размещает reference dashboard в `examples/dashboard-starter/`;
- стек dashboard: Next.js App Router, React, TypeScript, shadcn/ui и Tailwind CSS;
- dashboard читает markdown artifacts через `AIDOS_PROJECT_ROOT`;
- persistence, auth, hosted deployment, external integrations и write-back workflow требуют будущих ADR.

Текущий результат:

- `examples/dashboard-starter` создан как Next.js App Router приложение;
- `aidos new dashboard` копирует optional scaffold в consumer project;
- добавлен read-only dashboard projection и detail views;
- dashboard shell собирается через `npm run dashboard:build`;

Результат фазы:

- AIDOS становится удобнее для человека;
- CLI остаётся пригодным для автоматизации и CI;
- repository artifacts остаются главным источником истины.

## Фаза 9. Consumer Hardening (уроки CarrotType)

Статус: в процессе (первый slice выполнен). Соответствует `docs/roadmap.md` Milestone 8.

Контекст:

- CarrotType показал, что knowledge/ADR слой AIDOS достаточен для ведения native macOS MVP до private release.
- CarrotType задокументирован как living consumer в `docs/living-consumers.md` (sibling `../carrottype`, private GitHub).
- Слабое место — CONTROL tooling на «грязном» consumer-репозитории: false positives в `validate`, хрупкий `ADR Impact` в `review`, пустой review artifact, один раздутый feature-flow, зелёный `trace` при устаревших ADR-ссылках.

Задачи фазы (порядок = приоритет):

1. **Validate ignore policy** — **Done.** Не сканировать `.derivedData*`, SPM checkouts, `node_modules` и аналогичный vendor markdown.
2. **ADR Impact UX** — **Done.** Допустимы формулировки `Follows accepted ADR…`; шаблоны синхронизированы.
3. **Review closure** — пустые Outcome/Evidence в review-спеках = blocker до Done.
4. **Semantic freshness** — ловить stale Related ADRs и accepted ADR без связи с текущей architecture.
5. **Multi-flow hygiene** — правило/док: новый engine, UX surface или trust model → новый `aidos new flow` (или amendment), а не бесконечное расширение F-001.
6. **Research / spike / quality-gate** — first-class шаблоны по образцу CarrotType research notes и quality notes.
7. **Stack-aware ops** — примеры consumer CI/docs для non-Node runtime без требования Node как runtime продукта.
8. **Post-MVP playbook** — quality gate → flip recommended → signing/notarization → spike backlog; ссылка из quickstart/lifecycle.

Результат фазы:

- native consumer с build artifacts проходит `aidos validate` без ложных broken links;
- `aidos review` не блокирует семантически валидный ADR Impact;
- незакрытый review artifact виден как blocker;
- post-MVP workflow и spike-артефакты описаны и пригодны для следующего consumer-проекта.

Не делать в этой фазе:

- write-back dashboard / persistence / hosted deploy;
- замена markdown source of truth;
- обязательный полный native CI build как hard gate AIDOS.

## Definition of Ready для публичного использования

AIDOS готов к использованию другими проектами, когда:

- есть понятный quickstart;
- есть `init` flow;
- есть `validate` command;
- есть генераторы ADR, feature spec и task;
- есть reviewer checklist или `review` command;
- есть пример нового проекта;
- есть документация для человека и AI-агента;
- есть правила обновления ADR и governance;
- известны ограничения MVP.

## Минимальный MVP

Минимальный продукт, который уже можно использовать:

- `ADR-002` принят;
- `ADR-003` принят для dashboard boundary;
- CLI scaffold создан;
- `aidos validate` работает;
- `aidos init` создаёт skeleton нового проекта;
- `aidos init --interactive` персонализирует стартовый skeleton;
- `aidos init --update --confirm-overwrite` обновляет AIDOS-managed skeleton файлы только при явном подтверждении;
- `aidos new adr` создаёт ADR;
- `aidos new feature` создаёт feature spec;
- `aidos new task` создаёт task;
- `aidos trace` показывает missing traceability links;
- `aidos review` показывает deterministic review outcome;
- `src/report-model.ts` даёт общий trace/review report contract для CLI/core и dashboard;
- `examples/dashboard-starter` и `aidos new dashboard` дают optional read-only UI для consumer projects;
- README объясняет onboarding;
- пример проекта проходит validation.

## Не делать пока

- Не расширять UI за пределы `ADR-003` без нового решения.
- Не выбирать persistence до доказанной необходимости.
- Не заменять markdown source of truth базой данных.
- Не автоматизировать принятие критических решений без человека.
- Не добавлять write-back workflow, auth, hosted deployment, GitHub/Cursor/CI integration без ADR.
- Не усложнять onboarding за пределы текущего `init`/`quickstart` flow без отдельной задачи.

## Последовательность ближайших задач

1. ~~Довести dashboard composition до более полного shadcn/ui набора.~~ Выполнено.
2. ~~Решить ADR на write-back, persistence, deployment.~~ Выполнено: `ADR-004`.
3. ~~Turnkey bootstrap нового проекта.~~ Выполнено: `templates/project-starter/`, lifecycle docs, `aidos new flow`, CI scripts, optional dashboard scaffold.
4. ~~Фаза 9 / Milestone 8 — первый slice~~ Выполнено: validate ignore, ADR Impact `Follows accepted`, `docs/living-consumers.md`.
5. **Фаза 9 / Milestone 8 — далее:** review Outcome/Evidence closure, затем semantic freshness и остальная очередь.

Следующий executable шаг: gate на заполненный review Outcome/Evidence в `aidos review`.
