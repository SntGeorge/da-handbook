---
title: Common patterns
description: "Ready-made analyst pipelines in pandas: ETL in a notebook, exploring an export, cohort analysis, an A/B test with scipy, presenting results."
sidebar:
  order: 16
---

:::tip[In short]
This page ties everything from the section into working scenarios: an **ETL pipeline** (load → clean → compute), **exploring an export from a PM**, **cohort analysis** and an **A/B test with pandas + scipy**. These are templates that appear in work and in interviews almost verbatim.
:::

## Why you need it

Individual techniques (filters, grouping, merge) are bricks on their own. The value appears when a complete analysis is assembled from them. Below are typical builds you can use as a starting point.

## ETL pipeline in one notebook

The classic structure of an analysis notebook — three steps top to bottom:

```python
import pandas as pd

# 1. Extract — loading
df = pd.read_csv("orders.csv", parse_dates=["date"])

# 2. Transform — cleaning and enrichment
df = (df
      .dropna(subset=["amount"])
      .query("status == 'paid'")
      .assign(month=lambda d: d["date"].dt.to_period("M")))

# 3. Load / analysis — aggregates and output
revenue = df.groupby("month")["amount"].sum()
revenue.plot(kind="bar", title="Revenue by month")
```

One step — one logical block. This is "from raw to insights".

## Exploring an export from a PM

The routine when you're sent an unfamiliar file with "see what's here":

```python
df = pd.read_csv("export.csv")
df.shape                       # size
df.head()                      # what the data looks like
df.info()                      # types and missing values
df.describe()                  # numeric summary
df.isna().sum()                # where the holes are
df["category"].value_counts()  # what's in the categories
```

Understand the data first (granularity, duplicates, missing values), and only then compute metrics — otherwise conclusions are built on sand.

## Cohort analysis in pandas

Retention by monthly cohorts: group users by the month of their first purchase and look at activity in the following months.

```python
df["cohort"] = df.groupby("user_id")["date"].transform("min").dt.to_period("M")
df["period"] = (df["date"].dt.to_period("M") - df["cohort"]).apply(lambda x: x.n)

cohort = df.pivot_table(index="cohort", columns="period",
                        values="user_id", aggfunc="nunique")
retention = cohort.div(cohort[0], axis=0)     # share of the cohort size
```

Theory and interpretation — in [cohort analysis](/en/08-product-analytics/04-cohort-analysis/).

## An A/B test with pandas + scipy

Compare two groups' conversion and check significance:

```python
from scipy import stats

a = df[df["group"] == "A"]["converted"]       # 0/1
b = df[df["group"] == "B"]["converted"]

# a t-test to compare the means (conversions)
t, p = stats.ttest_ind(a, b)
print(f"Conversion A={a.mean():.3f}, B={b.mean():.3f}, p-value={p:.4f}")
```

If `p-value < 0.05` — the difference is statistically significant. The full methodology (sample size, errors, pitfalls) — in [the A/B section](/en/09-ab-testing/01-fundamentals/).

:::caution[p-value doesn't replace common sense]
Statistical significance (`p < 0.05`) only says the difference is unlikely to be random. It doesn't say the effect is **large** or **important to the business**. Always look at the effect size and the confidence interval, not just the p-value.
:::

## Presenting results

- **The conclusion goes first.** First the answer ("revenue dropped due to KZ churn"), then the supporting charts.
- **Chart > table** for a trend; a table — for exact numbers.
- **One chart — one thought**, labeled axes, a clear title.
- **Reproducibility**: the notebook should run top to bottom (Restart & Run All).

<details>
<summary>1. You're sent a CSV with "see what's interesting". Where to start?</summary>

With understanding the data, not the metrics: `shape`, `head`, `info`, `describe`, `isna().sum()`, `value_counts()` on key categories. Determine the granularity (what one row is), find missing values and duplicates. Computing anything before that risks wrong conclusions.

</details>

<details>
<summary>2. An A/B test showed a p-value of 0.5. What does that mean?</summary>

The conversion difference is statistically insignificant — the observed gap could easily have arisen by chance. You can't claim B is better than A. Possibly the sample is too small, or there's genuinely no effect.

</details>

## What's next

- [Product analytics](/en/08-product-analytics/01-key-metrics/) — metrics, cohorts, retention in detail.
- [A/B testing](/en/09-ab-testing/01-fundamentals/) — the full experiment methodology.
- [SQL common patterns](/en/02-sql/16-common-patterns/) — the same tasks on the database side.
