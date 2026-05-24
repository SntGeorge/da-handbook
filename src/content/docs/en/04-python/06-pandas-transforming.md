---
title: "pandas: transforming"
description: "Transforming data in pandas: creating columns, apply, map, assign, eval, pipe and why vectorization beats loops."
sidebar:
  order: 6
---

:::tip[In short]
A new column is almost always computed **vectorized**: `df["net"] = df["amount"] * 0.95` — fast and readable. `apply` is needed only for complex logic, `map` — for replacing values by a dict, `assign`/`pipe` — for tidy transformation chains.
:::

:::note[Data flow]
Input: existing DataFrame columns
→ Processing: vectorized arithmetic / `map` / `apply` produce new values
→ Output: a DataFrame with new or changed columns.
Why: compute the metrics you need (margin, category, flag) that aren't in the raw data.
:::

## Why you need it

Raw data rarely contains the metric you need directly: you have to compute tax, categorize amounts, convert currency. That's transformations — creating and changing columns.

```python title="Demo DataFrame df"
#  order_id country status  amount
#  101      RU      paid    2500
#  104      KZ      paid    4200
#  106      DE      paid    3000
```

## Vectorized column creation

The most common and fastest way — arithmetic right on columns:

```python
df["net"]   = df["amount"] * 0.95            # minus 5%
df["is_big"] = df["amount"] > 2000           # True/False
df["label"] = df["country"] + "-" + df["status"]   # string concatenation
```

:::caution[Don't loop over rows]
There's a temptation to write `for i in range(len(df)): ...` or `df.apply(..., axis=1)` for simple arithmetic. That's tens of times slower than a vectorized operation and reads worse. A loop/`apply` — only when vectorizing is impossible.
:::

## apply — for complex logic

When you need a function that can't be expressed with arithmetic:

```python
def tier(x):
    if x >= 3000: return "A"
    if x >= 2000: return "B"
    return "C"

df["tier"] = df["amount"].apply(tier)        # apply to a Series
```

Categorization is often more convenient via `pd.cut(df["amount"], bins=[0,2000,3000,np.inf], labels=["C","B","A"])`.

## map — replace by a dict

`map` substitutes a `Series`' values by a dict — handy for recoding:

```python
names = {"RU": "Russia", "KZ": "Kazakhstan", "DE": "Germany"}
df["country_full"] = df["country"].map(names)
```

## assign — columns in a chain

`assign` returns a new DataFrame with the added column — convenient in chains, without touching the original:

```python
result = (
    df
    .assign(net=df["amount"] * 0.95)
    .assign(tax=lambda d: d["amount"] - d["net"])
)
```

## eval and pipe

```python
df.eval("net = amount * 0.95", inplace=True)   # arithmetic as a string (fast on large df)

def add_tax(d, rate):
    return d.assign(tax=d["amount"] * rate)

df.pipe(add_tax, rate=0.2)                      # insert your function into the chain
```

`pipe` lets you embed your own functions into the transformation "pipeline", keeping a readable style.

## When to use what

| Task | Tool |
|------|------|
| Arithmetic over columns | vectorized: `df["a"] * 2` |
| Replace values by a lookup | `map` |
| Complex row-wise logic | `apply` (or `np.select`/`pd.cut`) |
| Add a column in a chain | `assign` |
| Embed your function into a chain | `pipe` |

<details>
<summary>1. Why is `df["net"] = df["amount"] * 0.95` better than a row loop?</summary>

It's a vectorized operation: pandas/NumPy apply the multiplication to the whole column at once at the C level — tens to hundreds of times faster than a loop and shorter in code. A row loop in pandas is an anti-pattern for simple arithmetic.

</details>

<details>
<summary>2. You need to replace country codes with full names. Which tool?</summary>

`map` with a dict: `df["country"].map({"RU":"Russia", ...})`. It's built precisely for element-wise replacement of values by a key→value mapping.

</details>

## What's next

- [pandas: grouping](/en/04-python/07-pandas-grouping/) — aggregates and pivots.
- [Data cleaning](/en/04-python/10-data-cleaning/) — type casting, missing values, duplicates.
