---
title: Hypothesis testing
description: "Hypothesis testing: H0 and H1, significance level alpha, p-value (what it is and is NOT), Type I and II errors, power, multiple-comparison corrections."
sidebar:
  order: 6
---

:::tip[In short]
Hypothesis testing answers: "is the difference real or just chance?". We state a null hypothesis $H_0$ ("no difference"), compute a **p-value**, and if it's below a threshold $\alpha$ (usually 0.05) we reject $H_0$. The key point: **p-value is NOT the probability that the hypothesis is true**, and significance ≠ importance.
:::

## Why you need it

Conversion rose from 5% to 5.3% — is that the new button's effect or just noise? Hypothesis testing gives a formal answer and underlies [A/B tests](/en/09-ab-testing/01-fundamentals/). Without it, it's easy to mistake random fluctuations for "growth".

## H0 and H1

- **$H_0$ (null)** — "nothing is happening": no difference, zero effect. Assumed true by default.
- **$H_1$ (alternative)** — what we want to show: there is a difference.

The logic is like a court: $H_0$ is "not guilty", and we reject it only if the data gives enough evidence against it.

## The significance level alpha

$\alpha$ is a threshold set **before** the test: how much false-alarm risk we're willing to accept. Usually $\alpha = 0.05$ (5%). If $p < \alpha$ — the result is "statistically significant", we reject $H_0$.

## p-value: what it is and is NOT

The p-value is the probability of seeing **such or more extreme** data **if $H_0$ is true**.

:::caution[What the p-value is NOT]
- ❌ It's **not** the probability that $H_0$ is true.
- ❌ It's **not** the probability that the result is due to chance.
- ❌ A small p-value does **not** mean a large/important effect.

✅ It's only: "how surprising the data is under the assumption of no effect". $p = 0.04$ means "with no effect, such data would occur in 4% of cases", nothing more.
:::

## How it's applied: A/B with numbers

The most common analyst case — comparing two conversions. Group A: 200 purchases out of 5000 (4.0%). Group B: 250 out of 5000 (5.0%). Real difference or noise?

- **$H_0$**: the conversions are equal (difference = 0). **$H_1$**: they differ.
- We run a **two-proportion z-test** — doing it by hand is cumbersome, so in practice it's one line:

```python
from statsmodels.stats.proportion import proportions_ztest
stat, p = proportions_ztest(count=[200, 250], nobs=[5000, 5000])
print(p)        # ≈ 0.016
```

- $p \approx 0.016 < 0.05$ → we reject $H_0$: the rise from 4% to 5% is **statistically significant**, unlikely to be chance.

But before shipping B, check the **[effect size and confidence interval](/en/05-statistics/05-confidence-intervals/)** of the difference: is +1 pp also practically important? Significance says "there's an effect", not "the effect is large".

## Type I and II errors

| | $H_0$ true | $H_0$ false |
|--|------------|-------------|
| **Rejected $H_0$** | Type I error ($\alpha$) — false alarm | ✅ correct |
| **Didn't reject** | ✅ correct | Type II error ($\beta$) — missed the effect |

- **Type I error** ($\alpha$): saw a difference that isn't there (shipped a useless feature).
- **Type II error** ($\beta$): missed a real difference (rejected a good idea).

## Test power

Power $= 1 - \beta$ — the probability of detecting an effect if it really exists. The standard is **0.8** (80%). Power grows with sample size and effect size; it's exactly what the [required sample size](/en/09-ab-testing/03-sample-size/) for an A/B test is computed from.

## Multiple comparisons

:::caution[Test 20 hypotheses — one is "significant" by chance]
At $\alpha = 0.05$, every 20th test gives false significance even with no real effect. Testing many metrics/segments at once, you'll almost certainly find something "significant" by chance (p-hacking). Corrections:

- **Bonferroni** — divide $\alpha$ by the number of tests (strict, conservative).
- **Benjamini-Hochberg (BH)** — controls the false discovery rate, gentler and more practical with many tests.
:::

<details>
<summary>1. A test gave a p-value of 0.03. Does it mean the error probability is 3%, or that the effect is large?</summary>

Neither. $p = 0.03$ means: if there's no effect ($H_0$ true), such or more extreme data would be observed in 3% of cases. It's not the probability the hypothesis is right, and it says nothing about effect size — a tiny difference on a large sample also gives a small p-value.

</details>

<details>
<summary>2. Which is worse — a Type I or Type II error?</summary>

Depends on context. A Type I error (false alarm) is dangerous when rollout is costly/risky. A Type II error (missing an effect) — when missing a real opportunity costs more. The balance is set by choosing $\alpha$ and power in advance, based on the cost of each error.

</details>

## What's next

- [Statistical tests](/en/05-statistics/07-statistical-tests/) — which specific test to apply.
- [A/B testing](/en/09-ab-testing/01-fundamentals/) — hypothesis testing in practice.
