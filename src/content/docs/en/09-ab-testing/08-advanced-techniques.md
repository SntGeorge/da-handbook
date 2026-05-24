---
title: Advanced techniques
description: "Advanced A/B techniques: CUPED for variance reduction, switchback for network effects, multi-armed bandits, quasi-experiments (diff-in-diff, RDD)."
sidebar:
  order: 8
---

:::tip[In short]
When a regular A/B isn't enough: **CUPED** reduces variance and speeds up the test (the same power on a smaller sample), **switchback** gets around network effects, **multi-armed bandits** dynamically route traffic to the best variant, and **quasi-experiments** (diff-in-diff, RDD) help when randomization is impossible. This is senior level — know what exists and when to apply it.
:::

## Why you need it

A basic A/B hits limits: low traffic, network effects, the cost of a "losing" variant. Advanced methods get around them. Senior interviews ask about CUPED and bandits; a junior just needs the idea.

## CUPED — variance reduction

**CUPED** (Controlled-experiment Using Pre-Experiment Data) uses data about the user from **before** the test to remove the "inherent" difference between people from the metric. Less variance → a [smaller sample size](/en/09-ab-testing/03-sample-size/) for the same power (often −20–50% time).

The idea: if we know a user already spent a lot before the test, we subtract that baseline and look at the **change** itself, not the original spread between people.

## Switchback

For [network effects](/en/09-ab-testing/07-common-pitfalls/) (taxi, delivery, marketplace), where you can't isolate users: switch a **whole region/market** between variants over time intervals (hour A, hour B…) and compare periods. The experiment unit is "region × time", not a user.

## Multi-armed bandits

Instead of a fixed split, bandits **dynamically** reallocate traffic toward the winning variant during the test:

| | Classic A/B | Bandit |
|--|-------------|--------|
| Split | fixed | adaptive |
| Goal | accurate effect estimate | minimize losses, deliver "the best" faster |
| When | a precise conclusion is needed | many variants, short campaigns (banners, headlines) |

:::note[Bandit ≠ always better than A/B]
Bandits are good when it's important to quickly route traffic to the winner (promos, content), but worse for an accurate effect estimate and learning "why". For long-horizon product decisions a classic A/B with an honest estimate is usually preferable.
:::

## Quasi-experiments

When randomization is impossible ([fundamentals](/en/09-ab-testing/01-fundamentals/)):

- **Difference-in-differences (diff-in-diff)** — rolled out a feature in one city, compare the metric's change there with the change in a similar "control" city. Subtract the common trend.
- **Regression discontinuity (RDD)** — the effect at a threshold boundary (e.g. a discount when the check > X): compare those just above and just below the threshold.

Weaker than a true A/B (causation isn't guaranteed as strictly), but better than bare observation.

## Practice tasks

<details>
<summary>1. Traffic is low, the test needs 8 weeks. Which method can shorten it without losing power?</summary>

CUPED: using users' pre-experiment data, it reduces the metric's variance, and thus requires a smaller sample for the same power — often cutting the timeframe by 20–50%. It's a "free" speedup without changing the MDE and without peeking.

</details>

<details>
<summary>2. You're testing an order-dispatch algorithm in a taxi service across a whole city. Why won't a regular A/B do?</summary>

Network effects: drivers and passengers in the groups affect each other (one car pool), there's no isolation. You need switchback — switch the whole city between variants over time intervals and compare periods, where the unit is "city × time", not an individual user.

</details>

## What's next

- [Experimentation culture](/en/09-ab-testing/09-experimentation-culture/) — how to embed tests in the process.
- [Bayesian vs frequentist](/en/05-statistics/09-bayesian-vs-frequentist/) — bandits grow from Bayes.
