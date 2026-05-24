---
title: Power Query
description: "Power Query basics in Excel: import from CSV/DB/web, basic transformations, Merge and Append, refreshing data with one button."
sidebar:
  order: 5
---

:::tip[In short]
Power Query is Excel's built-in ETL tool: it loads data from files/databases/the web, cleans and transforms it **by recorded steps**, and then refreshes the result with one button. Unlike formulas, the steps repeat automatically on a new export.
:::

## Why you need it

If a new CSV arrives every month that needs the same cleaning, doing it with formulas is hell. Power Query remembers the transformation chain once; next time you just drop in the new file and click **Refresh**. That's the difference between "doing it by hand every time" and "setting it up once".

## Where it lives

The **Data → Get Data** tab. The Power Query editor opens — a separate window with a list of queries on the left and the recorded steps (Applied Steps) on the right.

## Import

Power Query pulls data from anywhere:

- **CSV / text** — Data → From Text/CSV.
- **An Excel file or a folder of files** — you can combine all files from a folder at once.
- **A database** — PostgreSQL, SQL Server, etc.
- **The web** — tables straight from a page by URL.

## Basic transformations

Everything is done with clicks, and Power Query records the steps:

- remove/rename columns;
- change the data type (text → number → date);
- filter rows, remove duplicates;
- split a column by a delimiter, replace values;
- pivot/unpivot.

:::note[Every step is recorded]
The "Applied Steps" list on the right is the history of your actions. Any step can be edited or deleted, and Power Query recomputes the result. That's what makes the processing reproducible.
:::

## Merge and Append

Two ways to combine queries — often confused:

| Operation | What it does | SQL equivalent |
|-----------|--------------|----------------|
| **Merge** | joins tables by key (adds columns) | `JOIN` |
| **Append** | stacks one table's rows under another's | `UNION ALL` |

Merge — when you need to pull data from a reference. Append — when you have exports for different months with the same columns and need to stack them into one.

## The M language

Under the hood, each step is code in the **M** language. You usually don't write it by hand: clicks are enough. But the formula bar is visible, and sometimes it's convenient to tweak a step right in code. You don't need to learn M deeply at the start.

## Refreshing data

The **Refresh All** button (Data → Refresh All) re-runs all steps on fresh data. Drop in a new file with the same structure → refresh → done.

:::caution[The structure must match]
Power Query is tied to the source's column names and types. If the new file renamed a column or changed the date format — the steps will break. Keep your export structure stable or build that into the steps.
:::

## What's next

- [Data cleaning](/en/03-excel/06-data-cleaning/) — what to clean in Power Query and with formulas.
- [Modern data stack](/en/11-modern-stack/01-cloud-dwh-overview/) — the same ETL ideas at the infrastructure level.
