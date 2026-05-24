# Data Analyst Handbook

> Личный учебный справочник по Data Analyst — от установки инструментов до требований рекрутеров.

Сайт на [Astro Starlight](https://starlight.astro.build/). Тёмная тема, оранжевый акцент, поиск по содержимому, поддержка Mermaid-диаграмм и KaTeX.

---

## 🚀 Быстрый старт

### Требования

- **Node.js 20+** ([nodejs.org](https://nodejs.org) или через `nvm`)
- **pnpm 11** — версия зафиксирована в `package.json` (`packageManager`), а одобрение
  build-скриптов и настройки лежат в `pnpm-workspace.yaml`.

Установить pnpm, если ещё нет:

```bash
npm install -g pnpm
```

### Локальный запуск

```bash
# 1. Установить зависимости
pnpm install

# 2. Запустить dev-сервер
pnpm dev
```

Сайт будет доступен на `http://localhost:4321`.

### Production-сборка

```bash
# Проверка типов + сборка
pnpm build

# Локальный просмотр собранного сайта
pnpm preview
```

---

## 📁 Структура проекта

```
.
├── astro.config.mjs          # Главный конфиг Astro и Starlight
├── package.json
├── tsconfig.json
├── public/                   # Статические файлы (favicon, robots.txt)
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── assets/
    │   └── logo.svg          # Логотип сайта
    ├── content/
    │   ├── config.ts         # Конфиг content collections
    │   └── docs/             # Контент сайта
    │       ├── index.mdx     # Главная страница
    │       ├── 00-intro/     # Введение
    │       ├── 01-setup/     # Установка и окружение
    │       ├── 02-sql/       # SQL
    │       ├── 03-excel/     # Excel и Google Sheets
    │       ├── 04-python/    # Python для анализа
    │       ├── 05-statistics/        # Статистика
    │       ├── 06-visualization/     # Визуализация
    │       ├── 07-bi-tools/          # Tableau / Power BI / Looker
    │       ├── 08-product-analytics/ # Продуктовая аналитика
    │       ├── 09-ab-testing/        # A/B-тестирование
    │       ├── 10-ml-basics/         # ML-база
    │       ├── 11-modern-stack/      # Snowflake, dbt, Airflow
    │       └── 12-career/            # Карьера и собеседования
    └── styles/
        ├── custom.css        # Кастомизация Starlight
        └── fonts.css         # Шрифты (Geist, JetBrains Mono)
```

---

## ✍️ Как добавлять контент

Каждая страница — это `.md` или `.mdx` файл с фронтматтером:

```markdown
---
title: Заголовок страницы
description: Краткое описание для SEO и превью.
sidebar:
  order: 3
---

# Привычный Markdown

С поддержкой [ссылок](https://example.com), `inline-кода`, и:

\`\`\`sql
SELECT user_id, COUNT(*) AS orders
FROM orders
GROUP BY 1
ORDER BY 2 DESC
LIMIT 10;
\`\`\`

:::tip[Совет]
Используй callouts для важной информации.
:::

\`\`\`mermaid
graph LR
  A[Сырые данные] --> B[Очистка]
  B --> C[Анализ]
  C --> D[Инсайт]
\`\`\`
```

### Доступные компоненты Starlight

В `.mdx` файлах можно использовать:

```mdx
import { Card, CardGrid, LinkCard, Tabs, TabItem, Steps, Badge, Aside } from '@astrojs/starlight/components';

<CardGrid>
  <Card title="Заголовок" icon="rocket">Текст карточки</Card>
</CardGrid>
```

### Callouts

```markdown
:::note[Заметка]
Обычная заметка.
:::

:::tip[Совет]
Хорошая практика.
:::

:::caution[Осторожно]
Подводный камень.
:::

:::danger[Внимание]
Серьёзная ошибка.
:::
```

---

## 🚢 Деплой на Cloudflare

Сайт задеплоен как **Cloudflare Worker со статическими ассетами** (Workers Static
Assets) и обновляется автоматически при `git push` в `main`.

- Конфигурация деплоя — в [`wrangler.jsonc`](./wrangler.jsonc): раздаёт папку `dist/`
  как статику, серверного воркера нет.
- Команда сборки на стороне Cloudflare: `pnpm build` (= `astro check && astro build`).
- Версия pnpm берётся из поля `packageManager` в `package.json` (важно: на дефолтном
  pnpm 10 сборка падает на `pnpm-workspace.yaml`).

Подключение нового проекта (один раз): в [dash.cloudflare.com](https://dash.cloudflare.com/)
→ **Workers & Pages** → Import a repository → выбрать репозиторий. Сборка и `wrangler.jsonc`
подхватятся автоматически.

**Опционально:**
- Кастомный домен — в настройках Worker → Domains & Routes.
- Cloudflare Web Analytics — раскомментировать блок в `astro.config.mjs` и подставить токен.

### Безопасность

- HTTP-заголовки безопасности (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, HSTS) заданы в [`public/_headers`](./public/_headers).
- DDoS-защита и WAF — на стороне Cloudflare (включается в дашборде, отдельного кода не требует).
- Секреты (`.env*`, `.dev.vars`, ключи) перечислены в `.gitignore` и в репозиторий не попадают.
- Сайт статический: нет бэкенда, БД и пользовательского ввода — классов уязвимостей
  вроде SQL-инъекций или серверного RCE на проде нет. Mermaid рендерится с
  `securityLevel: 'strict'`.

---

## 🔧 Полезные команды

```bash
pnpm dev          # Dev-сервер на localhost:4321
pnpm build        # Production-сборка с проверкой типов
pnpm preview      # Предпросмотр собранного сайта
pnpm format       # Prettier по всему проекту
pnpm lint         # ESLint
pnpm lint:md      # Markdown lint
```

---

## 📚 Стек

| Что | Зачем |
|---|---|
| **Astro 5** | Статический генератор, очень быстрый |
| **Starlight** | Готовая тема для документации |
| **MDX** | Markdown + JSX-компоненты |
| **TypeScript** | Type-safety |
| **Shiki / Expressive Code** | Подсветка SQL/Python |
| **Mermaid** | Диаграммы прямо в Markdown (рендер на клиенте, ленивая загрузка) |
| **KaTeX** | Математические формулы |
| **Pagefind** | Поиск (встроен в Starlight) |
| **Cloudflare Workers** | Хостинг статики (бесплатно, безлимит трафика) |

---

## 📝 Лицензия

MIT — используй как хочешь.
