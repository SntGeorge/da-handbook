---
title: Dates and strings
description: "Working with dates (EXTRACT, DATE_TRUNC, INTERVAL) and strings (SUBSTRING, REPLACE, concatenation, type casting)."
sidebar:
  order: 10
---

:::tip[In short]
Dates and strings are an analyst's daily grind: "revenue by month", "events in the last 7 days", "extract the domain from an email".

- `DATE_TRUNC('month', ts)` — round a date to the start of the month (grouping by periods).
- `EXTRACT(YEAR FROM ts)` — pull out a part of the date.
- `ts - INTERVAL '7 days'` — date arithmetic.
- `||` or `CONCAT` — concatenate strings; `SUBSTRING`, `REPLACE`, `LOWER` — text processing.
- `value::type` — cast a type (`'2026-01-01'::date`).
:::

:::note[Data flow]
Input: date and text columns
→ Processing: date functions (`DATE_TRUNC`, `EXTRACT`, intervals) and string ones (`SUBSTRING`, `LOWER`, `LIKE`) cast/slice the values
→ Output: the time slices you need and cleaned/parsed text.
Why: "by month", "last 30 days", normalizing and parsing strings.
:::

## Why you need it

Raw data is almost always "dirty": dates in different formats, phones with spaces, emails in mixed case. Plus any time-based report is grouping by days/months. Without dates and strings you can't build a single metric.

```sql title="Demo data"
CREATE TABLE events (
    user_id int,
    email   text,
    ts      timestamp
);

INSERT INTO events VALUES
    (1, 'Anna@Mail.RU',    '2026-01-05 10:30'),
    (1, 'Anna@Mail.RU',    '2026-01-20 14:00'),
    (2, 'boris@gmail.com', '2026-02-03 09:15');
```

## Date/time types

| Type | What it stores |
|------|----------------|
| `date` | date only (2026-01-05) |
| `timestamp` | date and time without a zone |
| `timestamptz` | date, time and time zone (recommended for events) |

`CURRENT_DATE`, `NOW()` — the current date and moment in time.

## DATE_TRUNC and EXTRACT

`DATE_TRUNC` "truncates" a date to the start of a period — the basis of grouping by months/weeks:

```sql
SELECT DATE_TRUNC('month', ts)::date AS month, COUNT(*) AS events
FROM events
GROUP BY 1
ORDER BY 1;
```

| month      | events |
|------------|--------|
| 2026-01-01 | 2      |
| 2026-02-01 | 1      |

`EXTRACT` pulls out a single part (year, month, day of week):

```sql
SELECT EXTRACT(YEAR FROM ts) AS y, EXTRACT(MONTH FROM ts) AS m
FROM events;
```

## INTERVAL: date arithmetic

```sql
-- events in the last 30 days
SELECT * FROM events
WHERE ts >= NOW() - INTERVAL '30 days';

-- how many days between events
SELECT user_id, MAX(ts)::date - MIN(ts)::date AS days_span
FROM events GROUP BY user_id;
```

| user_id | days_span |
|---------|-----------|
| 1       | 15        |
| 2       | 0         |

:::caution[Date boundaries and BETWEEN]
For a period, a half-open interval `>= start AND < next_period_start` is safer than `BETWEEN`. `BETWEEN '2026-01-01' AND '2026-01-31'` misses events on the 31st after midnight (a `timestamp` that day > `'2026-01-31 00:00'`). Write `>= '2026-01-01' AND < '2026-02-01'`.
:::

## String functions

| Function | What it does | Example → result |
|----------|--------------|------------------|
| `LOWER` / `UPPER` | case | `LOWER('Mail') → mail` |
| `LENGTH` | length | `LENGTH('Anna') → 4` |
| `TRIM` | strip edge spaces | `TRIM(' x ') → x` |
| `SUBSTRING` | cut a piece | `SUBSTRING('abcde', 2, 3) → bcd` |
| `POSITION` | find position | `POSITION('@' IN email)` |
| `REPLACE` | replace | `REPLACE('a-b','-','_') → a_b` |
| `\|\|` / `CONCAT` | concatenate | `'a' \|\| 'b' → ab` |

A practical example — extract the domain from an email and lowercase it:

```sql
SELECT DISTINCT
    LOWER(SUBSTRING(email FROM POSITION('@' IN email) + 1)) AS domain
FROM events;
```

| domain    |
|-----------|
| mail.ru   |
| gmail.com |

## Type casting

Cast a value to the needed type — with the `::` operator (PostgreSQL) or `CAST(... AS ...)`:

```sql
SELECT '2026-01-01'::date,        -- string → date
       '42'::int,                 -- string → number
       amount::text               -- number → string
FROM orders LIMIT 1;
```

:::note[Regular expressions]
PostgreSQL has `~` (regex match) and `REGEXP_REPLACE`. Handy for complex cleaning: `REGEXP_REPLACE(phone, '\D', '', 'g')` strips everything but digits from a phone.
:::

<details>
<summary>1. Number of events by week.</summary>

```sql
SELECT DATE_TRUNC('week', ts)::date AS week, COUNT(*) AS events
FROM events
GROUP BY 1
ORDER BY 1;
```

`DATE_TRUNC('week', ...)` rounds to the Monday of the week.

</details>

<details>
<summary>2. Normalize the email: lowercase, no spaces.</summary>

```sql
SELECT DISTINCT LOWER(TRIM(email)) AS email_norm FROM events;
```

`Anna@Mail.RU` → `anna@mail.ru`. Useful before deduplicating users.

</details>

<details>
<summary>3. Why does `WHERE ts BETWEEN '2026-01-01' AND '2026-01-31'` lose data?</summary>

`'2026-01-31'` without a time is treated as `2026-01-31 00:00:00`, so events on the 31st after midnight fall outside the range. Use `ts >= '2026-01-01' AND ts < '2026-02-01'`.

</details>

## What's next

- [CASE and conditionals](/en/02-sql/12-case-and-conditionals/) — `COALESCE` to substitute values for `NULL`.
- [Window functions](/en/02-sql/09-window-functions/) — month-over-month and time trends.

**Practice:** [PostgreSQL docs: Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html) — the reference; date tasks are on [LeetCode SQL](https://leetcode.com/problemset/database/).
