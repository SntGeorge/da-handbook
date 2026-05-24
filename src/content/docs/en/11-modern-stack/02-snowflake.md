---
title: Snowflake
description: "Snowflake: storage and compute separation, virtual warehouses, Time Travel and Zero-Copy Cloning, SQL features, credits and cost optimization."
sidebar:
  order: 2
---

:::tip[In short]
Snowflake's main idea is **separating storage and compute**: data sits separately, and independent **virtual warehouses** process it, scaling and billed separately. This gives flexibility (several teams don't interfere) and cost control. Plus unique features — **Time Travel** and **Zero-Copy Cloning**.
:::

## Why you need it

Snowflake is one of the most widespread cloud DWHs, especially in the US and Europe. An analyst should understand the cost model (what "credits" are charged for) and a couple of signature features — interviewers like to ask about them.

## Architecture: storage / compute separation

In a classic DB storage and compute are coupled. Snowflake splits them into three layers:

- **Storage** — data in the cloud, you pay for volume.
- **Compute** — virtual warehouses that run queries; you pay for their running time.
- **Cloud services** — the optimizer, metadata, security.

Consequence: you can stop compute (a warehouse "sleeps" — you don't pay) while the data stays; and conversely — scale up power for a heavy query without touching storage.

## Virtual warehouses

A "warehouse" in Snowflake is a **compute cluster**, not storage (this confuses newcomers). Sizes from XS to 6XL:

- Each team/workload can have its own warehouse — they don't interfere.
- You can set **auto-suspend** (sleep with no queries) and **auto-resume**.

## Time Travel and Zero-Copy Cloning

Two signature features:

- **Time Travel** — query data "as it was N days ago" or restore an accidentally dropped table. A lifesaver after a `DELETE` without `WHERE`.
- **Zero-Copy Cloning** — an instant copy of a table/database **without duplicating data** (metadata is copied, the data is physically shared until changes). Handy for making a copy of production for testing without storage costs.

## SQL features

Snowflake SQL is close to standard, plus: excellent handling of **semi-structured data** (the `VARIANT` type for JSON), the `FLATTEN` function to unfold nesting, `QUALIFY` to filter by [window functions](/en/02-sql/09-window-functions/) without a subquery.

## Credits and cost optimization

:::caution[In Snowflake you pay for compute running time]
Billing is in **credits** for warehouse running time (not the number of queries). A forgotten large warehouse that didn't "sleep" burns money for nothing. Basic optimization: enable auto-suspend, size for the task (not 4XL for a tiny query), don't scan the excess. An analyst writing inefficient queries on a huge warehouse costs the company dearly.
:::

## Practice tasks

<details>
<summary>1. Is a "warehouse" in Snowflake where data is stored?</summary>

No, a common confusion. A virtual warehouse in Snowflake is a compute cluster that runs queries. Data is stored separately, in the storage layer. The separation of storage and compute is the architecture's key idea.

</details>

<details>
<summary>2. You accidentally deleted data from a table. What in Snowflake helps?</summary>

Time Travel: you can query the table's state before the deletion or restore it within the retention window (by default up to a few days). It's a signature Snowflake feature that saves you after erroneous DELETE/DROP without a slow restore from backup.

</details>

## What's next

- [BigQuery](/en/11-modern-stack/03-bigquery/) — Google's alternative, a different pricing model.
- [dbt](/en/11-modern-stack/05-dbt-basics/) — data transformations on top of the DWH.
