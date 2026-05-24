---
title: Matplotlib and Seaborn
description: "Visualization in Python: matplotlib (figure/axes, line/bar/scatter/hist/box), customization and Seaborn (heatmap, pairplot, themes)."
sidebar:
  order: 11
---

:::tip[In short]
**Matplotlib** is the base charting library (everything is built via `fig, ax`). **Seaborn** is a layer on top: nicer by default and shorter for statistical charts. In practice: a quick chart — straight from pandas (`df.plot`), statistics — Seaborn, fine-tuning — matplotlib.
:::

## Why you need it

A chart explains data faster than a table: a trend, an outlier, a distribution is seen at a glance. For exploratory analysis (EDA) and reports it's indispensable. For interactivity there's [Plotly](/en/04-python/12-plotly-basics/), but static charts are the working foundation.

## Matplotlib: figure and axes

The canvas (`figure`) and the area with axes (`axes`) are the basis of everything:

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot([1, 2, 3], [10, 20, 15])
ax.set_title("Revenue")
ax.set_xlabel("Month")
ax.set_ylabel("$")
plt.show()
```

From pandas it's even faster — it calls matplotlib itself:

```python
df.groupby("country")["amount"].sum().plot(kind="bar")
```

## Chart types

| Type | Method | When |
|------|--------|------|
| Line | `plot` | dynamics over time |
| Bars | `bar` | comparing categories |
| Points | `scatter` | the relationship of two variables |
| Histogram | `hist` | distribution of one variable |
| Box plot | `boxplot` | spread and outliers |

Which chart for which task — in detail in the [visualization section](/en/06-visualization/02-chart-types/).

## Customization

```python
ax.set_title("Title", fontsize=14)
ax.legend(["Sales"])                # legend
ax.set_xticks(range(0, 12))         # axis ticks
ax.grid(True, alpha=0.3)            # grid
fig.savefig("chart.png", dpi=150, bbox_inches="tight")   # save
```

## Seaborn: less code

Seaborn works directly with a DataFrame and computes statistics itself:

```python
import seaborn as sns

sns.barplot(data=df, x="country", y="amount", estimator="sum")
sns.histplot(data=df, x="amount", bins=20)        # distribution
sns.boxplot(data=df, x="status", y="amount")      # spread by group
sns.heatmap(corr_matrix, annot=True)              # correlation matrix
sns.pairplot(df)                                  # all pairs of numeric columns
```

A correlation `heatmap` and `pairplot` are EDA classics: one line reveals relationships between features.

:::note[pandas .plot vs Seaborn vs matplotlib]
A quick sketch during analysis — `df.plot()`. An out-of-the-box statistical chart (distributions, correlations) — Seaborn. Full control over every element for a final report — pure matplotlib. All three are compatible: Seaborn draws on matplotlib axes.
:::

## Styles and themes

```python
sns.set_theme(style="whitegrid")     # a tidy Seaborn theme at once
plt.style.use("ggplot")              # built-in matplotlib styles
```

<details>
<summary>1. You need a quick look at the distribution of order amounts. What to plot?</summary>

A histogram: `df["amount"].hist(bins=20)` or `sns.histplot(data=df, x="amount")`. A histogram shows how often different value ranges occur — the shape of the distribution, skew, outliers.

</details>

<details>
<summary>2. When to use Seaborn instead of matplotlib?</summary>

When you need a statistical chart with minimal code (distributions, boxplots by group, correlation heatmap, pairplot) and the default styling is fine. For full control over every element — matplotlib. Seaborn is built on top of it anyway.

</details>

## What's next

- [Plotly](/en/04-python/12-plotly-basics/) — interactive charts.
- [Visualization principles](/en/06-visualization/01-principles/) — how not to lie with a chart.
