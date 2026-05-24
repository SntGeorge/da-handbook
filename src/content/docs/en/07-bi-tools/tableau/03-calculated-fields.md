---
title: Calculated fields
description: "Calculated fields in Tableau: creation, function types, quick table calculations and custom table calcs (running total, % of total)."
sidebar:
  order: 3
---

:::tip[In short]
A calculated field is a new quantity from a formula: margin, share, a flag. Separately stand **table calculations** — they're computed **over the data already shown in the table** (running total, % of total, rank) and depend on the direction of computation.
:::

## Why you need it

Data rarely has the exact metric you need ready-made. Calculated fields let you compute it right in Tableau without touching the source: profit = revenue − cost, conversion, amount categorization.

## Creating one

Right-click in the Data pane → **Create Calculated Field**. The formula syntax resembles Excel/SQL:

```
// margin
[Sales] - [Cost]

// large-order flag
IF [Sales] > 2000 THEN "large" ELSE "small" END

// share (caution: this is not a table calc)
[Profit] / [Sales]
```

## Function types

| Group | Examples |
|-------|----------|
| Arithmetic | `+ - * /`, `ROUND`, `ABS` |
| Logic | `IF/THEN/ELSE`, `CASE`, `IIF` |
| Strings | `LEFT`, `MID`, `CONTAINS`, `SPLIT` |
| Dates | `DATEDIFF`, `DATEPART`, `DATETRUNC`, `TODAY` |
| Aggregates | `SUM`, `AVG`, `COUNTD` (distinct) |

## Quick table calculations

Table calculations operate on the **result** already on the sheet. The quick way: right-click a measure on a shelf → **Quick Table Calculation**:

- **Running Total** — cumulative total.
- **Percent of Total** — share of the sum.
- **Difference** — difference from the previous.
- **Rank** — rank.
- **Moving Average** — moving average.

:::caution[A table calc depends on direction (Compute Using)]
A table calculation is computed "along" the table, and the result depends on **which direction** it moves (Compute Using: Table across / down / Pane). The same "% of Total" gives different numbers with different directions. If the figures are odd — first check Compute Using.
:::

## Custom table calculations

For fine control people use the `WINDOW_*` and `LOOKUP`/`INDEX` functions:

```
// share of total, manually
SUM([Sales]) / TOTAL(SUM([Sales]))

// comparison with the previous period
SUM([Sales]) - LOOKUP(SUM([Sales]), -1)
```

This is the analog of [SQL window functions](/en/02-sql/09-window-functions/): they compute relative to a "window" of rows rather than collapsing the data.

## Regular field vs table calculation

| | Calculated field | Table calculation |
|--|------------------|-------------------|
| When computed | at the source's row/aggregate level | over data already shown on the sheet |
| Example | `[Sales]-[Cost]` | running total, % of total, rank |
| Depends on the table layout | no | yes (direction) |

<details>
<summary>1. You need a cumulative revenue total by month. Regular field or table calc?</summary>

A table calculation (Running Total): the cumulative total is computed over the per-month values already on the sheet, not at the source's row level. Check the direction (Compute Using) so the total accumulates along time, not across it.

</details>

<details>
<summary>2. "% of Total" shows the wrong shares. Where to start diagnosing?</summary>

With the computation direction (Compute Using / Table across vs down vs Pane). Table calculations compute along the table, and the wrong direction gives wrong shares. It's the most common cause of "strange" percentages.

</details>

## What's next

- [LOD expressions](/en/07-bi-tools/tableau/04-lod-expressions/) — computations at a different level of detail.
- [SQL window functions](/en/02-sql/09-window-functions/) — the related idea of running total and rank.
