---
title: ClickHouse
description: "ClickHouse: a columnar OLAP database, the MergeTree engine, ARRAY JOIN, materialized views, why it's so popular in the CIS."
sidebar:
  order: 4
---

:::tip[In short]
ClickHouse is a super-fast open-source columnar OLAP database created at Yandex. Tuned for **analytical queries at scale** (billions of rows in seconds). At its heart is the **MergeTree** engine family. It appears very often in CIS postings, so knowing its basics is especially useful here.
:::

## Why you need it

In the CIS ClickHouse is almost a standard for product analytics (used by Yandex and many companies around it). If you're job-hunting here, there's a good chance you'll work with it rather than Snowflake/BigQuery. This is [noted in the stack overview](/en/00-intro/market-stack-2026/).

## Why ClickHouse: OLAP at scale

ClickHouse is incredibly fast on aggregates over huge data thanks to columnar storage, compression and vectorized execution. The typical scenario is event analytics: billions of rows of logs/clicks needing fast `GROUP BY`.

:::caution[ClickHouse isn't for frequent UPDATE/DELETE]
It's an OLAP engine: brilliant at reads and batch inserts, but **pointwise UPDATE/DELETE are expensive and asynchronous** (via `ALTER ... UPDATE`, "mutations"). Don't use ClickHouse as a regular transactional application DB — that's what [OLTP](/en/11-modern-stack/01-cloud-dwh-overview/) is for. It's for analytics, not "update the order status".
:::

## MergeTree engine

The main table family. The idea: data is written in parts that merge in the background, and stored sorted by the **sorting key** (`ORDER BY` in the DDL):

```sql
CREATE TABLE events (
    event_date Date,
    user_id UInt64,
    event_type String,
    amount Float64
) ENGINE = MergeTree()
ORDER BY (event_date, user_id);     -- sorting key = fast range queries
```

Sorting by the key gives fast range lookups and works as a primary index. People often add monthly partitioning (`PARTITION BY toYYYYMM(event_date)`).

MergeTree has **engine variants** for different tasks — they "collapse" rows with the same sorting key differently during background merges:

| Engine | What it does on merge | When |
|--------|-----------------------|------|
| **MergeTree** | nothing, keeps all rows | raw events |
| **ReplacingMergeTree** | keeps the latest version per key | deduplication, "latest state" |
| **SummingMergeTree** | sums numeric columns by key | pre-aggregates |
| **AggregatingMergeTree** | stores aggregate states | complex precomputations with MVs |

:::caution["Collapsing" doesn't happen immediately]
ReplacingMergeTree removes duplicates only during a background merge of parts — the timing isn't controllable. To reliably see the collapsed result in a query, add the `FINAL` modifier (`SELECT ... FROM t FINAL`) — but it's slow, don't overuse it on large data.
:::

## ARRAY JOIN

ClickHouse can store **arrays** in a cell (e.g. a list of items in an order). `ARRAY JOIN` "unfolds" the array into rows — the unnest analog:

```sql
SELECT user_id, item
FROM orders
ARRAY JOIN items AS item;     -- one row with [a,b,c] → three rows
```

Handy for event data where attributes arrive as lists.

## Materialized views

In ClickHouse a **materialized view** works like an insert trigger: when data is written to the source table, it automatically computes an aggregate and stores it in another table. This way "revenue by day" is computed on the fly, and dashboards read a small ready result instead of recomputing over billions of rows.

```sql
-- the MV computes daily revenue right as new events are inserted
CREATE MATERIALIZED VIEW revenue_daily_mv
ENGINE = SummingMergeTree()
ORDER BY day AS
SELECT toDate(event_date) AS day, sum(amount) AS revenue
FROM events
GROUP BY day;
```

Now the dashboard reads the tiny `revenue_daily_mv` (one row per day) instead of aggregating billions of `events` rows every time it opens.

## Practice tasks

<details>
<summary>1. The team wants to store orders with frequent status updates in ClickHouse. Good idea?</summary>

A bad one. ClickHouse is an OLAP engine, pointwise UPDATEs are expensive and asynchronous (mutations). Frequent status updates are an OLTP load, needing a transactional DB (PostgreSQL). Keep ClickHouse for event analytics: fast reads and batch inserts, not row-by-row updates.

</details>

<details>
<summary>2. Why a materialized view in ClickHouse?</summary>

To compute aggregates ahead of time, at insert. An MV works like a trigger: new rows in the source table are automatically aggregated into a target (e.g. revenue by day). Dashboards then read a small pre-computed result instead of a heavy recompute over billions of rows on every query.

</details>

## What's next

- [dbt](/en/11-modern-stack/05-dbt-basics/) — data transformations as code.
- [Market stack 2026](/en/00-intro/market-stack-2026/) — why ClickHouse matters so much in the CIS.
