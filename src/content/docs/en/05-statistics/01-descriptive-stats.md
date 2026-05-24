---
title: Descriptive statistics
description: "Measures of center (mean, median, mode) and spread (variance, standard deviation), quantiles and IQR, distribution shape, box plot."
sidebar:
  order: 1
---

:::tip[In short]
Descriptive statistics compress an array of numbers down to a few indicators: **center** (mean, median), **spread** (standard deviation, IQR) and **shape** (skew). The analyst's main rule — on skewed data (incomes, order values) the **median is more honest than the mean**.
:::

## Why you need it

You can't eyeball 100,000 values. Descriptive statistics answer "how much on average", "how spread out", "are there outliers" — the first step of getting to know any dataset.

## Measures of center

| Measure | What it is | When |
|---------|------------|------|
| **Mean** | sum / count | symmetric data without outliers |
| **Median** | the middle value by order | skewed data, outliers present |
| **Mode** | the most frequent value | categories, discrete data |

Mean: $\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i$

:::caution[The mean lies on skew]
Salaries: five earn 50, one earns 500. The mean = 125, though the "typical" person earns 50. The median (50) is more honest. For incomes, order values, time on site, always look at the median alongside the mean — a divergence signals skew.
:::

## Measures of spread

How "scattered" the values are around the center:

- **Variance** $\sigma^2 = \frac{1}{n}\sum (x_i - \bar{x})^2$ — the average squared deviation.
- **Standard deviation** $\sigma = \sqrt{\sigma^2}$ — the same, but in original units (dollars, seconds). Used more often.
- **Range** (max − min) — crude and sensitive to outliers.
- **IQR** (interquartile range) = $Q_3 - Q_1$ — the spread of the "middle" 50% of data, robust to outliers.

**With numbers.** Checks `[100, 120, 140, 160, 580]` (the last is an outlier).

1. Mean: $\bar{x} = \frac{100+120+140+160+580}{5} = 220$.
2. Deviations from the mean and their squares: $(-120)^2, (-100)^2, (-80)^2, (-60)^2, (360)^2 = 14400, 10000, 6400, 3600, 129600$.
3. Variance: $\sigma^2 = \frac{14400+10000+6400+3600+129600}{5} = 32800$.
4. Standard deviation: $\sigma = \sqrt{32800} \approx 181$.
5. IQR: $Q_1 = 120$, $Q_3 = 160$ → $\text{IQR} = 160 - 120 = 40$.

Notice: one outlier (580) inflated $\sigma$ to 181, while the robust IQR stayed at 40 — it barely noticed the outlier. So on "dirty" business data IQR describes the spread more honestly.

:::note[Divide by n or by n−1?]
Above is the formula for the **whole population** (divide by $n$). For a **sample** (and in practice it's almost always a sample) you use the unbiased estimate — divide by $n-1$ (Bessel's correction). pandas does this by default: `df["x"].std()` uses $n-1$, while `numpy.std()` uses $n$. On large data the difference is negligible, but worth knowing.
:::

## Quantiles and percentiles

A quantile splits ordered data at a given proportion. Percentiles are quantiles in percent:

- **Median** = the 50th percentile ($Q_2$).
- $Q_1$ (25th) and $Q_3$ (75th) — the bounds of the middle half.
- Analytics loves **p90, p95, p99** — e.g. "response time is ≤ X in 95% of cases".

```python
df["amount"].describe()           # count, mean, std, min, 25%, 50%, 75%, max
df["amount"].quantile([0.9, 0.95, 0.99])
```

## Shape: skew and tails

- **Skewness** — which way the tail stretches. Positive: a long right tail (incomes). On skew the mean drifts toward the tail away from the median.
- **Kurtosis** — how "heavy" the tails are, how often extreme values occur.

## Box plot — descriptive statistics in one picture

A box plot shows the median, $Q_1$/$Q_3$ (the box = IQR) and outliers (points beyond the "whiskers") at once:

```python
import seaborn as sns
sns.boxplot(data=df, x="status", y="amount")
```

Handy for comparing spread between groups and catching anomalies — see [visualization](/en/06-visualization/02-chart-types/).

## Practice tasks

<details>
<summary>1. A report says "average check $5000", but most pay ~$1500. How?</summary>

The data is right-skewed: a few very large checks pull the mean up. The "typical" customer is more honestly described by the median (~1500). Always show the median alongside the mean for money and time.

</details>

<details>
<summary>2. Why is IQR more robust to outliers than the range (max − min)?</summary>

The range is computed from the most extreme values — one outlier inflates it. IQR = $Q_3 - Q_1$ relies on the 25th and 75th percentiles and ignores the extreme 25% on each side, so single outliers don't affect it.

</details>

## What's next

- [Probability basics](/en/05-statistics/02-probability-basics/) — probability and conditional probability.
- [Distributions](/en/05-statistics/03-distributions/) — the shapes data takes.
