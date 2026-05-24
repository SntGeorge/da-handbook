---
title: DAX — basics
description: "DAX basics in Power BI: calculated columns vs measures, row context and filter context, basic functions SUM/COUNT, DIVIDE, IF/SWITCH."
sidebar:
  order: 4
---

:::tip[In short]
DAX is Power BI's formula language. The key distinction: a **measure** is computed on the fly in the visual's context, a **calculated column** — once at load, row by row. In 90% of cases you need a measure. Understanding **context** (row vs filter) is the main thing that separates those who "understand DAX" from those who copy formulas.
:::

## Why you need it

DAX turns the model into metrics: revenue, average check, % of plan. Without it Power BI just shows raw fields. DAX is what's actually asked in a Power BI interview.

## Calculated columns vs measures

| | Calculated column | Measure |
|--|-------------------|---------|
| When computed | at load/refresh, row by row | on the fly, in the visual's context |
| Where it lives | as a new column in the table | as a metric, takes no space in the table |
| Memory | takes (stored) | stores no data |
| When to use | you need a row attribute (category) | aggregates, almost always |

:::tip[When in doubt — make a measure]
Measures are more efficient (don't bloat the model) and recompute under each slice. A calculated column is rarely needed — when the value must be a row attribute (e.g. an amount category for grouping). For metrics (sum, avg, shares) — always a measure.
:::

## Context: row vs filter

The heart of DAX. Without this, formulas seem like magic:

- **Row context** — "the current row". Exists in a calculated column and in iterators (`SUMX`). The formula sees this row's field values.
- **Filter context** — which filters are applied by the visual/slicer/matrix row. The measure `SUM(Sales[Amount])` in the "Russia" row is automatically computed only for Russia — that's filter context.

Measures react to filter context: one formula gives different numbers in different report cells.

## Basic functions

```dax
Total Sales = SUM(Sales[Amount])
Orders      = COUNTROWS(Sales)
Customers   = DISTINCTCOUNT(Sales[CustomerID])
Avg Check   = AVERAGE(Sales[Amount])
```

## DIVIDE — protection against division by zero

```dax
Conversion = DIVIDE([Purchases], [Visits])     -- returns BLANK on division by 0
```

:::caution[Use DIVIDE, not /]
Plain division `[Purchases] / [Visits]` errors on a zero denominator and breaks the visual. `DIVIDE` safely returns BLANK (or a given value). For any shares and ratios, use `DIVIDE`.
:::

## IF and SWITCH

```dax
Tier = IF([Total Sales] > 3000, "A", "B")

Tier = SWITCH(TRUE(),
    [Total Sales] >= 3000, "A",
    [Total Sales] >= 2000, "B",
    "C")
```

`SWITCH(TRUE(), ...)` is a readable replacement for nested `IF` with several conditions.

## Practice tasks

<details>
<summary>1. You need a "revenue" metric that recomputes under any report slice. Column or measure?</summary>

A measure: `Total Sales = SUM(Sales[Amount])`. A measure is computed on the fly in filter context — in the "Russia" row it shows Russia's revenue, in the total — the overall. A calculated column can't do this: it's computed row by row at load and doesn't react to visual slices.

</details>

<details>
<summary>2. Why is DIVIDE better than plain division for conversion?</summary>

`DIVIDE([Purchases], [Visits])` safely handles a zero denominator (returns BLANK), while `/` throws an error and breaks the visual. On real data, zeros in the denominator are inevitable (a segment with no visits), so DIVIDE is the standard for shares.

</details>

## What's next

- [DAX — advanced](/en/07-bi-tools/power-bi/05-dax-advanced/) — CALCULATE, time intelligence, iterators.
- [Data model](/en/07-bi-tools/power-bi/03-data-model/) — filter context works over the model's relationships.
