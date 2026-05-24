---
title: Common pitfalls
description: "A/B test pitfalls: Sample Ratio Mismatch (SRM), Simpson's paradox, novelty/primacy effects, network effects, survivorship bias."
sidebar:
  order: 7
---

:::tip[In short]
Even correct statistics won't save you from design traps. The main ones: **SRM** (the split isn't 50/50 → a bug, the test is invalid), **Simpson's paradox** (the overall conclusion is the opposite of the per-segment ones), the **novelty effect** (novelty temporarily inflates the metric) and **network effects**. These terms are top A/B interview questions.
:::

## Why you need it

The most expensive A/B mistakes aren't in the formulas, but in the test measuring the wrong thing. Knowing the traps helps you not mistake an artifact for a result and recognize a broken test in colleagues' work.

## SRM (Sample Ratio Mismatch)

Planned a 50/50 split, but got 52/48? That's a **bug signal**, not chance.

:::caution[SRM makes the test invalid]
On large samples even a small deviation from the planned shares is statistically impossible by chance — meaning randomization, logging is broken, or some users got "lost" (e.g. the new variant crashes more often and users fail to log). Check the group ratio with a **chi-square** test; under SRM the test result can't be trusted, you must fix the cause.
:::

## Simpson's paradox

The overall trend is opposite to the subgroup trends. The classic: variant B is worse overall, but **better on both mobile and desktop** separately — because B happened to get more mobile users (where conversion is inherently lower).

| Segment | A | B |
|---------|---|---|
| Desktop | 10% | **12%** |
| Mobile | 4% | **5%** |
| **Total** | **8%** | **7%** ← contradiction |

Conclusion: always check key segments and watch their balance (stratification during [randomization](/en/09-ab-testing/04-randomization/)).

## Novelty and primacy effects

- **Novelty** — users click on the new thing out of curiosity; the metric temporarily rises and then settles. A short test overestimates the effect.
- **Primacy** — the opposite: existing users initially resist the change, the metric temporarily drops.

Cured by sufficient test duration and analysis by cohort/time (did the effect stabilize).

## Network effects

In social networks/marketplaces groups affect each other, and a regular A/B is [distorted](/en/09-ab-testing/01-fundamentals/). You need cluster designs or [switchback](/en/09-ab-testing/08-advanced-techniques/).

## Survivorship bias

Analyzing only "survivors" distorts the conclusion: e.g. measuring engagement only among active users, ignoring those who left because of the change. Related to [sampling bias](/en/05-statistics/04-clt-and-sampling/).

## Practice tasks

<details>
<summary>1. Planned 50/50, got 53/47 on a 1M sample. Chance?</summary>

No — it's SRM. On a million users a 53/47 deviation is statistically impossible under a fair 50/50 split (checked by chi-square). So there's a bug in randomization/logging, or some users are lost. The test is invalid until the cause is fixed; you can't trust its results.

</details>

<details>
<summary>2. Variant B loses overall but wins on both mobile and desktop. How, and what's the conclusion?</summary>

It's Simpson's paradox: B happened to get more users from a low-baseline-conversion segment (mobile), which dragged the overall figure down despite winning in each segment. Read the result by balanced segments; the overall aggregate misleads here due to the skewed group composition.

</details>

## What's next

- [Advanced techniques](/en/09-ab-testing/08-advanced-techniques/) — CUPED, switchback, bandits.
- [CLT and sampling](/en/05-statistics/04-clt-and-sampling/) — more on biases.
