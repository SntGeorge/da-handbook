---
title: "pandas: introduction"
description: "pandas basics: Series and DataFrame, creation, reading read_csv/read_excel/read_sql, writing, first look with info/describe/head."
sidebar:
  order: 4
---

:::tip[In short]
pandas is the analyst's main tool in Python. The core objects are **`Series`** (one column) and **`DataFrame`** (a table). Data is read in one line (`pd.read_csv`, `read_excel`, `read_sql`), and the first look is done with `head()`, `info()`, `describe()`.
:::

## Why you need it

pandas is "Excel in code": tables, filters, grouping, pivots — but reproducible, at any scale, with no manual clicking. Almost all of an analyst's Python work goes through pandas.

## Series and DataFrame

```python
import pandas as pd

# Series — one column with an index
s = pd.Series([2500, 1800, 4200], name="amount")

# DataFrame — a table of columns
df = pd.DataFrame({
    "order_id":    [101, 102, 104],
    "country":     ["RU", "RU", "KZ"],
    "status":      ["paid", "paid", "paid"],
    "amount":      [2500, 1800, 4200],
})
```

A `DataFrame` is a set of `Series` with a shared index. A single column `df["amount"]` is a `Series`.

## Reading data

Where data usually comes from:

```python
df = pd.read_csv("orders.csv")              # CSV — most often
df = pd.read_excel("report.xlsx")           # Excel
df = pd.read_json("data.json")              # JSON
df = pd.read_sql("SELECT * FROM orders", conn)   # straight from a DB
```

Useful `read_csv` parameters: `sep=";"` (delimiter), `encoding="utf-8"`, `parse_dates=["date"]`. More in [working with files](/en/04-python/13-working-with-files/).

## Writing data

```python
df.to_csv("result.csv", index=False)    # index=False — no index column
df.to_excel("result.xlsx", index=False)
```

:::caution[index=False when saving]
Without `index=False` pandas writes an extra unnamed index column (0,1,2…). On the next read it becomes an `Unnamed: 0` column. Get used to setting `index=False` in `to_csv`/`to_excel`.
:::

## First look at the data

The first thing you do with any new dataset:

```python
df.head()        # first 5 rows
df.tail(3)       # last 3
df.shape         # (rows, columns) → (3, 4)
df.info()        # column types and non-null counts
df.describe()    # stats on numeric columns: count, mean, min, max, quantiles
df.columns       # list of column names
df["country"].value_counts()   # value frequencies
```

`info()` immediately shows where there are missing values (by non-null count) and whether types "drifted" (a number read as text).

## Practice tasks

<details>
<summary>1. What's the difference between Series and DataFrame?</summary>

`Series` is a one-dimensional array with an index (essentially one column). `DataFrame` is a 2D table, a set of `Series` with a shared index. Accessing a single column `df["col"]` returns a `Series`.

</details>

<details>
<summary>2. Where do you start with an unfamiliar CSV?</summary>

`pd.read_csv(...)`, then `df.head()` (see the data), `df.shape` (size), `df.info()` (types and missing values), `df.describe()` (numeric summary). That gives you the picture in a minute before any analysis.

</details>

## What's next

- [pandas: selecting data](/en/04-python/05-pandas-selecting/) — filters, `loc`/`iloc`, masks.
- [pandas: transforming](/en/04-python/06-pandas-transforming/) — creating and changing columns.
