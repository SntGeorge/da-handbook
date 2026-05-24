---
title: Data cleaning
description: "Data cleaning in pandas: missing values isna/fillna/dropna, duplicates, type casting astype, replace, outliers, categorical data."
sidebar:
  order: 10
---

:::tip[In short]
Before analysis you must clean the data: deal with **missing values** (`isna`, `fillna`, `dropna`), remove **duplicates** (`drop_duplicates`), cast **types** (`astype`, `to_numeric`) and decide what to do with **outliers**. On dirty data any conclusions are unreliable.
:::

:::note[Data flow]
Input: a raw "dirty" export (missing values, duplicates, numbers-as-text)
→ Processing: `fillna`/`dropna`, `drop_duplicates`, `to_numeric`, outlier handling
→ Output: a clean DataFrame ready for analysis.
Why: ensure conclusions rest on correct data, not garbage.
:::

## Why you need it

Real exports are always dirty: empty cells, duplicate rows, a number stored as text, typos in categories. Cleaning is a mandatory stage; it takes up to half the analysis time, and that's normal.

## Missing values (NaN)

```python
df.isna().sum()                    # how many missing in each column
df.dropna()                        # drop rows with any NaN
df.dropna(subset=["amount"])       # only if NaN in amount
df["amount"].fillna(0)             # fill with zero
df["amount"].fillna(df["amount"].median())   # with the median
df["country"].fillna("unknown")    # categorical — with a placeholder
```

:::caution[Drop or fill?]
`dropna` loses data — justified when there are few missing values or a row without a key is useless. `fillna` keeps rows but introduces an assumption (median/0/"unknown"). The choice depends on meaning: filling a missing amount with zero is dangerous, filling a missing category with "unknown" is usually fine.
:::

## Duplicates

```python
df.duplicated().sum()              # how many full duplicates
df.drop_duplicates()               # remove full duplicates
df.drop_duplicates(subset=["order_id"], keep="last")   # by key, keep the last
```

## Type casting

A common problem — a number or date read as text:

```python
df["amount"] = df["amount"].astype(float)
df["amount"] = pd.to_numeric(df["amount"], errors="coerce")   # non-numbers → NaN
df["date"]   = pd.to_datetime(df["date"])
df["count"]  = df["count"].astype("Int64")    # integers with NaN support
```

`to_numeric(errors="coerce")` saves you when garbage sneaks in among numbers: it turns it into `NaN` rather than crashing the whole column.

## replace: fixing values

```python
df["status"] = df["status"].replace({"paid ": "paid", "PAID": "paid"})   # unify
df["country"] = df["country"].str.strip().str.upper()                    # strip spaces, case
```

## Outliers

Find anomalous values, e.g. by the interquartile range (IQR) rule:

```python
q1, q3 = df["amount"].quantile([0.25, 0.75])
iqr = q3 - q1
mask = df["amount"].between(q1 - 1.5*iqr, q3 + 1.5*iqr)
df_clean = df[mask]                # keep the "normal" ones
```

An outlier isn't always an error: a large order can be real. Decide by meaning, don't delete blindly.

## Categorical data

For columns with repeating values (country, status) the `category` type saves memory and speeds up grouping:

```python
df["country"] = df["country"].astype("category")
```

<details>
<summary>1. The amount column read as text because of spaces and "—". How to convert to a number?</summary>

`pd.to_numeric(df["amount"], errors="coerce")` — turns unparseable values ("—", empty) into `NaN`, the rest into numbers. Then `fillna` or `dropna` if needed. A plain `astype(float)` would crash on "—".

</details>

<details>
<summary>2. When should an outlier be removed, and when kept?</summary>

Remove — if it's a clear error (negative age, an amount 1000× larger from a bug). Keep — if the value is real, even if rare (a large customer). Blind IQR clipping can throw out valuable observations, so look at the nature of the data.

</details>

## What's next

- [Matplotlib and Seaborn](/en/04-python/11-matplotlib-seaborn/) — visualize the cleaned data.
- [Data cleaning in Excel](/en/03-excel/06-data-cleaning/) — the same tasks without code.
