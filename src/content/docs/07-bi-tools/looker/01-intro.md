---
title: Looker Studio
description: "Looker Studio — бесплатный BI от Google: чем отличается от Looker (enterprise), для чего годится, подключение источников и базовый отчёт."
sidebar:
  order: 1
---

:::tip[Коротко]
Looker Studio (бывший Google Data Studio) — **бесплатный** облачный BI от Google. Идеален для пет-проектов и быстрых дашбордов, особенно поверх Google-данных (Sheets, Analytics, BigQuery). Не путай с **Looker** — это отдельный дорогой enterprise-продукт с языком LookML.
:::

## Зачем это нужно

Tableau Public и Power BI хороши, но Looker Studio выигрывает в одном: он полностью бесплатен, работает в браузере (даже на Mac) и в пару кликов цепляется к Google-сервисам. Для портфолио и небольших отчётов — отличный быстрый старт.

## Looker Studio vs Looker

:::caution[Это два разных продукта]
**Looker Studio** — бесплатный self-service BI для дашбордов (наш герой). **Looker** — платная enterprise-платформа Google Cloud с моделированием данных на языке LookML, для крупных компаний. Названия похожи, но это совершенно разные инструменты. В вакансиях junior почти всегда имеют в виду Looker **Studio**.
:::

## Бесплатно для всех

Нужен только Google-аккаунт — заходишь на [lookerstudio.google.com](https://lookerstudio.google.com/) и работаешь в браузере. Нет установки, нет лицензий, отчёты живут в облаке и шарятся ссылкой как Google-документ.

## Подключение источников

Десятки коннекторов, но сильнее всего — экосистема Google:

- **Google Sheets** — самый частый источник для небольших проектов.
- **Google Analytics 4**, **Google Ads** — нативно, для маркетинговых дашбордов.
- **BigQuery** — для больших данных в [облаке](/11-modern-stack/03-bigquery/).
- **PostgreSQL/MySQL**, CSV-загрузка, сторонние коннекторы.

## Базовый отчёт

1. **Create → Report** → выбери источник (например, Google Sheet).
2. На холст добавляются **charts** (scorecard, table, time series, bar) из панели.
3. Поле кидаешь в **Dimension** (разрез) или **Metric** (число) визуала.
4. Отчёт сразу живой и шарится ссылкой.

Логика та же «измерение × мера», что в [Tableau](/07-bi-tools/tableau/01-intro/) и [Power BI](/07-bi-tools/power-bi/01-intro/).

<details>
<summary>1. В вакансии написано «Looker». Это про бесплатный инструмент?</summary>

Не обязательно — уточни. «Looker» строго — это платная enterprise-платформа с LookML. «Looker Studio» — бесплатный дашборд-инструмент. Часто пишут небрежно, но для junior почти всегда подразумевают именно Studio; стоит понимать разницу.

</details>

<details>
<summary>2. Быстрый бесплатный дашборд поверх Google Sheets с шарингом по ссылке. Какой BI?</summary>

Looker Studio: бесплатен, нативно цепляется к Google Sheets/Analytics, работает в браузере на любой ОС и шарится ссылкой как Google-документ. Для такого сценария он удобнее, чем Tableau или Power BI.

</details>

## Что дальше

- [Looker Studio: базовая работа](/07-bi-tools/looker/02-basics/) — отчёт, фильтры, calculated fields, шаринг.
- [Metabase и Superset](/07-bi-tools/metabase-superset/) — open-source альтернативы.
