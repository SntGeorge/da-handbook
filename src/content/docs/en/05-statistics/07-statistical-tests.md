---
title: Statistical tests
description: "Choosing a statistical test: t-test, normality check, Mann-Whitney U, chi-square, ANOVA — a cheat sheet of which test when."
sidebar:
  order: 7
---

:::tip[In short]
The test is chosen by data type and number of groups: for **means of two groups** — t-test (or Mann-Whitney if the data isn't normal), for **categorical** — chi-square, for **several groups** — ANOVA. The main thing — don't slap a t-test on everything: on non-normal or categorical data it gives wrong conclusions.
:::

## Why you need it

Hypothesis testing ([the previous page](/en/05-statistics/06-hypothesis-testing/)) gives the logic, and the test gives a concrete tool for your data. Applying the wrong test means a false p-value and a wrong decision.

## t-test: comparing means

Checks whether means differ. Three variants:

| Variant | When |
|---------|------|
| **One-sample** | a sample mean vs a known value |
| **Two-sample** | the means of two independent groups (A vs B) |
| **Paired** | before/after on the same objects |

```python
from scipy import stats
stats.ttest_ind(group_a, group_b)        # two-sample
stats.ttest_rel(before, after)           # paired
```

Assumes approximate **normality** and (classically) comparable variances.

## Normality check

The t-test and ANOVA rely on normality — worth checking:

```python
stats.shapiro(data)         # Shapiro-Wilk: p < 0.05 → NOT normal
```

Plus a histogram and a Q-Q plot by eye. On large samples normality tests are too sensitive — look at the chart too.

## Mann-Whitney U: the nonparametric analog

If the data isn't normal, or it's ranks/ordinal — compare distributions with Mann-Whitney U instead of a t-test:

```python
stats.mannwhitneyu(group_a, group_b)
```

It compares not means but the shift of distributions; robust to outliers and skew — a common choice for money and durations.

## chi-square: for categorical data

Checks the association between categorical variables (e.g. "does purchase depend on country") from a contingency table:

```python
import pandas as pd
table = pd.crosstab(df["country"], df["converted"])
stats.chi2_contingency(table)
```

## ANOVA: several groups

When there are **more than two** groups (A/B/C/D), don't run pairwise t-tests (it inflates the [Type I error](/en/05-statistics/06-hypothesis-testing/)). ANOVA checks "is there a difference between at least some groups" in one test:

```python
stats.f_oneway(group_a, group_b, group_c)
```

The nonparametric analog is Kruskal-Wallis.

## Cheat sheet: which test when

| Task | Data | Test |
|------|------|------|
| 2 means, normal | numeric | t-test |
| 2 groups, not normal | numeric/ranks | Mann-Whitney U |
| Before/after on the same objects | numeric | paired t-test |
| Association of categories | categorical | chi-square |
| 3+ groups, normal | numeric | ANOVA |
| 3+ groups, not normal | numeric | Kruskal-Wallis |

:::caution[Don't run pairwise t-tests on many groups]
Comparing 4 groups across all pairs (6 tests) at $\alpha=0.05$ inflates the chance of a false find. Use ANOVA, and only on a significant result — pairwise comparisons with a correction (e.g. Tukey HSD).
:::

## Practice tasks

<details>
<summary>1. You compare time on site (heavily skewed) across two groups. t-test or not?</summary>

Better Mann-Whitney U: time on site is usually non-normal (long right tail), and the t-test assumes normality. Mann-Whitney is robust to skew and outliers. Alternatively, apply a t-test to log-transformed data if it normalizes after that.

</details>

<details>
<summary>2. You're testing 4 landing-page variants. Why not 6 pairwise t-tests?</summary>

Six comparisons at $\alpha=0.05$ sharply raise the chance of a false positive (the multiple-comparisons problem). The right way — ANOVA first (is there a difference at all), then on significance, pairwise tests with a correction.

</details>

## What's next

- [Correlation and regression](/en/05-statistics/08-correlation-regression/) — the relationship between variables.
- [Analyzing A/B results](/en/09-ab-testing/06-analyzing-results/) — tests in real use.
