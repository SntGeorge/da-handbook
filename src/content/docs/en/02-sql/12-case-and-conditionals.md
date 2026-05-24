---
title: CASE and conditionals
description: "CASE WHEN, COALESCE, NULLIF, GREATEST/LEAST — conditional logic in SQL and pivoting with CASE."
sidebar:
  order: 12
---

:::tip[In short]
`CASE` is `if/else` inside SQL: return different values depending on a condition.

```sql
CASE WHEN amount >= 3000 THEN 'big'
     WHEN amount >= 1000 THEN 'medium'
     ELSE 'small' END
```

Plus short helpers: `COALESCE` (first non-`NULL`), `NULLIF` (turn a value into `NULL`), `GREATEST`/`LEAST` (max/min of the arguments).
:::

## Why you need it

`CASE` builds categories and labels: amount segments, flags, buckets. And `COALESCE` heals `NULL` (substitutes 0 or "not set"). Both appear in almost every analytical query.

```sql title="Demo data"
INSERT INTO orders VALUES
    (101,1,'paid',2500),(102,1,'paid',1800),
    (103,2,'cancelled',990),(104,3,'paid',4200),(105,3,'paid',700);
```

## CASE: searched and simple

The **searched** `CASE` (with conditions) is the most common:

```sql
SELECT order_id, amount,
       CASE WHEN amount >= 3000 THEN 'big'
            WHEN amount >= 1000 THEN 'medium'
            ELSE 'small' END AS bucket
FROM orders;
```

| order_id | amount | bucket |
|----------|--------|--------|
| 101      | 2500   | medium |
| 102      | 1800   | medium |
| 103      | 990    | small  |
| 104      | 4200   | big    |
| 105      | 700    | small  |

The **simple** `CASE` (comparing one value) is shorter when you check equality:

```sql
CASE status WHEN 'paid' THEN 'paid'
            WHEN 'cancelled' THEN 'cancelled'
            ELSE status END
```

:::note[Conditions are checked in order]
`CASE` takes the **first** matching `WHEN`. So order matters: put the narrower/higher conditions first. If none match and there's no `ELSE` — it returns `NULL`.
:::

## CASE in SELECT, WHERE, ORDER BY

`CASE` is an expression, you can put it anywhere. For example, custom sorting (paid on top):

```sql
SELECT order_id, status
FROM orders
ORDER BY CASE status WHEN 'paid' THEN 0 ELSE 1 END, order_id;
```

## Pivoting with CASE

A classic trick — "rotate" rows into columns: compute sums per status in one row. `SUM(CASE WHEN ... THEN amount END)`:

```sql
SELECT
    SUM(CASE WHEN status = 'paid'      THEN amount ELSE 0 END) AS paid,
    SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) AS cancelled
FROM orders;
```

| paid  | cancelled |
|-------|-----------|
| 9200  | 990       |

This is the basis of pivot reports: statuses/categories become columns.

## COALESCE: first non-NULL

`COALESCE(a, b, c)` returns the first value that isn't `NULL`. Used for default values:

```sql
-- if no phone is set — show a placeholder
SELECT name, COALESCE(phone, 'not set') AS phone FROM customers;
```

A common case is `COALESCE(SUM(amount), 0)`, to get 0 instead of `NULL` when there are no rows.

## NULLIF, GREATEST, LEAST

- `NULLIF(a, b)` — returns `NULL` if `a = b` (otherwise `a`). The main use is **protection against division by zero**:

```sql
SELECT revenue / NULLIF(orders_count, 0) AS avg_check FROM ...;
-- if orders_count = 0, the divisor becomes NULL, and you get NULL instead of an error
```

- `GREATEST(a, b, ...)` / `LEAST(a, b, ...)` — max/min **of the arguments in a row** (not over a column, like `MAX`/`MIN`):

```sql
SELECT GREATEST(price, min_price) AS final_price FROM ...;
```

:::caution[NULL eats CASE and arithmetic]
Any arithmetic with `NULL` yields `NULL` (`100 + NULL = NULL`). If your data has gaps — wrap in `COALESCE(col, 0)` before computing, otherwise the metric "collapses" into `NULL`.
:::

<details>
<summary>1. Put each order into an amount bucket and count how many in each.</summary>

```sql
SELECT CASE WHEN amount >= 3000 THEN 'big'
            WHEN amount >= 1000 THEN 'medium'
            ELSE 'small' END AS bucket,
       COUNT(*) AS cnt
FROM orders
GROUP BY 1;
```

You can group directly by the `CASE` expression (or by its position in `SELECT` — `GROUP BY 1`).

</details>

<details>
<summary>2. Conversion: share of paid orders (without division by zero).</summary>

```sql
SELECT ROUND(
    SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(*), 0)
) AS paid_pct
FROM orders;
```

`SUM(CASE ...)` counts the paid ones; `NULLIF(COUNT(*), 0)` guards against division by zero.

</details>

<details>
<summary>3. How does GREATEST differ from MAX?</summary>

`MAX(col)` is an aggregate: the maximum **across rows** of one column (it collapses rows). `GREATEST(a, b, c)` is the maximum **of several values in one row** (across columns); it doesn't collapse rows.

</details>

## What's next

- [Common patterns](/en/02-sql/16-common-patterns/) — pivoting with `CASE` and segmentation are the basis of RFM and cohorts.
- [Filtering operators](/en/02-sql/04-filtering-operators/) — more on `NULL` behavior.

**Practice:** [LeetCode SQL](https://leetcode.com/problemset/database/) — tasks tagged *Conditional* and pivot; [StrataScratch](https://www.stratascratch.com/).
