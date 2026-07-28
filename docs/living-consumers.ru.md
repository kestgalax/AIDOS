# Живые consumer-проекты

AIDOS поставляет **примеры внутри репозитория** в `examples/` и учится на **внешних живых consumer-проектах** — реальных продуктах, которые используют AIDOS ежедневно, но не копируются в этот репозиторий.

| Тип | Расположение | Назначение |
|-----|--------------|------------|
| Сгенерированный skeleton | `examples/generated-project/` | Показывает результат `aidos init` |
| Dashboard scaffold | `examples/dashboard-starter/` | Опциональный read-only UI через `aidos new dashboard` |
| Живой consumer | Внешний репозиторий (sibling workspace) | Доказательство, что knowledge + ADR + CONTROL работают на реальном продукте |

## CarrotType

[CarrotType](https://github.com/kestgalax/carrottype) — нативное macOS menu-bar приложение для диктовки (горячая клавиша → on-device STT → вставка у курсора). Это первый задокументированный живой consumer AIDOS.

- **Доступ:** private / invite-only репозиторий и релизы.
- **Локальный layout:** клон рядом с AIDOS как `../carrottype` (тот же workspace pattern, что в quickstart нового проекта).
- **Что смотреть:** `docs/product-intent.md`, `docs/architecture.md`, `docs/decisions/`, `docs/roadmap.md`, `aidos.config.json` и `AGENTS.md`.
- **Статус на момент документации:** private GitHub Release `v0.1.0` (unsigned DMG).

Уроки CarrotType питают Milestone 8 AIDOS (Consumer Hardening): ignore build/vendor деревьев в `validate`, более понятный ADR Impact в `aidos review` и дальнейшие улучшения CONTROL в roadmap.

Не подменяйте `examples/generated-project/` просмотром CarrotType. Skeleton учит структуре; живой consumer — тому, как AIDOS ведёт себя после реальной продуктовой работы.
