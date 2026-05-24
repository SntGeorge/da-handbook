---
title: Filtering operators
description: "BETWEEN, IN, NOT IN, LIKE, ILIKE, IS NULL — handy WHERE operators and their NULL pitfalls."
sidebar:
  order: 4
---

:::tip[In short]
On top of `=`/`>`/`<` there are handy filtering operators:

- `BETWEEN a AND b` — an **inclusive** range.
- `IN (...)` — "equals any value in the list".
- `LIKE` / `ILIKE` — pattern matching (`%` — any characters, `_` — one).
- `IS NULL` / `IS NOT NULL` — a check for emptiness.

Main trap: `= NULL` **doesn't work**, and `NOT IN` with a `NULL` silently returns nothing. Details below.
:::

## Why you need it

These operators make `WHERE` shorter and more readable. Instead of `amount >= 1000 AND amount <= 5000` you write `amount BETWEEN 1000 AND 5000`. But `NULL` has its own logic — and that's exactly where data gets lost.

```sql title="Demo data"
CREATE TABLE customers (
    customer_id int PRIMARY KEY,
    name        text,
    country     text,
    phone       text          -- some don't have one (NULL)
);

INSERT INTO customers VALUES
    (1, 'Anna',  'RU', '+7 900 111'),
    (2, 'Boris', 'RU', NULL),
    (3, 'Kira',  'KZ', '+7 701 222'),
    (4, 'Lev',   'DE', NULL),
    (5, 'Mia',   'US', '+1 415 333');
```

## BETWEEN: inclusive range

```sql
SELECT customer_id, name
FROM customers
WHERE customer_id BETWEEN 2 AND 4;
```

| customer_id | name  |
|-------------|-------|
| 2           | Boris |
| 3           | Kira  |
| 4           | Lev   |

:::note[Boundaries are included]
`BETWEEN 2 AND 4` means `2 <= x AND x <= 4`, i.e. **both** bounds are included. For dates this is a common bug source: `BETWEEN '2026-01-01' AND '2026-01-31'` misses events on the 31st after midnight. Safer: `>= '2026-01-01' AND < '2026-02-01'`.
:::

## IN: "equals any value in the list"

```sql
SELECT name, country
FROM customers
WHERE country IN ('RU', 'KZ');
```

| name  | country |
|-------|---------|
| Anna  | RU      |
| Boris | RU      |
| Kira  | KZ      |

`country IN ('RU', 'KZ')` is shorter than `country = 'RU' OR country = 'KZ'`.

## LIKE and ILIKE: pattern matching

`%` — any number of any characters, `_` — exactly one character.

```sql
-- phones starting with "+7"
SELECT name, phone
FROM customers
WHERE phone LIKE '+7%';
```

| name | phone      |
|------|------------|
| Anna | +7 900 111 |
| Kira | +7 701 222 |

`LIKE` is case-sensitive. In PostgreSQL there's `ILIKE` — case-insensitive: `name ILIKE 'a%'` matches both "Anna" and "anna".

## IS NULL: checking for emptiness

`NULL` means "value unknown", not "empty" and not "zero". Any comparison with `NULL` using `=`, `<>`, `<` yields not `true`/`false` but `NULL` (≈ "unknown"), and the row doesn't make it into the result.

```sql
-- ❌ this WON'T find customers without a phone — returns 0 rows
SELECT name FROM customers WHERE phone = NULL;

-- ✅ correct
SELECT name FROM customers WHERE phone IS NULL;
```

| name  |
|-------|
| Boris |
| Lev   |

## Main trap: NOT IN and NULL

If a `NULL` ends up in a `NOT IN` list, the query silently returns **zero rows** — even where data exists. This is one of the nastiest SQL mistakes.

```sql
-- if the subquery returns even one NULL, the result is empty
SELECT name FROM customers
WHERE country NOT IN ('US', NULL);   -- ← returns 0 rows, not "everyone except US"
```

Reason: `NOT IN (a, b)` expands to `<> a AND <> b`, and `<> NULL` = `NULL`, which "breaks" the whole condition. The fix — filter `NULL` out beforehand or use `NOT EXISTS` (see [Subqueries](/en/02-sql/07-subqueries/)).

:::caution[Remember about NULL]
- A comparison with `NULL` always yields "unknown" → the row is dropped.
- `COUNT(column)` doesn't count `NULL`, while `COUNT(*)` counts all rows.
- A `NULL` in `NOT IN` nukes the result. In analytics this quietly eats data — check for it.
:::

<details>
<summary>1. Customers who have a phone number.</summary>

```sql
SELECT name FROM customers WHERE phone IS NOT NULL;
```

Anna, Kira, Mia.

</details>

<details>
<summary>2. Customers from RU or KZ with a known phone.</summary>

```sql
SELECT name, country, phone
FROM customers
WHERE country IN ('RU', 'KZ') AND phone IS NOT NULL;
```

Anna and Kira (Boris's phone is NULL).

</details>

<details>
<summary>3. Why does `WHERE country NOT IN ('US', NULL)` return nothing?</summary>

`NOT IN (a, b)` = `country <> a AND country <> b`. The comparison `country <> NULL` always yields `NULL`, so the whole condition never becomes `true`. Remove `NULL` from the list or use `NOT EXISTS`.

</details>

## What's next

- [Aggregations](/en/02-sql/05-aggregations/) — `GROUP BY`, `COUNT`, `SUM` and how `NULL` behaves in aggregates.
- [CASE and conditionals](/en/02-sql/12-case-and-conditionals/) — `COALESCE` to replace `NULL` with a default.

**Practice:** [SQLBolt](https://sqlbolt.com/) and [LeetCode SQL](https://leetcode.com/problemset/database/) — plenty of tasks on filtering and `NULL`.
