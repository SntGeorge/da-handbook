---
title: Common patterns
description: "Top analyst SQL patterns: RFM, cohorts, retention, running totals, gaps-and-islands — where everything comes together."
sidebar:
  order: 16
---

:::tip[In short]
Here are ready-made "recipes" an analyst writes constantly. All build on what we've covered: [CTEs](/en/02-sql/08-cte/) + [window functions](/en/02-sql/09-window-functions/) + [dates](/en/02-sql/10-dates-and-strings/).

- **RFM** — segmenting customers by recency/frequency/monetary.
- **Cohorts + retention** — how many users come back over time.
- **Running total / moving average** — cumulative totals and smoothing.
- **Gaps-and-islands** — grouping consecutive events (sessions, streaks).
:::

## Why you need it

This isn't new syntax but an **assembly** of what you've learned into typical business tasks. These exact patterns are asked in interviews and written at work every week.

```sql title="Demo data (orders with dates)"
CREATE TABLE orders (
    order_id    int,
    customer_id int,
    created_at  date,
    amount      numeric
);

INSERT INTO orders VALUES
    (101,1,'2026-01-05',2500),(102,1,'2026-02-10',1800),
    (103,2,'2026-01-20',990), (104,3,'2026-01-25',4200),
    (105,3,'2026-03-01',700), (106,1,'2026-03-15',1200);
```

## Running total and moving average

A cumulative revenue total over time and smoothing spikes with a window average:

```sql
SELECT created_at, amount,
       SUM(amount) OVER (ORDER BY created_at) AS running_total,
       ROUND(AVG(amount) OVER (ORDER BY created_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)) AS moving_avg_3
FROM orders;
```

| created_at | amount | running_total | moving_avg_3 |
|------------|--------|---------------|--------------|
| 2026-01-05 | 2500   | 2500          | 2500         |
| 2026-01-20 | 990    | 3490          | 1745         |
| 2026-01-25 | 4200   | 7690          | 2563         |
| 2026-02-10 | 1800   | 9490          | 2330         |
| …          | …      | …             | …            |

## Top-N per group

"Each customer's most expensive order" — `ROW_NUMBER` + `PARTITION BY` in a CTE:

```sql
WITH ranked AS (
    SELECT customer_id, order_id, amount,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
    FROM orders
)
SELECT customer_id, order_id, amount FROM ranked WHERE rn = 1;
```

## RFM segmentation

RFM splits customers along three axes: **R**ecency (how recently they bought), **F**requency (how often), **M**onetary (how much money). Compute the metrics and bucket with quantiles (`NTILE`):

```sql
WITH rfm AS (
    SELECT customer_id,
           CURRENT_DATE - MAX(created_at) AS recency_days,
           COUNT(*)                       AS frequency,
           SUM(amount)                    AS monetary
    FROM orders
    GROUP BY customer_id
)
SELECT customer_id, recency_days, frequency, monetary,
       NTILE(3) OVER (ORDER BY recency_days)      AS r,   -- fewer days is better
       NTILE(3) OVER (ORDER BY frequency DESC)    AS f,
       NTILE(3) OVER (ORDER BY monetary  DESC)    AS m
FROM rfm;
```

| customer_id | frequency | monetary | r | f | m |
|-------------|-----------|----------|---|---|---|
| 1           | 3         | 5500     | 1 | 1 | 1 |
| 3           | 2         | 4900     | 2 | 2 | 2 |
| 2           | 1         | 990      | 3 | 3 | 3 |

Segment `111` are the best customers (recent, frequent, big spenders), `333` are dormant. In practice segments are grouped into "Champions", "At risk", "Lost".

## Cohort analysis and retention

A cohort is a group of users by the month of their **first** purchase. Retention is how many of them came back in later months.

```sql
WITH first_month AS (   -- month of first purchase = cohort
    SELECT customer_id,
           DATE_TRUNC('month', MIN(created_at))::date AS cohort
    FROM orders GROUP BY customer_id
),
activity AS (           -- months a customer was active in
    SELECT DISTINCT customer_id,
           DATE_TRUNC('month', created_at)::date AS month
    FROM orders
)
SELECT f.cohort,
       a.month,
       COUNT(DISTINCT a.customer_id) AS active
FROM first_month f
JOIN activity a ON a.customer_id = f.customer_id
GROUP BY f.cohort, a.month
ORDER BY f.cohort, a.month;
```

| cohort     | month      | active |
|------------|------------|--------|
| 2026-01-01 | 2026-01-01 | 3      |
| 2026-01-01 | 2026-02-01 | 1      |
| 2026-01-01 | 2026-03-01 | 2      |

This is the "long" format of a cohort table; in a dashboard it's pivoted into a "cohort × lifetime month" matrix via `CASE`/pivot. More on the metric in [Product Analytics](/en/08-product-analytics/04-cohort-analysis/).

## Gaps-and-islands (sessions, streaks)

A classic trick: group **consecutive** events (user sessions, streaks of purchase days). The trick — "row number minus value" gives a constant label for a consecutive group.

```sql
-- group a customer's purchases into "streaks" of consecutive months
WITH m AS (
    SELECT DISTINCT customer_id,
           EXTRACT(MONTH FROM created_at)::int AS mon
    FROM orders
),
grp AS (
    SELECT customer_id, mon,
           mon - ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY mon) AS island
    FROM m
)
SELECT customer_id, MIN(mon) AS streak_start, MAX(mon) AS streak_end, COUNT(*) AS len
FROM grp
GROUP BY customer_id, island;
```

If the months are consecutive (1,2,3), the difference `mon - row_number` is the same → they land in one "island". A gap creates a new island.

:::note[The main takeaway]
Almost any "advanced" analytical task = a CTE (break into steps) + window functions (ranks/totals/neighbors) + dates (`DATE_TRUNC`). Master these three and you cover most real tasks.
:::

## Practice tasks

<details>
<summary>1. Month-over-month revenue growth (% vs the previous month).</summary>

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', created_at)::date AS m, SUM(amount) AS rev
    FROM orders GROUP BY 1
)
SELECT m, rev,
       ROUND((rev - LAG(rev) OVER (ORDER BY m)) * 100.0
             / LAG(rev) OVER (ORDER BY m)) AS mom_pct
FROM monthly;
```

`LAG` takes the previous month's revenue; compute the percent change.

</details>

<details>
<summary>2. Each customer's share of total revenue.</summary>

```sql
SELECT customer_id, SUM(amount) AS rev,
       ROUND(SUM(amount) * 100.0 / SUM(SUM(amount)) OVER ()) AS pct
FROM orders GROUP BY customer_id;
```

The window `SUM(SUM(amount)) OVER ()` sums the already-grouped sums across the whole result.

</details>

## What's next

- [Interview tasks](/en/02-sql/17-interview-tasks/) — cement these patterns on real tasks.
- [Product Analytics](/en/08-product-analytics/) — RFM, cohorts and retention from the product side.

**Practice:** [StrataScratch](https://www.stratascratch.com/) — FAANG interview tasks; [LeetCode SQL](https://leetcode.com/problemset/database/) (hard).
