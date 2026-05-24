---
title: Core formulas
description: "Excel formulas for an analyst: IF/IFS, logical AND/OR, SUMIFS, COUNTIFS, AVERAGEIFS, ROUND."
sidebar:
  order: 2
---

:::tip[In short]
The analyst's workhorses in Excel are **`SUMIFS` / `COUNTIFS` / `AVERAGEIFS`**: compute a sum/count/average by conditions (the equivalent of SQL's `GROUP BY ... WHERE`). Plus `IF` for logic and `ROUND` for tidy numbers. This set covers most tasks.
:::

## Why you need it

"How much did we sell in March in the Electronics category?" — that's `SUMIFS`. "How many orders from Russia?" — `COUNTIFS`. These functions replace manual filtering and reduce to one formula what would otherwise be done with the mouse.

```text title="Demo data (A1:D6)"
country  category      status   amount
RU       Electronics   paid     2500
RU       Books         paid     1800
KZ       Electronics   paid     4200
KZ       Books         cancel   700
DE       Electronics   paid     3000
```

## IF and logic

`IF(condition, if_true, if_false)` — branching:

```text
=IF(D2>2000, "large", "small")     → "large"
```

Several conditions — via `IFS` (no nesting) or `AND`/`OR`:

```text
=IFS(D2>=3000,"A", D2>=2000,"B", TRUE,"C")
=IF(AND(C2="paid", D2>2000), "ok", "no")
```

| amount | status | IF(AND...) |
|--------|--------|------------|
| 2500   | paid   | ok         |
| 1800   | paid   | no         |
| 700    | cancel | no         |

## SUMIFS / COUNTIFS / AVERAGEIFS

The main functions. Syntax: first the range to compute over, then "condition range, condition" pairs.

```text
=SUMIFS(D:D, A:A,"RU")                    sum for Russia        → 4300
=SUMIFS(D:D, A:A,"KZ", C:C,"paid")        Kazakhstan and paid   → 4200
=COUNTIFS(A:A,"RU")                        number of RU orders   → 2
=AVERAGEIFS(D:D, B:B,"Electronics")        avg check per category → 3233
```

:::note[SUMIF vs SUMIFS]
The old `SUMIF` takes one condition and a different argument order (`SUMIF(condition_range, condition, sum_range)`). `SUMIFS` supports many conditions and a more convenient order. **Always use `SUMIFS`** — even for a single condition, to avoid confusion.
:::

## Rounding and numbers

```text
=ROUND(D2/3, 2)      round to 2 decimals       → 833.33
=ROUNDUP(...);  =ROUNDDOWN(...)                up / down
=INT(7.9)            drop the fraction         → 7
=MOD(7, 3)           remainder of division     → 1
```

:::caution[Conditions with comparison and wildcards]
In `SUMIFS`/`COUNTIFS` conditions you can write `">2000"`, `"<>paid"`, `"El*"` (the asterisk is any text). Wrap comparisons and patterns in quotes: `COUNTIFS(D:D,">2000")`, not `>2000`.
:::

## When to use what

| Task | Function |
|------|----------|
| Sum by conditions | `SUMIFS` |
| Count by conditions | `COUNTIFS` |
| Average by conditions | `AVERAGEIFS` |
| Branching logic | `IF` / `IFS` |
| Multiple conditions in one `IF` | `AND` / `OR` |

<details>
<summary>1. How to compute revenue only for paid orders from Kazakhstan?</summary>

`=SUMIFS(D:D, A:A,"KZ", C:C,"paid")`. The first argument is what we sum (amount), then "condition column, value" pairs. Answer on the demo data: 4200.

</details>

<details>
<summary>2. Why is `SUMIFS` more convenient than `SUMIF`?</summary>

`SUMIFS` supports multiple conditions and has a logical argument order (the sum range first). `SUMIF` allows only one condition and a reversed order. To avoid juggling two syntaxes, use `SUMIFS` everywhere.

</details>

## What's next

- [Lookups](/en/03-excel/03-lookups/) — pull a value from another table by key.
- [Pivot tables](/en/03-excel/04-pivot-tables/) — the same aggregates, but with the mouse and interactively.
