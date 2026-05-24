---
title: DAX — advanced
description: "Advanced DAX: CALCULATE as the main function, FILTER/ALL/ALLEXCEPT, time intelligence (TOTALYTD, SAMEPERIODLASTYEAR), VAR/RETURN, iterators SUMX."
sidebar:
  order: 5
---

:::tip[In short]
**`CALCULATE`** is the most important DAX function: it **changes the filter context** of a computation. On it are built shares of a total, comparisons with the prior period, and time intelligence (`TOTALYTD`, `SAMEPERIODLASTYEAR`). Plus **iterators** (`SUMX`) compute row by row, and `VAR` makes formulas readable.
:::

## Why you need it

Basic measures suffice for simple sums. But "a category's share of the total", "year-over-year sales", "running total since the start of the year" require context control — and that's `CALCULATE` and time intelligence. This is the middle level in Power BI.

## CALCULATE — the main function

`CALCULATE(expression, filter1, filter2, ...)` recomputes a measure with a **changed filter context**:

```dax
Sales RU = CALCULATE([Total Sales], Orders[Country] = "RU")
```

→ revenue for Russia only, **regardless** of the current slice. CALCULATE is the basis of almost all nontrivial measures.

## FILTER, ALL, ALLEXCEPT

Context modifiers inside CALCULATE:

- **`ALL`** — remove all filters (for a "share of total" denominator):

```dax
% of Total = DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders)))
```

- **`ALLEXCEPT`** — remove all filters except the specified ones.
- **`FILTER`** — set a complex row-by-row condition when a simple CALCULATE argument isn't enough.

## Time intelligence

Ready-made functions for dates (needs a calendar table in the [model](/en/07-bi-tools/power-bi/03-data-model/)):

```dax
Sales YTD     = TOTALYTD([Total Sales], Calendar[Date])         -- since the start of the year
Sales LY      = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))
YoY %         = DIVIDE([Total Sales] - [Sales LY], [Sales LY])  -- year over year
```

:::note[A proper date table is needed]
Time intelligence works correctly only with a separate calendar table with continuous dates, marked as a Date table. Without it `TOTALYTD` and `SAMEPERIODLASTYEAR` give wrong results. Creating a calendar is a mandatory step for dates.
:::

## VAR / RETURN

Variables make formulas readable and faster (computed once):

```dax
YoY % =
VAR CurrentSales = [Total Sales]
VAR LastYear = CALCULATE([Total Sales], SAMEPERIODLASTYEAR(Calendar[Date]))
RETURN DIVIDE(CurrentSales - LastYear, LastYear)
```

## Iterators: SUMX, AVERAGEX

Functions with `X` go **row by row** (creating row context) and then aggregate — needed when the computation depends on row values:

```dax
Revenue = SUMX(Sales, Sales[Qty] * Sales[Price])   -- first Qty*Price per row, then the sum
```

A plain `SUM(Sales[Qty]) * SUM(Sales[Price])` would give a wrong result — the iterator computes the product in each row.

## Practice tasks

<details>
<summary>1. You need each category's share of total revenue. Which DAX construct?</summary>

`DIVIDE([Total Sales], CALCULATE([Total Sales], ALL(Orders)))`. `ALL` removes the category filter in the denominator, giving total revenue, while the numerator stays in the current category's context. That gives the share of the total.

</details>

<details>
<summary>2. Why does `SUM(Qty) * SUM(Price)` compute revenue wrong, while SUMX is right?</summary>

Revenue = the sum of row-wise products `Qty*Price`, while `SUM(Qty)*SUM(Price)` multiplies already-aggregated totals — a different number. `SUMX(Sales, Qty*Price)` goes row by row, computes the product in each and sums — correctly.

</details>

## What's next

- [Visualizations in Power BI](/en/07-bi-tools/power-bi/06-visualizations/) — showing measures on a report.
- [DAX — basics](/en/07-bi-tools/power-bi/04-dax-basics/) — the filter context CALCULATE changes.
