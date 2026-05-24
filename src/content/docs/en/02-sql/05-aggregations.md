---
title: Aggregations
description: "GROUP BY, HAVING, COUNT/SUM/AVG/MIN/MAX, NULL behavior and the difference between WHERE and HAVING."
sidebar:
  order: 5
---

:::tip[In short]
Aggregate functions collapse many rows into one number: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

- `GROUP BY` — compute the aggregate **separately for each group** (e.g. per customer).
- `WHERE` filters rows **before** grouping, `HAVING` filters groups **after**.
- In `SELECT` without `GROUP BY` you can output only aggregates; with `GROUP BY` — only the `GROUP BY` columns plus aggregates.
:::

:::note[Data flow]
Input: many rows (orders)
→ Processing: `GROUP BY` splits into groups → an aggregate (`SUM`/`COUNT`/`AVG`) collapses each → `HAVING` filters groups
→ Output: a "metric by group" table.
Why: turn raw rows into summary numbers (revenue by country, average check).
:::

## Why you need it

Analytics is almost always aggregates: "how many orders", "average order value", "revenue by country". `GROUP BY` turns a table of rows into a table of metrics.

```sql title="Demo data"
CREATE TABLE orders (
    order_id    int PRIMARY KEY,
    customer_id int,
    country     text,
    status      text,
    amount      numeric
);

INSERT INTO orders VALUES
    (101, 1, 'RU', 'paid',      2500),
    (102, 1, 'RU', 'paid',      1800),
    (103, 2, 'RU', 'cancelled',  990),
    (104, 3, 'KZ', 'paid',      4200),
    (105, 3, 'KZ', 'paid',       700),
    (106, 4, 'DE', 'paid',      3000);
```

## Aggregate functions

| Function | What it counts |
|----------|----------------|
| `COUNT(*)` | number of rows |
| `COUNT(col)` | number of **non-NULL** values in the column |
| `COUNT(DISTINCT col)` | number of unique values |
| `SUM(col)` | sum |
| `AVG(col)` | average |
| `MIN` / `MAX` | minimum / maximum |

Without `GROUP BY` the aggregate is computed over the whole table and returns one row:

```sql
SELECT COUNT(*) AS orders, SUM(amount) AS revenue, ROUND(AVG(amount)) AS avg_check
FROM orders
WHERE status = 'paid';
```

| orders | revenue | avg_check |
|--------|---------|-----------|
| 5      | 12200   | 2440      |

## GROUP BY: aggregate per group

`GROUP BY country` computes the aggregate separately for each country:

```sql
SELECT country, COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY country
ORDER BY revenue DESC;
```

| country | orders | revenue |
|---------|--------|---------|
| KZ      | 2      | 4900    |
| RU      | 2      | 4300    |
| DE      | 1      | 3000    |

:::caution[The GROUP BY rule]
When grouping, `SELECT` may output **only** the `GROUP BY` columns and aggregates. You can't write `SELECT country, amount ... GROUP BY country` — there are many `amount` values per group and the database doesn't know which to show (PostgreSQL errors; MySQL silently returns a random one — which is worse).
:::

## COUNT(*) vs COUNT(col): careful with NULL

`COUNT(*)` counts all rows. `COUNT(col)` skips `NULL`. These are different numbers, and it's a common mistake:

```sql
SELECT
    COUNT(*)              AS all_orders,     -- all orders
    COUNT(DISTINCT customer_id) AS customers -- unique customers
FROM orders;
```

| all_orders | customers |
|------------|-----------|
| 6          | 4         |

## WHERE vs HAVING

`WHERE` filters **rows before** grouping. `HAVING` filters **groups after** — and there you can use aggregates.

```sql
-- countries with more than one paid order
SELECT country, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'      -- first drop non-paid rows
GROUP BY country
HAVING COUNT(*) > 1;       -- then keep only groups with >1 order
```

| country | orders |
|---------|--------|
| KZ      | 2      |
| RU      | 2      |

```mermaid
flowchart LR
    A["FROM"] --> B["WHERE<br/>(rows)"] --> C["GROUP BY"] --> D["HAVING<br/>(groups)"] --> E["SELECT"] --> F["ORDER BY"]
```

:::note[Which one]
A condition on a "raw" column (`status = 'paid'`) → `WHERE` (faster, filters earlier). A condition on an aggregate (`COUNT(*) > 1`, `SUM(amount) > 10000`) → `HAVING`.
:::

## Advanced aggregates

Three tricks that often save time in reports.

**`FILTER (WHERE ...)`** — compute an aggregate over only some rows, without piling up `CASE` (PostgreSQL):

```sql
SELECT
    COUNT(*) FILTER (WHERE status = 'paid')      AS paid,
    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
    SUM(amount) FILTER (WHERE status = 'paid')   AS paid_revenue
FROM orders;
```

| paid | cancelled | paid_revenue |
|------|-----------|--------------|
| 5    | 1         | 12200        |

**`STRING_AGG`** (in MySQL — `GROUP_CONCAT`) — glue a group's values into one string:

```sql
SELECT country, STRING_AGG(order_id::text, ', ' ORDER BY order_id) AS order_ids
FROM orders
GROUP BY country;
```

| country | order_ids       |
|---------|-----------------|
| RU      | 101, 102, 103   |
| KZ      | 104, 105        |
| DE      | 106             |

**`ROLLUP`** — add a subtotal/grand-total row to the grouping. The total row has `NULL` in the grouped column:

```sql
SELECT country, SUM(amount) AS revenue
FROM orders
GROUP BY ROLLUP(country);
```

| country | revenue |
|---------|---------|
| RU      | 5290    |
| KZ      | 4900    |
| DE      | 3000    |
| NULL    | 13190   |

:::note[The GROUPING SETS family]
`ROLLUP(a, b)` gives hierarchical subtotals (by `a,b`, by `a`, grand total). `CUBE(a, b)` — totals over **all** combinations. `GROUPING SETS (...)` — specify the slices you want manually. Handy for pivot reports "by country, by status and overall" in a single query.
:::

<details>
<summary>1. Revenue and order count per customer (paid only).</summary>

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
ORDER BY revenue DESC;
```

</details>

<details>
<summary>2. Customers who spent more than 3000 in total.</summary>

```sql
SELECT customer_id, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(amount) > 3000;
```

Customer 3 (4900). Customer 1 (4300) also qualifies. A condition on an aggregate → `HAVING`.

</details>

<details>
<summary>3. What's the difference between `COUNT(*)` and `COUNT(customer_id)`?</summary>

`COUNT(*)` counts all rows. `COUNT(customer_id)` counts only rows where `customer_id` is not `NULL`. If there are no `NULL`s in that column, the numbers match; if there are, `COUNT(customer_id)` is smaller.

</details>

## What's next

- [JOINs](/en/02-sql/06-joins/) — aggregates over data from several tables (and how not to double your sums).
- [Window functions](/en/02-sql/09-window-functions/) — aggregates without collapsing rows (e.g. each order's share of total revenue).

**Practice:** [LeetCode SQL](https://leetcode.com/problemset/database/) — filter by the *Aggregation* tag; on [sql-ex.ru](https://sql-ex.ru/) the `GROUP BY` tasks start around #15.
