---
title: Subqueries
description: "Scalar, IN, EXISTS, correlated subqueries — when to use which and how to fix duplicates after a JOIN."
sidebar:
  order: 7
---

:::tip[In short]
A subquery is a `SELECT` inside another query. Kinds:

- **Scalar** — returns a single value (usable in `SELECT` or `WHERE`).
- **`IN (SELECT ...)`** — "is in the list from the subquery".
- **`EXISTS (SELECT ...)`** — "is there at least one row" (often faster and safer than `IN`).
- **Correlated** — references the outer query, runs for each row.

A common analyst trick: first collapse data with a subquery, then join — to kill duplicates.
:::

:::note[Data flow]
Input: table(s)
→ Processing: an inner query computes an intermediate result → the outer query uses it (in `WHERE`/`FROM`/`SELECT`, including correlated)
→ Output: the final table.
Why: build the answer in two steps when a single flat query can't express it.
:::

## Why you need it

Subqueries answer "two-step" questions: first compute something intermediate, then use it. "Orders above average", "customers without orders", "an order's share of total revenue" — all subqueries.

```sql title="Demo data"
-- the same schema as in the section (see Environment setup)
INSERT INTO customers VALUES (1,'Anna','RU'),(2,'Boris','RU'),(3,'Kira','KZ'),(4,'Lev','DE');
INSERT INTO orders VALUES
    (101,1,'paid',2500),(102,1,'paid',1800),
    (103,2,'cancelled',990),(104,3,'paid',4200),(105,9,'paid',700);
```

## Scalar subquery

Returns exactly one value. Handy to compare each row against an aggregate over the whole table:

```sql
-- orders above the average order value
SELECT order_id, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);
```

The average `amount` = (2500+1800+990+4200+700)/5 = 2038. Above it:

| order_id | amount |
|----------|--------|
| 101      | 2500   |
| 104      | 4200   |

A scalar subquery can also go in `SELECT` — e.g. compute each order's share of total revenue:

```sql
SELECT order_id,
       amount,
       ROUND(amount * 100.0 / (SELECT SUM(amount) FROM orders)) AS pct
FROM orders
WHERE status = 'paid';
```

| order_id | amount | pct |
|----------|--------|-----|
| 101      | 2500   | 26  |
| 102      | 1800   | 19  |
| 104      | 4200   | 44  |
| 105      | 700    | 7   |

## IN with a subquery

`IN (SELECT ...)` — filter by a list that is itself computed by a query:

```sql
-- customers who have paid orders
SELECT name
FROM customers
WHERE customer_id IN (SELECT customer_id FROM orders WHERE status = 'paid');
```

| name |
|------|
| Anna |
| Kira |

:::caution[NOT IN + NULL = empty]
If a subquery in `NOT IN` returns even one `NULL`, the whole result becomes empty (see [Filtering operators](/en/02-sql/04-filtering-operators/)). So for "find without a match", `NOT EXISTS` is safer.
:::

## EXISTS / NOT EXISTS

`EXISTS` checks whether **at least one row** exists in the subquery — no matter which. Often faster than `IN` (the database stops at the first match) and doesn't break on `NULL`.

```sql
-- customers with NO orders at all
SELECT name
FROM customers c
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.customer_id = c.customer_id
);
```

| name |
|------|
| Lev  |

Inside `EXISTS` you write `SELECT 1` — specific columns aren't needed, only the fact that a row exists.

## Correlated subquery

This is a subquery that **references the outer** query (`o.customer_id = c.customer_id` above) and runs anew for each outer row. Powerful, but slow on large data — essentially a loop.

```sql
-- each customer's latest (max id) order
SELECT c.name,
       (SELECT MAX(o.order_id) FROM orders o WHERE o.customer_id = c.customer_id) AS last_order
FROM customers c;
```

| name  | last_order |
|-------|------------|
| Anna  | 102        |
| Boris | 103        |
| Kira  | 104        |
| Lev   | NULL       |

:::note[A correlated subquery ≈ a window function]
The same thing is often more elegant and faster with [window functions](/en/02-sql/09-window-functions/) (`MAX() OVER (PARTITION BY ...)`). If you see a correlated subquery in `SELECT` — think about a window.
:::

## Subquery vs JOIN: fixing duplicates

The main practical use: collapse the "many" side in a subquery **before** joining, so you don't double your sums (recall fan-out from [JOINs](/en/02-sql/06-joins/)).

```sql
-- ✅ first aggregate order_items per order, then join — no duplicates
SELECT o.order_id, o.amount, items.cnt
FROM orders o
JOIN (
    SELECT order_id, SUM(qty) AS cnt
    FROM order_items
    GROUP BY order_id
) AS items ON items.order_id = o.order_id;
```

Such a subquery in `FROM` is called a **derived table**. When you have many of them or they're nested — switch to [CTEs](/en/02-sql/08-cte/) (`WITH`); it reads far better.

<details>
<summary>1. Customers whose total spend is higher than customer #2's.</summary>

```sql
SELECT customer_id, SUM(amount) AS total
FROM orders
GROUP BY customer_id
HAVING SUM(amount) > (
    SELECT SUM(amount) FROM orders WHERE customer_id = 2
);
```

The scalar subquery computes the threshold (customer 2's total = 990), and `HAVING` compares against it.

</details>

<details>
<summary>2. Products that were never ordered.</summary>

```sql
SELECT title
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM order_items oi WHERE oi.product_id = p.product_id
);
```

`NOT EXISTS` is safer than `NOT IN` — it won't break if `order_items` contains a `NULL`.

</details>

<details>
<summary>3. Why is EXISTS often faster than IN?</summary>

`EXISTS` stops at the first row found (only the fact of existence matters), whereas `IN` may materialize the subquery's whole list of values. Also `EXISTS`/`NOT EXISTS` handle `NULL` correctly, while `NOT IN` doesn't.

</details>

## What's next

- [CTEs](/en/02-sql/08-cte/) — the same subqueries, but named and readable (`WITH`), plus recursion.
- [Window functions](/en/02-sql/09-window-functions/) — a replacement for correlated subqueries and "rankings".

**Practice:** [LeetCode SQL](https://leetcode.com/problemset/database/) has many `EXISTS`/subquery tasks; [StrataScratch](https://www.stratascratch.com/) — tasks from real interviews.
