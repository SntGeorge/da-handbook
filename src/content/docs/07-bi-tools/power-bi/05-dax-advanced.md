---
title: DAX — продвинутый
description: "Продвинутый DAX: CALCULATE как главная функция, FILTER/ALL/ALLEXCEPT, time intelligence (TOTALYTD, SAMEPERIODLASTYEAR), VAR/RETURN, итераторы SUMX."
sidebar:
  order: 5
---

:::tip[Коротко]
**`CALCULATE`** — самая важная функция DAX: она **меняет контекст фильтра** вычисления. На ней строятся доли от целого, сравнения с прошлым периодом и time intelligence (`TOTALYTD`, `SAMEPERIODLASTYEAR`). Плюс **итераторы** (`SUMX`) считают построчно, а `VAR` делает формулы читаемыми.
:::

## Зачем это нужно

Базовых мер хватает на простые суммы. Но «доля категории в общем», «продажи год к году», «накопленный итог с начала года» требуют управления контекстом — а это `CALCULATE` и time intelligence. Это уровень middle в Power BI.

## CALCULATE — главная функция

`CALCULATE(выражение, фильтр1, фильтр2, ...)` пересчитывает меру, **изменив filter context**:

```dax
Sales RU = CALCULATE([Total Sales], Orders[Country] = "RU")
```

→ выручка только по России, **независимо** от текущего среза. CALCULATE — основа почти всех нетривиальных мер.

## FILTER, ALL, ALLEXCEPT

Модификаторы контекста внутри CALCULATE:

- **`ALL`** — снять все фильтры (для знаменателя «доли от целого»):

```dax
% of Total = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders)))
```

- **`ALLEXCEPT`** — снять все фильтры, кроме указанных.
- **`FILTER`** — задать сложное построчное условие, когда простого аргумента CALCULATE мало.

## Time intelligence

Готовые функции для дат (нужна таблица-календарь в [модели](/07-bi-tools/power-bi/03-data-model/)):

```dax
Sales YTD     = TOTALYTD([Total Sales], Calendar[Date])         -- с начала года
Sales LY      = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))
YoY %         = DIVIDE([Total Sales] - [Sales LY], [Sales LY])  -- год к году
```

:::note[Нужна полноценная таблица дат]
Time intelligence корректно работает только при отдельной таблице-календаре с непрерывными датами, помеченной как Date table. Без неё `TOTALYTD` и `SAMEPERIODLASTYEAR` дадут неверные результаты. Создание календаря — обязательный шаг для дат.
:::

## VAR / RETURN

Переменные делают формулы читаемыми и быстрее (вычисляются один раз):

```dax
YoY % =
VAR CurrentSales = [Total Sales]
VAR LastYear = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))
RETURN DIVIDE(CurrentSales - LastYear, LastYear)
```

## Итераторы: SUMX, AVERAGEX

Функции с `X` идут **построчно** (создают row context) и потом агрегируют — нужны, когда расчёт зависит от значений в строке:

```dax
Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])   -- сначала Qty*Price по строкам, потом сумма
```

Обычный `SUM(Sales[Qty]) * SUM(Sales[Price])` дал бы неверный результат — итератор считает произведение в каждой строке.

## Задачи для самопроверки

<details>
<summary>1. Нужна доля каждой категории в общей выручке. Какая конструкция DAX?</summary>

`DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders)))`. `ALL` снимает фильтр категории в знаменателе, давая общую выручку, а числитель остаётся в контексте текущей категории. Так получается доля от целого.

</details>

<details>
<summary>2. Почему `SUM(Qty) * SUM(Price)` неверно считает выручку, а SUMX верно?</summary>

Выручка = сумма построчных произведений `Qty*Price`, а `SUM(Qty)*SUM(Price)` перемножает уже агрегированные итоги — это другое число. `SUMX(Sales, Qty*Price)` идёт по строкам, считает произведение в каждой и суммирует — корректно.

</details>

## Что дальше

- [Визуализации в Power BI](/07-bi-tools/power-bi/06-visualizations/) — показываем меры на отчёте.
- [DAX — основы](/07-bi-tools/power-bi/04-dax-basics/) — контекст фильтра, который меняет CALCULATE.
