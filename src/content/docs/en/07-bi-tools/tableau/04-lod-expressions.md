---
title: LOD expressions
description: "Level of Detail in Tableau: FIXED, INCLUDE, EXCLUDE — why they're needed, how they differ, and real-work examples."
sidebar:
  order: 4
---

:::tip[In short]
LOD expressions (Level of Detail) set their **own level of detail** for a computation, independent of what's on the shelves. The main one — **`FIXED`**: it computes an aggregate over the specified dimensions, ignoring the rest of the breakdown. Needed for tasks like "a customer's share of total revenue" or "average check per customer" inside a more granular chart.
:::

## Why you need it

A regular measure is computed at the level of detail on the sheet. But you often need an aggregate at a **different** level: e.g. show orders by day, but alongside — the total for the whole customer. LOD solves this without breaking the visualization.

## Why LOD specifically

Without LOD you'd need a separate sheet or tricky table calcs. LOD computes "sideways" at the needed level right in one field:

- "How much a customer spent in total" — regardless of the current breakdown by dates.
- "A customer's first order date" — for cohorts.
- "Average revenue per customer", not per row.

## FIXED

`FIXED` fixes the dimensions to compute over, **ignoring the breakdown filters** on the sheet:

```
{ FIXED [Customer ID] : SUM([Sales]) }
```

→ for each row it substitutes the customer's total sum, even if the sheet breaks down by day. Then you can compute a share:

```
SUM([Sales]) / ATTR({ FIXED [Customer ID] : SUM([Sales]) })
```

## INCLUDE and EXCLUDE

Unlike `FIXED`, they work **relative** to the sheet's current level:

- **`INCLUDE`** — add a dimension to the computation, even if it's not on the shelves. Example: average check per customer, shown by region — `{ INCLUDE [Customer ID] : SUM([Sales]) }`, then averaged.
- **`EXCLUDE`** — remove a dimension from the computation. Example: a category's share within the region's total, excluding the category itself.

| Type | Computation level |
|------|-------------------|
| `FIXED` | strictly by the specified dimensions (ignores the sheet) |
| `INCLUDE` | the sheet's level + the specified dimensions |
| `EXCLUDE` | the sheet's level − the specified dimensions |

:::caution[FIXED and filters: order matters]
`FIXED` is computed **before** regular dimension filters (but after context filters). So a dashboard filter may not affect a `FIXED` computation the way you expect. If you need the filter to act on FIXED, make it a **context filter**.
:::

## A real-work example

Task: on a chart of orders by day, show which customers spent more than 10,000 in total.

```
// the customer's total sum, regardless of the daily split
{ FIXED [Customer ID] : SUM([Sales]) } > 10000
```

You can drop this flag field into a filter — and the daily chart keeps only the "large" customers in full.

<details>
<summary>1. The chart shows sales by day, but you need each day's share of the customer's total revenue. With what?</summary>

The LOD `FIXED` by customer: `{ FIXED [Customer ID] : SUM([Sales]) }` gives the customer's sum regardless of the daily breakdown. Dividing the daily sum by it gives the day's share. A regular measure can't do this — it's computed at the sheet's level (day).

</details>

<details>
<summary>2. How does FIXED differ from INCLUDE?</summary>

`FIXED` computes strictly by the listed dimensions, ignoring what's on the sheet's shelves. `INCLUDE` takes the sheet's level of detail and **adds** the specified dimensions to it. So FIXED is absolute, INCLUDE/EXCLUDE are relative to the current visualization.

</details>

## What's next

- [Parameters and filters](/en/07-bi-tools/tableau/05-parameters-filters/) — filter order (important for FIXED).
- [Calculated fields](/en/07-bi-tools/tableau/03-calculated-fields/) — regular computations vs LOD.
