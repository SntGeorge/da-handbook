---
title: Analyzing results
description: "Analyzing A/B results: choosing the test (t-test/z-test/bootstrap), confidence interval for the difference, interpreting the effect, multiple-testing corrections."
sidebar:
  order: 6
---

:::tip[In short]
At the end of a test you look not at a bare p-value but at the **confidence interval for the difference** and the **effect size**. You pick the test by metric: z/t-test for conversions and means, bootstrap for complex metrics. The key to remember: **statistical significance ≠ practical significance**, and with many metrics you need a correction.
:::

## Why you need it

The final analysis turns data into a "ship or not" decision. Doing it wrong (the wrong test, a bare p-value, a forgotten correction) means a bad decision despite an honestly run experiment.

## Which test to choose

| Metric | Test |
|--------|------|
| Conversion (proportion) | z-test for proportions (or chi-square) |
| Mean (check, time) | [t-test](/en/05-statistics/07-statistical-tests/) |
| Skewed/complex (ARPU, ratio) | bootstrap |
| Several groups (A/B/C) | ANOVA, then pairwise with a correction |

The choice of test continues from [statistical tests](/en/05-statistics/07-statistical-tests/): it depends on the metric's type and distribution.

## Confidence interval for the difference

:::tip[Look at the interval, not just the p-value]
A p-value only says "is there a difference", while a [confidence interval](/en/05-statistics/05-confidence-intervals/) for the difference says **how large and with what uncertainty**. "+2.5% [+0.3%, +4.7%]" is far more informative than "p=0.03": you see both the magnitude and the range. If the CI includes zero — the effect is insignificant.
:::

## Interpreting the effect

Statistically significant ≠ important to the business:

- **Effect size**: +0.05% on a huge sample can be "significant" but economically meaningless.
- **Compare with the MDE**: were we even chasing an effect of this scale ([sample size](/en/09-ab-testing/03-sample-size/)).
- **Compute money/ROI**: is the effect worth the rollout and maintenance cost.
- **Check the guardrail**: did it sag, even if the primary rose.

## Multiple-testing correction

If a test has several metrics/segments, some "significances" will appear by chance. Apply a correction ([Bonferroni / Benjamini-Hochberg](/en/05-statistics/06-hypothesis-testing/)) or limit yourself to one primary metric in advance. A post-hoc "segment slice" is especially dangerous — you'll almost certainly find a "winning" segment by chance.

## Practice tasks

<details>
<summary>1. A +0.1% effect at p=0.01 on a 5M sample. Ship the feature?</summary>

Not automatically. p=0.01 indicates statistical significance, but the effect is tiny (+0.1%) — on a giant sample almost any difference becomes significant. You need to weigh it against the MDE and money: will +0.1% pay back development and maintenance, did guardrails sag. Significance ≠ practical importance.

</details>

<details>
<summary>2. The primary metric didn't rise, but "in the mobile-users-from-Russia segment +5%, p<0.05". Can you declare success?</summary>

No — it's a post-hoc segment slice (multiple comparisons): dig around and you'll always find a "winning" segment by chance. Such a result is only a hypothesis for a new confirmatory test on that segment, not grounds for a rollout.

</details>

## What's next

- [Common pitfalls](/en/09-ab-testing/07-common-pitfalls/) — SRM, Simpson, novelty.
- [Confidence intervals](/en/05-statistics/05-confidence-intervals/) — how to read the difference interval.
