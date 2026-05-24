# Data Analyst Handbook

> Личный учебный справочник по Data Analyst — от установки инструментов до требований рекрутеров.

Сайт на [Astro Starlight](https://starlight.astro.build/). Тёмная тема, оранжевый акцент, поиск по содержимому, поддержка Mermaid-диаграмм и KaTeX.

---

## 🚀 Быстрый старт

### Требования

- **Node.js 20+** ([nodejs.org](https://nodejs.org) или через `nvm`)
- **pnpm** (рекомендуется) или npm

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

## 🚢 Деплой на Cloudflare Pages

1. **Создать репозиторий на GitHub** и запушить проект:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/USERNAME/data-analyst-handbook.git
   git push -u origin main
   ```

2. **Зайти в [Cloudflare Pages](https://dash.cloudflare.com/)** → Pages → Create application → Connect to Git → выбрать репозиторий.

3. **Настройки сборки:**
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Node version: `20`
   - (Environment variables: `NODE_VERSION=20`)

4. **Deploy.** После первого деплоя сайт будет на `https://da-handbook.pages.dev` (или своё имя проекта).

5. **Опционально**: подключить кастомный домен в Custom domains.

6. **Опционально**: включить Cloudflare Web Analytics — раскомментировать соответствующий блок в `astro.config.mjs` и подставить токен.

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
| **Mermaid** | Диаграммы прямо в Markdown |
| **KaTeX** | Математические формулы |
| **Pagefind** | Поиск (встроен в Starlight) |
| **Cloudflare Pages** | Хостинг (бесплатно, безлимит трафика) |

---

## 📝 Лицензия

MIT — используй как хочешь.
