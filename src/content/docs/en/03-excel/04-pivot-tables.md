---
title: Pivot tables
description: "Pivot tables in Excel: creation, rows/columns/values fields, grouping dates, calculated fields, slicers."
sidebar:
  order: 4
---

:::tip[In short]
A pivot table is `GROUP BY` with the mouse: you drag fields into areas, and Excel computes sums, counts and averages by group itself. The main tool for fast analysis without a single formula.
:::

:::note[Data flow]
Input: a flat table of rows
→ Processing: you drag fields into areas (rows/columns/values) — Excel groups and aggregates
→ Output: a pivot table of "a metric by breakdowns".
Why: get a summary with the mouse, no formulas — it's `GROUP BY` for Excel.
:::

## Why you need it

When you need "revenue by country and month" in a minute, writing `SUMIFS` for each cell is slow. A pivot builds such a table by dragging fields and re-assembles on the fly.

```text title="Source data"
date         country   category      amount
2026-01-05   RU        Electronics   2500
2026-01-12   RU        Books         1800
2026-02-03   KZ        Electronics   4200
2026-02-20   KZ        Books         700
2026-02-25   DE        Electronics   3000
```

## Creating one

1. Select the data (with headers) → the **Insert → PivotTable** tab.
2. Excel offers a new sheet — agree.
3. A panel with four areas appears on the right.

## The four areas

| Area | What we put | Role |
|------|-------------|------|
| **Rows** | `country` | groups vertically |
| **Columns** | `category` | groups horizontally |
| **Values** | `amount` | what we compute (sum/count/average) |
| **Filters** | `date` | filters the whole table |

Drag `country` into rows and `amount` into values and you get:

| country | Sum of amount |
|---------|---------------|
| RU      | 4300          |
| KZ      | 4900          |
| DE      | 3000          |

:::caution[Sum or count?]
Drop a text field into "Values" and Excel computes "Count". Drop a number and it's "Sum". If you see the wrong operation, click the field in the values area → **Value Field Settings** and pick the one you need (Sum, Count, Average, Max…).
:::

## Grouping by dates

Drop `date` into rows, right-click → **Group** → choose "Months"/"Quarters"/"Years". Excel collapses daily dates into the period you want — the basis of "by month" reports.

## Calculated fields

If you need a metric that's not in the data (e.g. average check = sum / count), you don't have to edit the source: **PivotTable Analyze → Fields, Items & Sets → Calculated Field** and define the formula.

## Slicers

A slicer is a button filter on top of the pivot: **Analyze → Insert Slicer**, pick a field (e.g. `country`), and filter the table by clicking. Handy for mini-dashboards; one slicer can be connected to several pivots.

<details>
<summary>1. I want revenue with countries in rows and categories in columns. What goes where?</summary>

`country` → the "Rows" area, `category` → "Columns", `amount` → "Values" (the "Sum" operation). You get a country × category matrix with sums at the intersections.

</details>

<details>
<summary>2. The pivot shows count instead of sum. Why?</summary>

Most likely the field landed in "Values" as text, or the operation is set to "Count". Open the value field settings and switch to "Sum". Also check there's no text among the numbers in the column.

</details>

## What's next

- [Power Query](/en/03-excel/05-power-query-basics/) — prepare and combine data before the pivot.
- [Aggregations in SQL](/en/02-sql/05-aggregations/) — the same `GROUP BY`, but as a query.
