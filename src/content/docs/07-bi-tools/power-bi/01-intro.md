---
title: Power BI — введение
description: "Power BI Desktop/Service/Mobile, установка, интерфейс и рабочий процесс: Get Data → Transform → Model → Visualize."
sidebar:
  order: 1
---

:::tip[Коротко]
Power BI — BI-инструмент от Microsoft, лидер в СНГ и Европе. Бесплатный **Power BI Desktop** (Windows) — где всё строится; **Power BI Service** — облако для публикации. Рабочий цикл всегда один: **Get Data → Transform (Power Query) → Model → Visualize**. Главная фишка — язык формул **DAX**.
:::

## Зачем это нужно

В СНГ и Европе Power BI чаще требуют, чем Tableau (особенно после ухода Tableau из РФ). Он бесплатен для старта, тесно интегрирован с Excel и Microsoft-стеком, и закрывает большинство задач отчётности.

## Версии

| Версия | Что это | Платформа |
|--------|---------|-----------|
| **Power BI Desktop** | основное приложение для разработки отчётов | Windows (бесплатно) |
| **Power BI Service** | облако: публикация, шаринг, refresh | веб (есть бесплатный tier) |
| **Power BI Mobile** | просмотр отчётов | iOS/Android |

:::note[Desktop только под Windows]
Power BI Desktop официально работает только на Windows. На macOS/Linux — через виртуалку, Parallels или облачный Windows. Это частая боль маководов; учитывай при выборе инструмента под себя.
:::

## Интерфейс

Три вкладки слева — это и есть три этапа работы:

- **Report** (диаграмма) — холст с визуалами, перетаскиваешь поля → строишь графики.
- **Data** (таблица) — просмотр загруженных таблиц.
- **Model** (схема) — связи между таблицами ([модель данных](/07-bi-tools/power-bi/03-data-model/)).

Плюс **Fields** (поля справа), **Visualizations** (типы графиков) и кнопка **Transform data** (вход в Power Query).

## Рабочий процесс

```mermaid
flowchart LR
    A["Get Data<br/>подключить источник"] --> B["Transform<br/>Power Query: очистка"]
    B --> C["Model<br/>связи между таблицами"]
    C --> D["Visualize<br/>отчёт из визуалов"]
    D --> E["Publish<br/>в Power BI Service"]
```

Этот порядок — стержень всего раздела: сначала чистим ([Power Query](/07-bi-tools/power-bi/02-power-query/)), потом строим модель и меры (DAX), потом визуализируем.

## Задачи для самопроверки

<details>
<summary>1. Можно ли разрабатывать отчёты Power BI на Mac?</summary>

Напрямую — нет: Power BI Desktop только под Windows. На Mac работают через виртуальную машину (Parallels), Boot Camp на Intel-маках или облачный Windows. Поэтому, если ты на macOS и выбираешь BI, учитывай это (Tableau кроссплатформенный).

</details>

<details>
<summary>2. В каком порядке идут этапы работы в Power BI?</summary>

Get Data → Transform (Power Query) → Model → Visualize → Publish. Сначала подключение, затем очистка в Power Query, построение модели данных и мер на DAX, и только потом визуализация и публикация в Service.

</details>

## Что дальше

- [Power Query](/07-bi-tools/power-bi/02-power-query/) — этап Transform: загрузка и очистка.
- [Tableau — введение](/07-bi-tools/tableau/01-intro/) — главный конкурент для сравнения.
