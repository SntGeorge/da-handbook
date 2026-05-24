---
title: Confidence intervals
description: "The confidence interval: what it actually means, computing it for a mean and a proportion, bootstrap, common interpretation mistakes."
sidebar:
  order: 5
---

:::tip[In short]
A confidence interval (CI) is a range in which the true value of a parameter most likely lies. **A 95% CI means: if you repeat the experiment many times, 95% of such intervals will cover the truth** — it's a property of the method, not a probability for a specific interval. Understanding this separates an analyst from a "chart drawer".
:::

## Why you need it

A point estimate ("conversion 5%") doesn't say how confident we are. A CI adds error bounds ("5% ± 1%"), and that changes decisions: the intervals [4.9%, 5.1%] and [1%, 9%] mean very different confidence for the same 5% estimate.

## What a 95% CI actually means

:::caution[The most common interpretation mistake]
**Wrong:** "the true mean lies in this interval with 95% probability".
**Right:** "if you resample many times and build such an interval each time, 95% of them will cover the true mean".

The true parameter is fixed, the interval is random. A specific computed interval either covered the truth or not; 95% is the reliability of the **procedure**, not a probability for one interval. Interviews love testing this.
:::

## Computing it for a mean

$$\bar{x} \pm z \cdot \frac{\sigma}{\sqrt{n}}$$

where $z = 1.96$ for 95%. The width depends on the spread $\sigma$ and the sample size $n$ (via the [standard error](/en/05-statistics/04-clt-and-sampling/)).

```python
from scipy import stats
import numpy as np

data = df["amount"]
mean, se = data.mean(), stats.sem(data)
stats.t.interval(0.95, len(data)-1, loc=mean, scale=se)   # (lower, upper)
```

In practice the t-distribution is used (not $z$), especially for small samples.

## Computing it for a proportion

For conversions and proportions:

$$\hat{p} \pm z \sqrt{\frac{\hat{p}(1-\hat{p})}{n}}$$

Example: 50 purchases out of 1000 → $\hat{p}=0.05$, 95% CI ≈ [3.6%, 6.4%]. The larger $n$, the narrower the interval.

## Bootstrap

When there's no formula or the distribution is strange — **bootstrap**: repeatedly resample with replacement, compute the statistic, look at its spread:

```python
import numpy as np
boot = [np.random.choice(data, len(data), replace=True).mean() for _ in range(10000)]
np.percentile(boot, [2.5, 97.5])          # 95% CI from percentiles
```

A universal method: works for the median, percentiles and any complex metric.

## Common mistakes

- Treating 95% as a probability for a specific interval (see above).
- Thinking 95% of the data lies in the CI — no, the CI is about the **parameter** (the mean), not individual values.
- Comparing groups "by eye via CI overlap" instead of a [hypothesis test](/en/05-statistics/06-hypothesis-testing/) — overlap doesn't always mean the absence of a significant difference.

## Practice tasks

<details>
<summary>1. "95% CI for the mean = [100, 120]". Is "the mean lies here with 95% probability" correct?</summary>

Strictly — no. The true mean is fixed: it's either in [100, 120] or not. The 95% refers to the procedure: across many repetitions, 95% of built intervals will cover the truth. It's about the method's reliability, not the specific interval.

</details>

<details>
<summary>2. How do you narrow a confidence interval?</summary>

Increase the sample size $n$ (width ∝ $1/\sqrt{n}$) or lower the confidence level (90% is narrower than 95%, but riskier). Reducing the data's spread $\sigma$ usually isn't possible — it's a property of the population. The main lever is more data.

</details>

## What's next

- [Hypothesis testing](/en/05-statistics/06-hypothesis-testing/) — p-value and significance of differences.
- [A/B testing](/en/09-ab-testing/01-fundamentals/) — where CIs are applied in practice.
