---
title: Distributions
description: "Probability distributions for an analyst: normal (the 68-95-99.7 rule), binomial, Poisson, exponential, and when to use each."
sidebar:
  order: 3
---

:::tip[In short]
A distribution describes how often different values occur. An analyst needs four: **normal** (height, measurement errors), **binomial** (number of successes out of N trials), **Poisson** (number of events per period), **exponential** (time between events). Knowing the shape matters — many tests assume normality.
:::

## Why you need it

Choosing a statistical test, computing probabilities, understanding "is this value normal" — all rest on the distribution. For example, conversion is fractions of successes (binomial), and orders per hour is an event count (Poisson).

## Discrete vs continuous

- **Discrete** — countable values (number of orders: 0, 1, 2…). Described by the probability of each value.
- **Continuous** — any value on an interval (time, amount). Described by density; probability is the area under the curve.

## The normal distribution

The most important: a symmetric "bell", defined by the mean $\mu$ and standard deviation $\sigma$. Many natural quantities (height, errors) and, thanks to the [CLT](/en/05-statistics/04-clt-and-sampling/), sample means — are nearly normal.

**The 68-95-99.7 rule** — how much data falls in intervals around the mean:

| Interval | Share of data |
|----------|---------------|
| $\mu \pm 1\sigma$ | ≈ 68% |
| $\mu \pm 2\sigma$ | ≈ 95% |
| $\mu \pm 3\sigma$ | ≈ 99.7% |

Hence the rule "a value beyond $3\sigma$ is almost certainly an outlier".

## Binomial

The number of successes in $n$ independent trials with success probability $p$. Example: how many of 1000 visitors will buy (conversion). The mean $= np$.

```python
from scipy import stats
stats.binom.pmf(k=30, n=1000, p=0.025)   # P(exactly 30 purchases)
```

Fractions and conversions in A/B tests are binomial data.

## Poisson

The number of events in a fixed interval, when events are rare and independent: orders per hour, support tickets per day. Defined by the average rate $\lambda$.

```python
stats.poisson.pmf(k=5, mu=3)             # P(5 events if 3 on average)
```

## Exponential

The time **between** Poisson events: how long to wait for the next order, time to equipment failure. Continuous, with a long right tail.

## When to use each

| Data | Distribution |
|------|--------------|
| Height, weight, measurement errors | Normal |
| Fraction of successes out of N (conversion) | Binomial |
| Number of events per period | Poisson |
| Time between events | Exponential |

:::caution[Don't assume normality by default]
Many tests (t-test) assume approximate normality, but real business data (incomes, durations) is often skewed. Check the shape with a histogram or a [normality test](/en/05-statistics/07-statistical-tests/) before choosing a method — otherwise conclusions will be wrong.
:::

## Practice tasks

<details>
<summary>1. What distribution does the number of purchases out of 5000 ad impressions follow?</summary>

Binomial: a fixed number of independent trials ($n=5000$) with success probability $p$ (conversion). The mean number of purchases $= np$. Fractions and conversions are always binomial data.

</details>

<details>
<summary>2. A service's response time, with a mean of 200 ms, came out at 950 ms. Is this an anomaly?</summary>

Depends on the spread. If the data is roughly normal and $\sigma \approx 100$ ms, then 950 ms is $>3\sigma$ from the mean, which by the 68-95-99.7 rule is extremely rare (<0.3%) — a likely outlier. But response times often have a long tail (closer to exponential), and then such a value is less surprising — look at the actual distribution.

</details>

## What's next

- [CLT and sampling](/en/05-statistics/04-clt-and-sampling/) — why means tend toward the normal.
- [Statistical tests](/en/05-statistics/07-statistical-tests/) — the choice of test depends on the distribution.
