---
title: dbt — basics
description: "dbt: data transformations as code — models, sources, seeds, materializations (view/table/incremental), tests, Jinja, dbt Cloud vs Core."
sidebar:
  order: 5
---

:::tip[In short]
dbt turns DWH transformations into **code, like developers'**: a model is a `SELECT` in a `.sql` file, and dbt builds tables/views from them, resolves dependencies, tests and documents. It's the **T (Transform)** layer in ELT: raw data is already in the warehouse, dbt makes clean marts from it. One of the main analytics-engineer skills.
:::

:::note[Data flow]
Input: raw tables in the DWH (declared as `sources`)
→ Processing: SQL models in layers (staging → marts), linked via `ref()`, run by `dbt build` with tests
→ Output: clean marts + documentation and a dependency graph (lineage).
Why: transformations as version-controlled, tested, reproducible code.
:::

## Why you need it

Transformations used to live in scattered SQL scripts and views without versions, tests or run order — chaos. dbt brings engineering practices to analytics: git, tests, documentation, dependencies. It appears more and more in middle+ postings.

## What dbt is and why

dbt (data build tool) handles the **T** in **ELT**: data is first loaded raw into the [DWH](/en/11-modern-stack/01-cloud-dwh-overview/) (E and L), and then dbt transforms it **inside** the warehouse with SQL queries. No separate processing servers — the DWH itself does all the computing.

## How to install and connect to the DWH

dbt Core is a Python package; you install it for a specific warehouse (an adapter):

```bash
pip install dbt-postgres        # or dbt-snowflake, dbt-bigquery, dbt-clickhouse
dbt init my_project             # creates the project skeleton
```

Where to connect is in `profiles.yml` (host, database, schema, credentials):

```yaml
my_project:
  target: dev
  outputs:
    dev:
      type: postgres
      host: localhost
      schema: analytics
      user: "{{ env_var('DB_USER') }}"   # credentials from env vars, not the file
```

:::caution[Credentials in env vars, not in git]
Don't commit `profiles.yml` with a password. Pull secrets via `env_var(...)` from environment variables — otherwise warehouse access leaks into the repository.
:::

## Models, sources, seeds

- **Model** — a `.sql` file with a `SELECT`. dbt wraps it in `CREATE TABLE/VIEW` itself. Models reference each other via `ref()`, and dbt builds the dependency graph.
- **Source** — a description of raw source tables (`source()`), to reference them explicitly and test them.
- **Seed** — a small CSV (reference data) loaded into the DWH by `dbt seed`.

```sql
-- models/marts/revenue_by_country.sql
SELECT country, SUM(amount) AS revenue
FROM {{ ref('stg_orders') }}      -- a reference to another model
WHERE status = 'paid'
GROUP BY country
```

`ref()` is the heart of dbt: it links models, and `dbt run` builds them in the right order.

## Project structure and layers

A typical project is split into **layers** — a widely used convention that gets asked about:

```text
models/
  staging/    # stg_*  — 1:1 with the source: rename, cast types
  marts/      # fct_*, dim_* — business marts, the star (see data modeling)
dbt_project.yml   # the project config
```

- **staging** — light cleaning of raw sources (one stg file per source table), materialized as a `view`.
- **marts** — final marts for analytics and BI, materialized as `table`/`incremental`.

The flow: `source → staging → marts`, links via `ref()`/`source()`.

## Core commands

```bash
dbt run            # build all models (CREATE TABLE/VIEW)
dbt test           # run data tests
dbt build          # run + test + seed along the dependency graph (recommended)
dbt docs generate  # build documentation and the dependency graph (lineage)
```

## Materializations

How exactly a model "materializes" in the DWH:

| Type | What it creates | When |
|------|-----------------|------|
| **view** | a view | light models, always fresh |
| **table** | a physical table | heavy computations, read often |
| **incremental** | appends only new rows | large growing tables |
| **ephemeral** | inlined as a CTE, not materialized | intermediate logic |

`incremental` is critical for big data: recomputing billions of rows every time is expensive. Inside an incremental model, `is_incremental()` appends only the fresh rows:

```sql
{{ config(materialized='incremental', unique_key='order_id') }}

SELECT * FROM {{ ref('stg_orders') }}
{% if is_incremental() %}
  -- on an incremental run, take only rows newer than what's already loaded
  WHERE updated_at > (SELECT MAX(updated_at) FROM {{ this }})
{% endif %}
```

The first `dbt run` builds the whole table, subsequent ones append only new rows.

## Tests

dbt can test data declaratively out of the box (in YAML): `unique`, `not_null`, `accepted_values`, `relationships` (referential integrity). More — in [data quality](/en/11-modern-stack/08-data-quality/).

```yaml
models:
  - name: stg_orders
    columns:
      - name: order_id
        tests: [unique, not_null]
```

## Jinja and macros

dbt models are SQL + the **Jinja** templating engine: you can substitute variables, loops, conditions and extract repeated logic into **macros** (function analogs). This avoids copy-pasting SQL. At the start it's enough to understand `ref()`, `source()` and basic `{{ }}`.

## dbt Cloud vs Core

- **dbt Core** — the free open-source CLI, you run it yourself.
- **dbt Cloud** — a paid service: a web IDE, a scheduler, documentation hosting.

:::note[dbt doesn't store or load data]
A common misconception: dbt is neither a database nor a loader. It only **transforms** data already loaded into the DWH, generating and running SQL **in your warehouse**. Loading (E/L) is handled by other tools (Fivetran, Airbyte), orchestration — by [Airflow](/en/11-modern-stack/06-airflow-basics/).
:::

## Practice tasks

<details>
<summary>1. Why write `{{ ref('other_model') }}` in dbt models instead of the table name directly?</summary>

`ref()` tells dbt about the dependency between models: it builds the graph and runs them in the right order, and substitutes the correct table name in the right schema/environment. Hardcoding the name breaks build order and portability between dev/prod. `ref()` is the basis of dependency management in dbt.

</details>

<details>
<summary>2. The events table grows by millions of rows a day, the model recomputes slowly. Which materialization?</summary>

`incremental`: dbt will append only new/changed rows rather than recompute the whole history each run. For large growing tables this sharply saves DWH time and money. `table` would recompute everything anew, `view` would compute on every read.

</details>

## What's next

- [Airflow](/en/11-modern-stack/06-airflow-basics/) — orchestrating dbt runs and pipelines.
- [Data quality](/en/11-modern-stack/08-data-quality/) — dbt tests in more detail.
