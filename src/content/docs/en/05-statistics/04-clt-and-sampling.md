---
title: CLT and sampling
description: "The central limit theorem in plain words, standard error, sampling types (random/stratified/cluster), sampling and selection bias."
sidebar:
  order: 4
---

:::tip[In short]
**The central limit theorem (CLT)**: the sample mean is distributed approximately normally, even if the data itself isn't, for a large enough $n$. This is the foundation of all inferential statistics: thanks to the CLT, confidence intervals and t-tests work. But it all collapses if the sample is **biased**.
:::

## Why you need it

We almost never see the whole population — only a sample. The CLT explains why you can draw conclusions about the whole from a sample, and understanding bias explains why sometimes you can't, no matter how much data you have.

## What the CLT says

Take many samples, compute each one's mean — these means form a normal distribution around the true population mean. **Regardless of the shape of the original data** (be it skewed incomes or coin flips), for a large enough sample size (usually $n \geq 30$).

:::tip[Why it's "magic"]
You can draw conclusions about the population mean without even knowing the shape of its distribution. Skewed, strange data — yet the sample mean still behaves predictably normal. That's exactly why most tests work on real business data.
:::

## Standard error

The standard error of the mean (SE) — how much the sample mean "wanders" around the true one:

$$SE = \frac{\sigma}{\sqrt{n}}$$

The key takeaway: precision grows as $\sqrt{n}$, not linearly. **To double the precision, you need 4× more data.** Hence the law of diminishing returns in sample size.

**With numbers.** We measured time on site for 400 users: mean $\bar{x} = 300$ sec, standard deviation $\sigma = 120$ sec.

$$SE = \frac{120}{\sqrt{400}} = \frac{120}{20} = 6 \text{ sec}$$

So the sample mean (300 sec) "wanders" around the true value by about ±6 sec. From this a [confidence interval](/en/05-statistics/05-confidence-intervals/) follows directly: a 95% CI ≈ $300 \pm 1.96 \cdot 6 = [288, 312]$ sec. Want to halve the SE (to 3 sec) — you'd need not 800 but **1600** users.

## Sampling types

| Type | How it's formed | Risk |
|------|-----------------|------|
| **Simple random** | each element with equal probability | needs a full population list |
| **Stratified** | split into strata (regions, segments), draw from each | harder to organize |
| **Cluster** | randomly pick whole groups (cities) | higher variance |

Stratified gives a more precise result when the population is heterogeneous (e.g. different countries with different behavior).

## Sampling bias

:::caution[A large sample doesn't fix bias]
If a sample is systematically unrepresentative, increasing $n$ only measures the **wrong** number more precisely. The main traps:

- **Sampling bias** — the collection method distorts: surveying only active users overstates satisfaction.
- **Selection bias** — those in the sample differ from those not in it: judging churn causes by those who stayed.
- **Survivorship bias** — you see only the "survivors": analyzing only successful companies, ignoring the closed ones.
:::

A famous example — the 1936 poll by phone and car owners (then an attribute of the wealthy): a huge sample gave a confident but **wrong** election forecast.

## Practice tasks

<details>
<summary>1. Income data is heavily skewed. Can you build a confidence interval for the mean?</summary>

Yes — thanks to the CLT the sample mean is distributed approximately normally for large $n$, even if incomes themselves are skewed. That's exactly why methods for the mean work on non-normal data. On small samples skew matters more — be more careful there.

</details>

<details>
<summary>2. To halve the standard error, by what factor should you increase the sample?</summary>

By 4×, since $SE = \sigma/\sqrt{n}$ — precision grows as the square root of $n$. This is the law of diminishing returns: each further precision gain costs disproportionately more data.

</details>

## What's next

- [Confidence intervals](/en/05-statistics/05-confidence-intervals/) — estimating the mean accounting for SE.
- [Hypothesis testing](/en/05-statistics/06-hypothesis-testing/) — how the CLT lets you test differences.
