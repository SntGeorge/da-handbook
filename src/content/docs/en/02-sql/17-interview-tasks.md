---
title: Interview tasks
description: "Real SQL interview tasks with solutions: second-highest salary, top-N per group, retention, median, duplicates, sessions."
sidebar:
  order: 17
---

:::tip[In short]
A set of typical DA interview tasks — from junior to senior. **Solve it yourself** first, then open the solution. All are solvable with the section's tools: `GROUP BY`, subqueries, [CTEs](/en/02-sql/08-cte/), [window functions](/en/02-sql/09-window-functions/).
:::

## Data for the tasks

```sql title="Demo data"
CREATE TABLE employees (id int, name text, dept text, salary int);
INSERT INTO employees VALUES
    (1,'Anna','Analytics',120),(2,'Boris','Analytics',150),
    (3,'Kira','Analytics',150),(4,'Lev','Sales',90),(5,'Mia','Sales',200);

CREATE TABLE logins (user_id int, login_date date);
INSERT INTO logins VALUES
    (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-06'),
    (2,'2026-01-01'),(2,'2026-01-02');
```

## Task 1 (junior): second-highest salary

> Find the second-highest salary in the company. Note there can be several maximums.

<details>
<summary>Solution</summary>

The naive `MAX(salary) WHERE salary < MAX(...)` is fragile. `DENSE_RANK` is more robust (equal salaries get one rank):

```sql
WITH ranked AS (
    SELECT DISTINCT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT salary FROM ranked WHERE rnk = 2;
```

Salaries: 200, 150, 150, 120, 90. `DENSE_RANK`: 200→1, 150→2, 120→3. Answer: **150**. `DENSE_RANK` handles the duplicate 150 correctly, unlike `ROW_NUMBER`.

</details>

## Task 2 (junior/middle): top-N per group

> Output the top-2 employees by salary in each department.

<details>
<summary>Solution</summary>

`ROW_NUMBER` with `PARTITION BY dept`, filter by rank in a CTE (a window can't go in `WHERE`):

```sql
WITH ranked AS (
    SELECT name, dept, salary,
           ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
    FROM employees
)
SELECT name, dept, salary FROM ranked WHERE rn <= 2;
```

| name  | dept      | salary |
|-------|-----------|--------|
| Boris | Analytics | 150    |
| Kira  | Analytics | 150    |
| Mia   | Sales     | 200    |
| Lev   | Sales     | 90     |

If you need **all** on a tie (not exactly 2) — use `RANK`/`DENSE_RANK` instead of `ROW_NUMBER`.

</details>

## Task 3 (middle): N-day retention

> Of the users who logged in on day X, how many came back the next day?

<details>
<summary>Solution</summary>

A self-join on `login_date + 1` (or `LEAD`). Via self-join:

```sql
SELECT a.login_date AS day,
       COUNT(DISTINCT b.user_id) AS retained_next_day
FROM logins a
LEFT JOIN logins b
       ON b.user_id = a.user_id
      AND b.login_date = a.login_date + 1
GROUP BY a.login_date
ORDER BY a.login_date;
```

User 1 logged in Jan 1,2,3,6 → returned the day after the 1st and 2nd. Between the 3rd and 6th there's a gap. This is the basis for retention curves (see [Product Analytics](/en/08-product-analytics/05-retention-curves/)).

</details>

## Task 4 (middle/senior): gaps-and-islands

> For each user, find the longest streak of **consecutive** login days.

<details>
<summary>Solution</summary>

The "date minus row number" trick: for consecutive dates the difference is constant → it's the "island" label.

```sql
WITH g AS (
    SELECT user_id, login_date,
           login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS island
    FROM logins
),
streaks AS (
    SELECT user_id, island, COUNT(*) AS len
    FROM g GROUP BY user_id, island
)
SELECT user_id, MAX(len) AS longest_streak
FROM streaks GROUP BY user_id;
```

For user 1, days 1,2,3 form one island (len=3), day 6 another (len=1). Answer: 3.

</details>

## Task 5 (senior): median without MEDIAN()

> Compute the median salary without using `PERCENTILE_CONT`/`MEDIAN`.

<details>
<summary>Solution</summary>

Number rows ascending and descending; the median is where the numbers "meet" (for even n — the average of the two central values):

```sql
WITH r AS (
    SELECT salary,
           ROW_NUMBER() OVER (ORDER BY salary)      AS asc_n,
           ROW_NUMBER() OVER (ORDER BY salary DESC) AS desc_n,
           COUNT(*) OVER ()                          AS total
    FROM employees
)
SELECT AVG(salary) AS median
FROM r
WHERE asc_n IN (desc_n, desc_n + 1, desc_n - 1);
```

The central row is where `asc_n ≈ desc_n`. `AVG` averages one or two central values. (If your database supports it — in production, of course, `PERCENTILE_CONT(0.5)` is simpler.)

</details>

## Task 6 (senior): user sessions

> Split logins into sessions: a new session starts when more than 30 minutes pass between a user's events.

<details>
<summary>Solution</summary>

(On `timestamp` data.) `LAG` fetches the previous event; the "new session" flag = a gap > 30 min; a running sum of flags gives the session number:

```sql
WITH e AS (
    SELECT user_id, ts,
           LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) AS prev_ts
    FROM events
),
flagged AS (
    SELECT user_id, ts,
           CASE WHEN prev_ts IS NULL
                  OR ts - prev_ts > INTERVAL '30 minutes'
                THEN 1 ELSE 0 END AS is_new_session
    FROM e
)
SELECT user_id, ts,
       SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY ts) AS session_id
FROM flagged;
```

The "flag + running sum" pattern (sessionization) is common in interviews at product companies.

</details>

## How to solve it in an interview

:::note[Algorithm]
1. **Clarify the data**: granularity, duplicates, `NULL`s, what each row means.
2. **Talk through the approach out loud** before coding — the interviewer evaluates your thinking, not typing speed.
3. **Break into steps with CTEs** — readable and easy to debug piece by piece.
4. **Check edge cases**: empty groups, equal values, `NULL`, division by zero.
:::

## What's next

- [Technical interview](/en/12-career/05-technical-interview/) — the theory asked alongside the tasks.
- [Common patterns](/en/02-sql/16-common-patterns/) — if some trick from the tasks above is unclear.

**Practice:** [StrataScratch](https://www.stratascratch.com/) (real interviews), [LeetCode SQL](https://leetcode.com/problemset/database/), [DataLemur](https://datalemur.com/) — tasks built for DA interviews.
