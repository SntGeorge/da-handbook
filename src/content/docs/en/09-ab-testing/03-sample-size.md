---
title: Sample size
description: "Computing A/B test sample size: parameters alpha/beta/baseline/MDE, calculators, the back-of-envelope formula, how to reduce the needed sample."
sidebar:
  order: 3
---

:::tip[In short]
Sample size is computed **before** launch from four parameters: significance level $\alpha$ (usually 0.05), power $1-\beta$ (usually 0.8), the baseline conversion, and the **MDE** — the minimum effect you want to be able to detect. The main rule: **the smaller the effect you chase, the larger the sample** (it grows quadratically).
:::

## Why you need it

Launching a test "by eye" wastes time: with a small sample even a real effect won't be [significant](/en/05-statistics/06-hypothesis-testing/) (not enough power), and the conclusion "no difference" will be false. Computing in advance tells you how many users and weeks are needed — this is asked in every A/B interview.

## The four parameters

| Parameter | What it sets | Typically |
|-----------|--------------|-----------|
| **$\alpha$** | the false-alarm risk (Type I error) | 0.05 |
| **$1-\beta$** (power) | the chance of catching a real effect | 0.8 |
| **baseline** | the metric's current value | e.g. 5% conversion |
| **MDE** | the minimum meaningful effect | e.g. +0.5 pp |

The **MDE (Minimum Detectable Effect)** is the most important and most subjective: what minimum gain matters to the business. Not "any difference", but what makes shipping the feature worthwhile.

## The back-of-envelope formula

For comparing two conversions, simplified:

$$n \approx \frac{16 \cdot p(1-p)}{\text{MDE}^2}$$

(per group, at $\alpha=0.05$, power=0.8). The key takeaway from the formula — **MDE is in the denominator, squared**:

:::caution[Want to catch half the effect — you need four times the data]
Since MDE is squared, halving the detectable effect **quadruples** the sample. So catching tiny changes is expensive: a test for +0.1 pp may require millions of users and months. A realistic MDE is half the battle of planning.
:::

## Calculators

In practice you don't compute the formula by hand — you use a calculator: **Evan Miller's sample size calculator**, the ones built into Optimizely/VWO, or `statsmodels` in Python:

```python
from statsmodels.stats.power import NormalIndPower
from statsmodels.stats.proportion import proportion_effectsize

effect = proportion_effectsize(0.05, 0.055)     # baseline 5% → 5.5%
n = NormalIndPower().solve_power(effect, alpha=0.05, power=0.8, alternative="two-sided")
```

## How to reduce the needed sample

If there isn't enough data for a reasonable timeframe:

- **Increase the MDE** — agree to catch only a bigger effect (often that's fine for the business anyway).
- **Take a "denser" metric** lower in the funnel or with less variance.
- **Reduce variance** with methods like [CUPED](/en/09-ab-testing/08-advanced-techniques/) — gives the same power on a smaller sample.
- Raise the traffic share in the test (if you can allocate more to the experiment).

<details>
<summary>1. You decide to catch a +0.5 pp effect instead of +1 pp. How does the needed sample change?</summary>

It grows about 4×. In the formula MDE is squared in the denominator, so halving the detectable effect quadruples the sample size. This is the key intuition: small effects are very expensive to catch.

</details>

<details>
<summary>2. The test ran a week, the difference is insignificant. Can you conclude there's no effect?</summary>

No, if the sample fell short of the plan: with insufficient power a real effect simply won't reach significance (Type II error). "Insignificant" ≠ "no effect". First check whether the planned sample accumulated; if not — the conclusion is premature.

</details>

## What's next

- [Randomization](/en/09-ab-testing/04-randomization/) — how to split the sample correctly.
- [Statistics: test power](/en/05-statistics/06-hypothesis-testing/) — where $\alpha$ and $\beta$ come from.
