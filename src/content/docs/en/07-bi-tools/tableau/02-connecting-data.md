---
title: Connecting data
description: "Connecting Tableau to files and databases, Live vs Extract, joins inside Tableau, data blending and relationships (2020.2+)."
sidebar:
  order: 2
---

:::tip[In short]
Tableau connects to files and databases in two modes: **Live** (queries the source in real time) and **Extract** (a dump into a fast local `.hyper`). You can combine tables three ways: **relationships** (recommended, flexible), **joins** (hard combine) and **blending** (linking already-aggregated sources).
:::

## Why you need it

A dashboard is only as good as how the data is connected. The Live/Extract choice affects speed, and the way you combine tables affects correctness (you can accidentally [double sums](/en/02-sql/06-joins/), just like in SQL).

## Connecting to a source

- **File**: CSV, Excel, JSON, `.hyper`.
- **Database**: PostgreSQL, MySQL, Snowflake, BigQuery and dozens of connectors.
- **Cloud**: Google Sheets, analytics servers.

## Live vs Extract

| Mode | How it works | When |
|------|--------------|------|
| **Live** | queries the source each time | you need fresh data in real time |
| **Extract** | data dumped into a local `.hyper` | speed, offline, offloading the DB |

:::note[Extract is usually faster]
`.hyper` is Tableau's columnar engine, optimized for analytics. An Extract often works noticeably faster than Live, especially on a slow DB, and doesn't load production. The downside — the data isn't "live", it needs refreshing. For dashboards refreshed once a day, Extract is the standard choice.
:::

## Joins inside Tableau

A classic join of tables by key — the same `inner`/`left`/`right`/`outer` as in [SQL](/en/02-sql/06-joins/). A join happens at the row level **before** aggregation:

:::caution[A join can double measures]
If you join tables one-to-many (orders × line items), rows multiply, and `SUM` over the parent table doubles. This is the same trap as in SQL and pandas. The fix — relationships (below) or aggregating before the join.
:::

## Relationships (Tableau 2020.2+)

The modern and recommended way. Unlike a hard join, a **relationship** doesn't combine rows in advance — Tableau itself picks the right join type for each specific chart and keeps the correct level of detail without doubling measures. When in doubt, use relationships, not joins.

## Data blending

Blending links **two separate sources** at the aggregate level (not rows). Used when tables are from different databases and can't be combined directly: e.g. sales from PostgreSQL and a plan from Excel. It works on a common key field, but is slower and more limited than relationships.

## What to choose

| Situation | Method |
|-----------|--------|
| Tables from one source | Relationships |
| Need explicit control of the join type | Join |
| Data from different sources | Blending |

<details>
<summary>1. The dashboard lags on a live connection to a loaded DB. What to do?</summary>

Switch to Extract: dump the data into a local `.hyper`. It uses Tableau's fast columnar engine, works offline and doesn't load the prod database. Set up a refresh schedule to match the needed data freshness.

</details>

<details>
<summary>2. After joining the orders table with line items, revenue doubled. Why and what to do?</summary>

The one-to-many join multiplied the order's rows by the number of line items, and `SUM(amount)` doubled. The fix — use relationships (Tableau keeps the correct level of detail) or aggregate line items before the join. It's the same fan-out trap as in SQL.

</details>

## What's next

- [Calculated fields](/en/07-bi-tools/tableau/03-calculated-fields/) — compute metrics on the fly.
- [JOINs in SQL](/en/02-sql/06-joins/) — the same join logic and doubling.
