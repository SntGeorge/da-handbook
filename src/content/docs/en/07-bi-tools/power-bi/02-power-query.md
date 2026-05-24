---
title: Power Query
description: "Loading and transforming data in Power BI via Power Query: sources, Applied Steps, basic transformations, the M language, Merge and Append."
sidebar:
  order: 2
---

:::tip[In short]
Power Query is the **Transform** stage: here data is cleaned and put in order **before** it enters the model. It's the same Power Query as [in Excel](/en/03-excel/05-power-query-basics/): it records steps (Applied Steps) and repeats them on refresh. The rule — do all cleaning here, not in DAX formulas later.
:::

## Why you need it

Dirty data in the model = wrong measures and broken relationships. Power Query cleans the source once and reproduces the steps on every refresh. This is the right place for renames, types, filtering and combining tables.

## Data sources

The **Get Data** button → dozens of connectors: Excel/CSV, a folder of files, SQL Server, PostgreSQL, the web, Google Sheets, cloud services. After choosing, the Power Query editor opens (**Transform data**).

## Editor and Applied Steps

On the right is the **Applied Steps** panel: the history of each of your actions. Any step can be edited, reordered or deleted, and Power Query recomputes the result. This makes the processing reproducible and transparent.

## Basic transformations

All by clicks, steps recorded:

- remove/rename columns;
- set the **data type** (text → number → date) — critical for correct measures;
- filter rows, remove duplicates;
- split a column, replace values, fill missing;
- pivot/unpivot.

:::caution[Clean in Power Query, not in DAX]
Do renames, types, filtering at the Power Query stage. If you leave the "dirt" and patch it with DAX measures, the model bloats and slows, and type errors surface at the worst moment. The rule: transformations on the left (Power Query), computations on the right (DAX).
:::

## The M language (overview)

Under the hood, each step is code in the **M** language. You usually don't write it by hand: clicks are enough. But the formula bar is visible, and advanced steps are sometimes edited directly in M. No need to learn it deeply at the start.

## Merge and Append

Two ways to combine queries (as in Excel and [SQL](/en/02-sql/11-set-operations/)):

| Operation | What it does | SQL equivalent |
|-----------|--------------|----------------|
| **Merge** | joins tables by key (+ columns) | `JOIN` |
| **Append** | stacks one table's rows under another's | `UNION ALL` |

Merge — to pull in a reference; Append — to stack exports for different months.

<details>
<summary>1. An amount column loaded as text, and measures compute wrong. Where to fix?</summary>

In Power Query: set the column's type to "Number" (Change Type) before loading into the model. Type cleaning is a Transform-stage task, not DAX. After fixing the type, Applied Steps applies it on every refresh automatically.

</details>

<details>
<summary>2. There are 12 structurally identical export files for months. How to combine them into one table?</summary>

Append (or Get Data → Folder, which combines a folder's files). Append stacks one table's rows under another's — the equivalent of `UNION ALL`. Merge doesn't fit here: it joins by key and adds columns, not rows.

</details>

## What's next

- [Data model](/en/07-bi-tools/power-bi/03-data-model/) — the Model stage: relationships between tables.
- [Power Query in Excel](/en/03-excel/05-power-query-basics/) — the same tool, the same ideas.
