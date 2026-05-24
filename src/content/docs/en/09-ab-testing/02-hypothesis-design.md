---
title: Hypothesis design
description: "Designing an A/B test hypothesis: the 'if-then-because' structure, primary and secondary metrics, guardrail metrics, OEC."
sidebar:
  order: 2
---

:::tip[In short]
A good hypothesis is **"if [change], then [metric] will change, because [reason]"**. Before launch you fix **one primary metric** (the decision is made on it) and **guardrail metrics** (what must not break). Deciding by "which metric pops" after the result is a path to self-deception.
:::

## Why you need it

A vague goal "improve the product" isn't testable. A clear hypothesis with a pre-chosen metric protects against fitting the result after the fact (picking the metric that happened to rise). It's the first thing checked in an A/B case.

## The hypothesis structure

The "if — then — because" formula:

> **If** we add a progress bar to onboarding, **then** completion conversion will rise, **because** users see how much is left and abandon less.

The "because" is mandatory: it reflects an understanding of the mechanism, not "let's try and see".

## Primary metric

:::caution[One primary metric, chosen BEFORE the test]
Pick **one** metric you'll decide on, **before** launch. Otherwise after the test you'll be tempted to call success the one that happened to rise (and with many metrics [something pops by chance](/en/05-statistics/06-hypothesis-testing/)). A pre-fixed primary metric is protection against p-hacking.
:::

## Secondary and guardrail

- **Secondary** — additional metrics "for understanding" (they help explain the effect), but the decision isn't made on them.
- **Guardrail** — what **must not get worse**: load time, unsubscribes, revenue, complaints. Even if the primary rose, a guardrail degradation can cancel the rollout.

| Type | Role | Example |
|------|------|---------|
| Primary | make the decision | conversion to purchase |
| Secondary | explain the effect | browse depth |
| Guardrail | don't break | load time, unsubscribes |

## OEC

The **OEC (Overall Evaluation Criterion)** is a single success criterion for the test, sometimes combining several metrics into one that reflects long-term value. For example, not "clicks" (easy to game with clickbait), but "successful sessions without a quick bounce". The OEC protects against optimizing the short-term at the expense of the long-term.

:::note[The metric shouldn't provoke harm]
If the primary is "clicks", the team will unwittingly optimize clickbait, harming the product. A good metric/OEC reflects real user value ([like the North Star](/en/08-product-analytics/10-product-frameworks/)), not a surrogate that's easy to game.
:::

## Practice tasks

<details>
<summary>1. "Let's test the new button and see which metrics rise." What's wrong?</summary>

There's no pre-chosen primary metric and no "because". If you look at all metrics after the fact, one will rise by chance (multiple comparisons), and that gets passed off as success. You need to fix one deciding metric and the mechanism of the expected effect before the test.

</details>

<details>
<summary>2. Why are guardrail metrics needed if there's a primary?</summary>

So the change doesn't "win" the primary at the cost of hidden harm. For example, aggressive pushes raised conversion (primary), but unsubscribes spiked (guardrail) — long-term that's a loss. Guardrails catch such side degradations and can cancel the rollout even with a primary gain.

</details>

## What's next

- [Sample size](/en/09-ab-testing/03-sample-size/) — how much data is needed to catch the effect.
- [Product frameworks](/en/08-product-analytics/10-product-frameworks/) — the North Star and metric choice.
