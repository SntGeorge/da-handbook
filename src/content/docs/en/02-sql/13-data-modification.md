---
title: Modifying data
description: "INSERT, UPDATE, DELETE, UPSERT (ON CONFLICT), TRUNCATE and transactions — how to change data safely."
sidebar:
  order: 13
---

:::tip[In short]
Three data-modification commands (DML): `INSERT` (add), `UPDATE` (change), `DELETE` (remove).

- `INSERT ... SELECT` — insert a query's result.
- `UPDATE ... WHERE` / `DELETE ... WHERE` — **always with `WHERE`**, or you hit the whole table.
- `INSERT ... ON CONFLICT` — upsert (insert or update).
- Wrap risky changes in a **transaction** (`BEGIN ... COMMIT/ROLLBACK`).
:::

## Why you need it

An analyst mostly reads data, but sometimes needs to change it too: prepare a data mart, fix dirty values, populate a test table. Here the cost of a mistake is higher — an `UPDATE` without `WHERE` silently overwrites the whole table.

```sql title="Demo data"
CREATE TABLE customers (
    customer_id int PRIMARY KEY,
    name        text,
    country     text,
    bonus       int DEFAULT 0
);

INSERT INTO customers (customer_id, name, country) VALUES
    (1, 'Anna', 'RU'), (2, 'Boris', 'RU'), (3, 'Kira', 'KZ');
```

## INSERT

List columns explicitly — that way the insert won't break when the schema changes:

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (4, 'Lev', 'DE');

-- several rows at once
INSERT INTO customers (customer_id, name, country)
VALUES (5, 'Mia', 'US'), (6, 'Nick', 'GB');
```

`INSERT ... SELECT` populates a table with a query's result — the basis for data marts:

```sql
INSERT INTO vip_customers (customer_id, name)
SELECT customer_id, name FROM customers WHERE bonus > 1000;
```

## UPDATE

```sql
UPDATE customers
SET bonus = 500
WHERE country = 'RU';
```

:::danger[UPDATE/DELETE without WHERE = the whole table]
`UPDATE customers SET bonus = 500;` without `WHERE` updates **every** row. A habit: first write a `SELECT` with the same `WHERE`, confirm it picks the right rows, and only then change `SELECT` to `UPDATE`/`DELETE`.
:::

`UPDATE` with data from another table (PostgreSQL syntax — `FROM`):

```sql
UPDATE orders o
SET status = 'vip'
FROM customers c
WHERE c.customer_id = o.customer_id AND c.bonus > 1000;
```

## DELETE and TRUNCATE

```sql
DELETE FROM customers WHERE customer_id = 6;   -- delete specific rows
```

| Command | What it does | Rollback |
|---------|--------------|----------|
| `DELETE FROM t WHERE ...` | deletes rows by condition | yes (in a transaction) |
| `DELETE FROM t` | deletes all rows, one by one | yes, but slow |
| `TRUNCATE t` | instantly clears the whole table | fast, but no row-by-row rollback |

`TRUNCATE` — when you need to quickly clear a whole table (e.g. before reloading a data mart). `DELETE` — when removing by condition.

## UPSERT: INSERT ... ON CONFLICT

"Insert, and if the key already exists — update". Essential for idempotent data loading:

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (1, 'Anna', 'AM')
ON CONFLICT (customer_id)
DO UPDATE SET country = EXCLUDED.country;   -- updates Anna's country to 'AM'
```

`EXCLUDED` is the row you tried to insert. In standard SQL and in Snowflake/BigQuery the equivalent is the `MERGE` command.

## Transactions in plain terms

A transaction is "all or nothing": a set of changes applied entirely or rolled back entirely.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- commit; or ROLLBACK — cancel everything
```

If something fails between the two `UPDATE`s — `ROLLBACK` restores everything, and the money isn't "lost". Transaction properties are described by the acronym **ACID** (atomicity, consistency, isolation, durability).

:::tip[A safe update]
Before a mass change: `BEGIN;` → run the `UPDATE` → `SELECT` to verify the result → `COMMIT` (if good) or `ROLLBACK` (if not). That way a mistake doesn't become irreversible.
:::

<details>
<summary>1. Grant a bonus of 300 to all customers from Kazakhstan.</summary>

```sql
-- first check who it affects:
SELECT * FROM customers WHERE country = 'KZ';
-- then change:
UPDATE customers SET bonus = 300 WHERE country = 'KZ';
```

</details>

<details>
<summary>2. Load a customer so a repeated run doesn't create a duplicate.</summary>

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (3, 'Kira', 'KZ')
ON CONFLICT (customer_id) DO NOTHING;
```

`ON CONFLICT DO NOTHING` makes the insert idempotent — a repeated run won't break anything.

</details>

<details>
<summary>3. How does TRUNCATE differ from DELETE without WHERE?</summary>

Both clear the table, but `TRUNCATE` does it instantly (not row-by-row), resets auto-increment counters and usually doesn't log every row. `DELETE` removes row-by-row, is slower but more flexible (can use `WHERE`) and rolls back more gracefully.

</details>

## What's next

- [Indexes and optimization](/en/02-sql/14-indexes-optimization/) — why mass `UPDATE`s can be slow and how to diagnose it.
- [CTEs](/en/02-sql/08-cte/) — for complex `INSERT ... SELECT` with upfront data prep.

**Practice:** [PostgreSQL docs: INSERT](https://www.postgresql.org/docs/current/sql-insert.html) — on `ON CONFLICT`; transactions — [the MVCC chapter](https://www.postgresql.org/docs/current/mvcc.html).
