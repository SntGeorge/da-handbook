---
title: "pandas: selecting data"
description: "Selecting and filtering in pandas: loc and iloc, boolean masks, isin/between/str.contains, the query method, where/mask."
sidebar:
  order: 5
---

:::tip[In short]
Two access methods: **`loc`** — by labels (column names, index values), **`iloc`** — by integer positions. Filtering — via **boolean masks** (`df[df["amount"] > 2000]`) or the convenient **`query()`** in SQL-like style.
:::

## Why you need it

90% of data work is "keep the rows and columns I need": orders from Russia, over 2000, paid. In pandas that's done with masks and `loc` — the equivalent of `WHERE` and column selection in SQL.

```python title="Demo DataFrame df"
#  order_id country status  amount
#  101      RU      paid    2500
#  102      RU      paid    1800
#  104      KZ      paid    4200
#  105      KZ      cancel  700
#  106      DE      paid    3000
```

## Selecting columns

```python
df["amount"]                 # one column → Series
df[["country", "amount"]]    # several → DataFrame
```

## loc vs iloc

```python
df.loc[0, "amount"]          # by label: row with index 0, column amount → 2500
df.loc[df["country"]=="RU", ["order_id","amount"]]   # mask + columns
df.iloc[0, 3]                # by position: 1st row, 4th column → 2500
df.iloc[0:2]                 # first two rows
```

`loc` — by names, `iloc` — by numbers. Remember: **l**oc = **l**abels.

## Boolean masks

A condition gives a `Series` of `True/False` used to select rows:

```python
df[df["amount"] > 2000]                       # over 2000
df[(df["country"]=="RU") & (df["status"]=="paid")]   # AND
df[(df["country"]=="RU") | (df["country"]=="KZ")]    # OR
```

:::caution[Parentheses and & instead of and]
In pandas masks use `&`, `|`, `~` (not `and`/`or`/`not`), and **each condition in parentheses**: `(df.a > 1) & (df.b < 5)`. Without parentheses Python gets the precedence wrong and raises an error.
:::

## Convenient filtering methods

```python
df[df["country"].isin(["RU", "KZ"])]          # value from a list
df[df["amount"].between(1000, 3000)]          # range inclusive
df[df["status"].str.contains("paid")]         # substring in text
```

## query() — SQL-like syntax

`query()` writes the condition as a string — often reads cleaner, especially with many conditions:

```python
df.query("country == 'RU' and amount > 2000")
df.query("amount.between(1000, 3000)")
threshold = 2000
df.query("amount > @threshold")               # @ — substitute a variable
```

## where and mask

Unlike a filter (which drops rows), `where`/`mask` keep the shape, replacing values that don't match with `NaN`:

```python
df["amount"].where(df["amount"] > 2000)       # keeps >2000, rest → NaN
df["amount"].mask(df["amount"] > 2000, 0)     # opposite: >2000 becomes 0
```

<details>
<summary>1. How to select paid orders from Kazakhstan over 1000?</summary>

With a mask: `df[(df["country"]=="KZ") & (df["status"]=="paid") & (df["amount"]>1000)]`. Or `query`: `df.query("country=='KZ' and status=='paid' and amount>1000")`. On the demo data — order 104.

</details>

<details>
<summary>2. What's the difference between loc and iloc?</summary>

`loc` accesses by labels (column name, index value), `iloc` — by integer positions. `df.loc[0,"amount"]` — by column name; `df.iloc[0,3]` — by column number. Mask filtering uses `loc`.

</details>

## What's next

- [pandas: transforming](/en/04-python/06-pandas-transforming/) — change and create columns.
- [pandas: grouping](/en/04-python/07-pandas-grouping/) — aggregates by group.
