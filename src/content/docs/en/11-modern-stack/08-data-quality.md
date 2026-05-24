---
title: Data quality
description: "Data quality: test types (not null, unique, accepted values, custom), dbt tests, Great Expectations, data observability (Monte Carlo)."
sidebar:
  order: 8
---

:::tip[In short]
Data quality is automated checks that data hasn't "gone stale": keys are unique, no unexpected `NULL`s, values are within an allowed range. Basic tests are built into [dbt](/en/11-modern-stack/05-dbt-basics/) (`unique`, `not_null`, `accepted_values`), deeper — Great Expectations, and continuous monitoring — data observability. Without this, "the dashboard lies and no one knows".
:::

## Why you need it

An analyst's main nightmare is making a decision on broken data (orders doubled, the source sent garbage, a metric silently zeroed). Data tests catch this **automatically**, before the numbers reach a report to leadership. It's part of the engineering maturity of analytics.

## What data quality is

A set of checks and processes ensuring data is **correct, complete and fresh**. Checked across several dimensions: accuracy, completeness, uniqueness, freshness, consistency.

## Test types

| Test | What it checks |
|------|----------------|
| **not_null** | no missing values in a column (e.g. `order_id`) |
| **unique** | values are unique (no key duplication) |
| **accepted_values** | a value from an allowed set (`status ∈ {paid, cancelled, pending}`) |
| **relationships** | referential integrity (every `customer_id` exists in the reference) |
| **custom** | your own business rule (`amount >= 0`, revenue didn't drop 90% in a day) |

`unique` + `not_null` on the primary key catch the most common trouble — [row doubling in joins](/en/02-sql/06-joins/).

## dbt tests

dbt makes tests declarative — you describe them in YAML, run `dbt test`:

```yaml
models:
  - name: orders
    columns:
      - name: order_id
        tests: [unique, not_null]
      - name: status
        tests:
          - accepted_values:
              values: ['paid', 'cancelled', 'pending']
```

Tests run alongside the pipeline ([Airflow](/en/11-modern-stack/06-airflow-basics/)): if data fails a check, the pipeline fails and broken data doesn't reach the dashboard.

**Freshness** is a separate important test: "data no older than N hours". It's declared on the source:

```yaml
sources:
  - name: shop
    tables:
      - name: orders
        loaded_at_field: _loaded_at
        freshness:
          warn_after:  { count: 12, period: hour }   # warn
          error_after: { count: 24, period: hour }   # fail the pipeline
```

Run it with `dbt source freshness`. This catches the most insidious case — tests are green, but **the data just didn't arrive**.

A **custom test** (singular) is a plain SQL file in `tests/` that must return **zero rows**; if it returns rows, the test fails:

```sql
-- tests/assert_amount_non_negative.sql — find the "bad" rows
SELECT order_id FROM {{ ref('orders') }} WHERE amount < 0
```

:::note[Severity: warn vs error]
A test has a level: `error` (default — fails the pipeline) and `warn` (only warns). Critical things (key uniqueness) — `error`; "suspicious but not fatal" (a sharp volume spike) — often `warn`, so the whole load isn't blocked over a minor thing.
:::

## Great Expectations

A separate Python library for deeper and more flexible checks ("expectations"): value distributions, null share, statistical profiles, detailed validation reports. Used when built-in dbt tests aren't enough.

## Data observability

:::tip[Observability — data monitoring, like APM for servers]
Platforms like **Monte Carlo**, Soda, Bigeye monitor data continuously and **automatically** flag anomalies: a table didn't update on time (freshness), the row count spiked, the schema changed, the distribution drifted. Unlike predefined tests, observability catches even what you didn't anticipate. The mature level of data quality.
:::

<details>
<summary>1. Which two tests on the primary key catch the most common join problem?</summary>

`unique` and `not_null` on the key (e.g. `order_id`). They ensure the key is unique and filled — preventing row doubling in joins and "lost" records. The same fan-out trap from SQL: a duplicate in the key inflates sums.

</details>

<details>
<summary>2. dbt tests are all green, but yesterday's dashboard is empty. What might have failed and what helps?</summary>

Tests check what you defined, but they may not have covered **freshness** — the data simply didn't arrive (the source didn't deliver, the pipeline didn't run). A freshness test and data observability (Monte Carlo, etc.) help — they monitor updates and anomalies automatically, including unanticipated cases.

</details>

## What's next

- [dbt](/en/11-modern-stack/05-dbt-basics/) — where declarative tests live.
- [JOINs in SQL](/en/02-sql/06-joins/) — the doubling that unique/not_null tests catch.
