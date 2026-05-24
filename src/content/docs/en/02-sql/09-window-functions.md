---
title: Window functions
description: "ROW_NUMBER, RANK, LAG/LEAD, aggregate OVER, PARTITION BY, window frames, running totals and top-N per group."
sidebar:
  order: 9
---

:::tip[In short]
A window function computes a value **over a group of rows without collapsing them** (unlike `GROUP BY`). Each row stays, with an aggregate/rank added alongside.

```sql
SELECT order_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS customer_total
FROM orders;
```

`PARTITION BY` — which groups to split into, `ORDER BY` inside `OVER` — the order (for ranks and running totals). This is the most common topic in middle-level interviews.
:::

## Why you need it

`GROUP BY` answers "how much in total per customer" but loses the individual orders. Window functions give you **both**: you see each order AND its share/rank/sum per customer. Hence — running totals, "top-N per category", "difference from the previous month".

```sql title="Demo data"
INSERT INTO orders VALUES
    (101,1,'RU','paid',2500),(102,1,'RU','paid',1800),
    (104,3,'KZ','paid',4200),(105,3,'KZ','paid',700),(106,4,'DE','paid',3000);
```

## Anatomy: OVER (...)

```sql
function() OVER (PARTITION BY ... ORDER BY ...)
```

- `PARTITION BY` — splits rows into groups (like `GROUP BY`, but without collapsing). No `PARTITION BY` → one window over the whole table.
- `ORDER BY` inside `OVER` — sets the order within the window (needed by ranks, `LAG`, running totals).

```sql
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS by_customer
FROM orders;
```

| order_id | customer_id | amount | by_customer |
|----------|-------------|--------|-------------|
| 101      | 1           | 2500   | 4300        |
| 102      | 1           | 1800   | 4300        |
| 104      | 3           | 4200   | 4900        |
| 105      | 3           | 700    | 4900        |
| 106      | 4           | 3000   | 3000        |

The per-customer sum is stamped into **every** row — the rows didn't collapse.

## Ranks: ROW_NUMBER, RANK, DENSE_RANK

Three numbering functions; the difference is how they treat equal values:

```sql
SELECT order_id, amount,
       ROW_NUMBER() OVER (ORDER BY amount DESC) AS rn,
       RANK()       OVER (ORDER BY amount DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY amount DESC) AS dense
FROM orders;
```

| amount | rn | rnk | dense |
|--------|----|----|-------|
| 4200   | 1  | 1  | 1     |
| 3000   | 2  | 2  | 2     |
| 2500   | 3  | 3  | 3     |
| 1800   | 4  | 4  | 4     |
| 700    | 5  | 5  | 5     |

- `ROW_NUMBER` — always a unique number 1,2,3… (even on ties).
- `RANK` — equal values get the same rank, then it "jumps": 1,2,2,**4**.
- `DENSE_RANK` — equal get the same, with no gaps: 1,2,2,**3**.

## LAG and LEAD: neighboring rows

`LAG` — the value from the **previous** row of the window, `LEAD` — from the **next**. Essential for "difference from the prior period", "user's next event".

```sql
SELECT order_id, amount,
       LAG(amount) OVER (ORDER BY order_id)  AS prev_amount,
       amount - LAG(amount) OVER (ORDER BY order_id) AS diff
FROM orders;
```

| order_id | amount | prev_amount | diff  |
|----------|--------|-------------|-------|
| 101      | 2500   | NULL        | NULL  |
| 102      | 1800   | 2500        | -700  |
| 104      | 4200   | 1800        | 2400  |
| 105      | 700    | 4200        | -3500 |
| 106      | 3000   | 700         | 2300  |

### Other useful functions

- `FIRST_VALUE(x)` / `LAST_VALUE(x)` — the first/last value in the window (e.g. a customer's first order, shown in each of their rows).
- `NTH_VALUE(x, n)` — the n-th value.
- `NTILE(k)` — split the window's rows into `k` equal groups (used for percentiles and [RFM segmentation](/en/02-sql/16-common-patterns/)).

:::caution[LAST_VALUE and the frame]
`LAST_VALUE` with `ORDER BY` defaults to the "up to the current row" frame, so it often returns not what you expect (the current row, not the end of the window). To get the true last value, set the frame explicitly: `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.
:::

## Aggregates as window + frame

`SUM/AVG/COUNT ... OVER (ORDER BY ...)` with an order turn into a **running total**. By default the frame is "from the start of the window to the current row".

```sql
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_id) AS running_total
FROM orders;
```

| order_id | amount | running_total |
|----------|--------|---------------|
| 101      | 2500   | 2500          |
| 102      | 1800   | 4300          |
| 104      | 4200   | 8500          |
| 105      | 700    | 9200          |
| 106      | 3000   | 12200         |

The `ROWS BETWEEN` frame controls a sliding window — e.g. the average over the last 3 rows (moving average):

```sql
AVG(amount) OVER (ORDER BY order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
```

:::caution[ORDER BY in OVER changes the meaning]
Without `ORDER BY` inside `OVER`, the aggregate is computed over the **whole** window (one number per partition). With `ORDER BY`, the "up to the current row" frame kicks in → you get a running total. A common surprise: you added `ORDER BY` for looks — and `SUM` became a running total.
:::

## Top-N per group

A classic interview task: "the most expensive order in each country". Solved with `ROW_NUMBER` and `PARTITION BY` inside a CTE:

```sql
WITH ranked AS (
    SELECT order_id, country, amount,
           ROW_NUMBER() OVER (PARTITION BY country ORDER BY amount DESC) AS rn
    FROM orders
)
SELECT order_id, country, amount
FROM ranked
WHERE rn = 1;
```

| order_id | country | amount |
|----------|---------|--------|
| 101      | RU      | 2500   |
| 104      | KZ      | 4200   |
| 106      | DE      | 3000   |

:::note[Where windows aren't allowed]
Window functions can't be used in `WHERE` (they're computed after filtering). So a filter by rank is moved into a CTE/subquery and filtered from outside — as above with `WHERE rn = 1`.
:::

<details>
<summary>1. Each order's share of its customer's revenue (in percent).</summary>

```sql
SELECT order_id, customer_id, amount,
       ROUND(amount * 100.0 / SUM(amount) OVER (PARTITION BY customer_id)) AS pct
FROM orders;
```

The window `SUM(amount) OVER (PARTITION BY customer_id)` gives the customer's total in each row; divide by it.

</details>

<details>
<summary>2. The second-largest order in each country.</summary>

```sql
WITH ranked AS (
    SELECT order_id, country, amount,
           DENSE_RANK() OVER (PARTITION BY country ORDER BY amount DESC) AS rnk
    FROM orders
)
SELECT * FROM ranked WHERE rnk = 2;
```

</details>

<details>
<summary>3. How does ROW_NUMBER differ from RANK on equal values?</summary>

`ROW_NUMBER` always gives unique 1,2,3,4 (equal values get different numbers arbitrarily). `RANK` gives equals one rank and skips the next ones (1,2,2,4); `DENSE_RANK` skips nothing (1,2,2,3). For a "strict top-1 without duplicates", use `ROW_NUMBER`.

</details>

## What's next

- [Common patterns](/en/02-sql/16-common-patterns/) — retention, cohorts, RFM are built on windows.
- [Dates and strings](/en/02-sql/10-dates-and-strings/) — time windows (month-over-month) go together with dates.

**Practice:** [StrataScratch](https://www.stratascratch.com/) and [LeetCode SQL](https://leetcode.com/problemset/database/) (hard) — window functions appear in every other task.
