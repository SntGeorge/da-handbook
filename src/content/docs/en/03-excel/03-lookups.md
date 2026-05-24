---
title: Lookups
description: "VLOOKUP, XLOOKUP and INDEX/MATCH in Excel: how to pull data from another table, pitfalls and what to choose."
sidebar:
  order: 3
---

:::tip[In short]
A lookup means "pull a value from another table by key" (the equivalent of a SQL `JOIN`). The modern choice is **`XLOOKUP`**: simpler and free of the old `VLOOKUP` limitations. If `XLOOKUP` isn't available (old Excel) — use the **`INDEX` + `MATCH`** combo.
:::

## Why you need it

You have an orders table with `customer_id` and a separate customer reference. A lookup substitutes the customer name into each order by `id`. Without it you'd search by hand — impossible across thousands of rows.

```text title="Reference (G:H)"
id   name
1    Anna
2    Boris
3    Kira
```

## VLOOKUP — the classic with caveats

`VLOOKUP(what, where, column_number, 0)`. The last argument `0` (or FALSE) is an exact match, which is almost always what you want.

```text
=VLOOKUP(A2, G:H, 2, 0)     for the id in A2 returns the name   → "Anna"
```

:::caution[VLOOKUP's three traps]
1. **Searches only to the right** — the key must be in the leftmost column of the range. It can't look left.
2. **The column number is a number** — insert a column into the table and `3` starts pointing to the wrong place.
3. **A forgotten `0`** at the end turns on "approximate match" and silently returns garbage. Always put `0`.
:::

## XLOOKUP — the modern replacement

`XLOOKUP(what, where_to_search, what_to_return)` — separate ranges for the key and result, exact match by default, can search left:

```text
=XLOOKUP(A2, G:G, H:H)                returns the name by id     → "Anna"
=XLOOKUP(A2, G:G, H:H, "not found")   with a fallback on a miss
```

No fragile "column number", reads more clearly. If your Excel/Sheets version has it — use it.

## INDEX + MATCH — when there's no XLOOKUP

`MATCH` finds the key's position, `INDEX` retrieves the value at that position. Works in any direction and doesn't break on inserted columns:

```text
=INDEX(H:H, MATCH(A2, G:G, 0))        → "Anna"
```

`MATCH(A2, G:G, 0)` returns the row number with the wanted id, `INDEX(H:H, ...)` — the name from that row.

## What to choose

| Situation | Solution |
|-----------|----------|
| Modern Excel 365 / Sheets | `XLOOKUP` |
| Old Excel without XLOOKUP | `INDEX` + `MATCH` |
| Need to search left | `XLOOKUP` or `INDEX/MATCH` (not `VLOOKUP`) |
| Key not found — need a fallback | `XLOOKUP(..., "—")` or `IFERROR(...)` |

<details>
<summary>1. Why can't `VLOOKUP` find a value to the left of the key?</summary>

`VLOOKUP` always searches for the key in the first (left) column of the range and returns a column to the right by number. It structurally can't look left. The fix is `XLOOKUP` or `INDEX/MATCH`, where the key and result ranges are independent.

</details>

<details>
<summary>2. What does VLOOKUP return if you forget the last argument `0`?</summary>

It enables approximate match (assuming a sorted list) and the formula may silently return a wrong value instead of an error. So for an exact lookup always specify `0` (FALSE) explicitly.

</details>

## What's next

- [Pivot tables](/en/03-excel/04-pivot-tables/) — aggregate data without formulas.
- [JOINs in SQL](/en/02-sql/06-joins/) — the same "glue tables by key" principle, but in the database.
