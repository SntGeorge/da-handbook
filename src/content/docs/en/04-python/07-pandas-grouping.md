---
title: "pandas: grouping"
description: "Grouping in pandas: groupby, agg aggregations, transform for same-length results, pivot_table and crosstab."
sidebar:
  order: 7
---

:::tip[In short]
**`groupby`** is SQL's `GROUP BY`: split the data into groups and compute an aggregate per group. `agg` computes several functions at once, `transform` returns a result of the same length (for shares and normalization), `pivot_table` builds a pivot table.
:::

## Why you need it

"Revenue by country", "average check by status", "number of orders per customer" — all of these are groupings. `groupby` is one of the most frequent tools in an analyst's work.

```python title="Demo DataFrame df"
#  order_id country status  amount
#  101      RU      paid    2500
#  102      RU      paid    1800
#  104      KZ      paid    4200
#  105      KZ      cancel  700
#  106      DE      paid    3000
```

## groupby: basics

```python
df.groupby("country")["amount"].sum()
# RU    4300
# KZ    4900
# DE    3000

df.groupby("country")["amount"].mean()      # average check by country
df.groupby(["country", "status"]).size()    # number of rows in each group
```

The pattern: `df.groupby(KEY)[COLUMN].FUNCTION()`.

## Several aggregates: agg

`agg` computes several functions at once and names the columns:

```python
df.groupby("country").agg(
    orders=("order_id", "count"),
    revenue=("amount", "sum"),
    avg_check=("amount", "mean"),
)
```

| country | orders | revenue | avg_check |
|---------|--------|---------|-----------|
| RU      | 2      | 4300    | 2150      |
| KZ      | 2      | 4900    | 2450      |
| DE      | 1      | 3000    | 3000      |

## transform: same-length result

Unlike `agg` (one row per group), `transform` returns a value for **each** original row — handy for shares:

```python
df["country_total"] = df.groupby("country")["amount"].transform("sum")
df["share"] = df["amount"] / df["country_total"]
```

This is the direct equivalent of the window function `SUM() OVER (PARTITION BY country)` from [SQL](/en/02-sql/09-window-functions/).

## pivot_table

A pivot table — an aggregate at the intersection of two dimensions:

```python
df.pivot_table(index="country", columns="status",
               values="amount", aggfunc="sum", fill_value=0)
```

| country | cancel | paid |
|---------|--------|------|
| RU      | 0      | 4300 |
| KZ      | 700    | 4200 |
| DE      | 0      | 3000 |

## crosstab

`crosstab` is a special case for counting frequencies (`count` by default):

```python
pd.crosstab(df["country"], df["status"])     # orders of each status by country
```

:::caution[Grouping silently drops NaN in the key]
If the key column has missing values (`NaN`), `groupby` excludes those rows from the result by default. Check `df["country"].isna().sum()` before grouping or use `dropna=False`.
:::

## Practice tasks

<details>
<summary>1. How to add each row's share of its country's revenue?</summary>

Via `transform`: `df["share"] = df["amount"] / df.groupby("country")["amount"].transform("sum")`. `transform` returns the group's sum for each row without collapsing the table — unlike `agg`.

</details>

<details>
<summary>2. How does `agg` differ from `transform`?</summary>

`agg` collapses a group into one row (one number per group). `transform` returns a result the same length as the original DataFrame — the same value is stamped into all rows of the group. The first is for summaries, the second for shares and normalization.

</details>

## What's next

- [pandas: merging](/en/04-python/08-pandas-merging/) — combine several tables.
- [Window functions in SQL](/en/02-sql/09-window-functions/) — the same `transform`, but in the database.
