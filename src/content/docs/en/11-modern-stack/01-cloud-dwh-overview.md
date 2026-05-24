---
title: "Cloud DWH: overview"
description: "Cloud data warehouses: OLTP vs OLAP, what a DWH is, columnar storage, the players (Snowflake/BigQuery/Redshift/Databricks), Lakehouse."
sidebar:
  order: 1
---

:::tip[In short]
A DWH (data warehouse) is a database tuned for **analytics** (OLAP), not an application's transactions (OLTP). The key difference is **columnar storage**: data is laid out by column, so aggregates over billions of rows are computed fast. Cloud DWHs (Snowflake, BigQuery) separate storage and compute — you pay for what you compute.
:::

## Why you need it

At a startup or a large company an analyst works not with a local PostgreSQL but with a cloud DWH where all data flows. Understanding how it differs from a regular DB and why a query is "cheaper" written differently is a middle+ skill.

## OLTP vs OLAP

Two worlds of databases for different tasks:

| | OLTP | OLAP (DWH) |
|--|------|------------|
| For what | running an application | analytics |
| Operations | many small INSERT/UPDATE | heavy SELECT with aggregates |
| Example query | "create order #123" | "revenue by country for the year" |
| Storage | row-based | columnar |
| Example | PostgreSQL, MySQL | Snowflake, BigQuery, ClickHouse |

A business app writes to OLTP, then data flows (nightly or in real time) into the OLAP warehouse where it's analyzed — so heavy reports don't slow production.

## What a DWH is

A Data Warehouse is a centralized store that brings data from different sources (product, marketing, finance) into a single model for analysis. It's the company's "single source of truth".

## Columnar storage

:::tip[Why a DWH is fast on analytics]
In a row store a row sits contiguously — convenient to fetch one order. In a columnar store the values of **one column** sit together. For `SUM(amount)` over a billion rows the columnar store reads only the `amount` column, not all fields — orders of magnitude less data off disk. Plus same-type column data compresses well. Hence the analytics speed.
:::

## The modern players

| Warehouse | Cloud | Pricing model | When chosen |
|-----------|-------|---------------|-------------|
| **Snowflake** | AWS/Azure/GCP | by compute running time (credits) | multi-cloud, convenience, isolating teams' workloads |
| **BigQuery** | Google Cloud | by volume of data scanned | Google ecosystem (GA4), serverless, no admin |
| **Redshift** | AWS | by provisioned nodes (or serverless) | everything is already in AWS |
| **Databricks** | AWS/Azure/GCP | by compute (DBU) | heavy ML/Spark, Lakehouse |
| **ClickHouse** | self-host / Cloud | your own server or cloud | extreme speed on events, popular in the CIS |

[ClickHouse](/en/11-modern-stack/04-clickhouse/) is almost a standard for product analytics in the CIS, so it has its own page.

## ETL vs ELT

An important shift the whole modern stack rests on. Data used to be **transformed before loading** into the warehouse (ETL), now it's **after** (ELT):

| | ETL (the old approach) | ELT (modern) |
|--|------------------------|--------------|
| Order | Extract → **Transform** → Load | Extract → Load → **Transform** |
| Where transformation happens | on a separate server before the DWH | **inside the DWH** via SQL |
| Tools | expensive ETL suites | loading (Fivetran/Airbyte) + [dbt](/en/11-modern-stack/05-dbt-basics/) |

Why the move to ELT: cloud DWHs are cheap to store in and powerful at computing — it's easier to dump the raw data as-is and transform it with SQL queries right in the warehouse. Hence the role of [dbt](/en/11-modern-stack/05-dbt-basics/) (the T layer) and an [orchestrator](/en/11-modern-stack/06-airflow-basics/).

## Lakehouse

A hybrid of a **data lake** (cheap raw-file storage) and a **DWH** (structure and SQL). The formats **Apache Iceberg** and **Delta Lake** add transactions, schema and versioning to files in the lake — the "best of both worlds". A trend of recent years; for a junior it's enough to know the term and idea.

<details>
<summary>1. Why aren't heavy analytical reports run directly on the application's production DB?</summary>

The production DB is OLTP, optimized for small transactions; a heavy SELECT with aggregates over all history will load it and slow the application. So data is moved into an OLAP warehouse (DWH) with columnar storage, where such queries are fast and don't interfere with production.

</details>

<details>
<summary>2. Why does a columnar store compute `SUM(amount)` over a billion rows faster?</summary>

It reads only the `amount` column off disk, not whole rows with all fields — orders of magnitude less data. Plus same-type column values compress strongly. A row store, for a single sum, has to go through all fields of every row.

</details>

## What's next

- [Snowflake](/en/11-modern-stack/02-snowflake/) — a popular cloud DWH.
- [BigQuery](/en/11-modern-stack/03-bigquery/) — Google's serverless warehouse.
