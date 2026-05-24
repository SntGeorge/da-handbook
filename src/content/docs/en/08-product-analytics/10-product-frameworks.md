---
title: Product frameworks
description: "Product metric frameworks: AARRR (pirate metrics), Google HEART, North Star Metric, OKRs on product metrics — which when."
sidebar:
  order: 10
---

:::tip[In short]
Frameworks are ready-made "skeletons" so you don't pick metrics chaotically. **AARRR** structures the lifecycle funnel (acquired → activated → retained → referral → money), **HEART** — the quality of the user experience, **North Star** — the one main value metric. They don't compete but solve different tasks.
:::

## Why you need it

"Which metrics to measure?" — without structure it's easy to drown in dozens of numbers. Frameworks give a proven skeleton: where to start, what connects to what, which metric is the main one. In product interviews knowing AARRR and North Star is almost mandatory.

## AARRR (Pirate Metrics)

The user-lifecycle funnel by stages (the name reads like "aarrr", hence "pirate metrics"):

| Stage | Question | Example metric |
|-------|----------|----------------|
| **Acquisition** | how do they find us? | traffic, CAC by channel |
| **Activation** | first successful experience? | % reaching the "aha moment" |
| **Retention** | do they return? | [retention](/en/08-product-analytics/05-retention-curves/) |
| **Referral** | do they recommend? | virality, NPS |
| **Revenue** | do they pay? | conversion to payment, LTV |

Handy for understanding **at which stage you lose** users, and linking to [funnels](/en/08-product-analytics/03-funnels/).

## Google HEART

A user-experience quality framework (for UX metrics):

- **Happiness** — satisfaction (surveys, NPS).
- **Engagement** — involvement (frequency, depth of use).
- **Adoption** — uptake of the new (how many started using a feature).
- **Retention** — retention.
- **Task success** — task success (conversion, completion time, errors).

HEART complements AARRR: where AARRR is about the business funnel, HEART is about experience quality.

## North Star Metric

The one metric that best reflects value to the user ([see key metrics](/en/08-product-analytics/01-key-metrics/)). Goals are built around it: all teams influence the North Star via their driver metrics.

:::caution[North Star is not revenue directly]
Taking revenue as the North Star is a common mistake. Revenue is a consequence, while the North Star should reflect the **user value** that generates revenue (listening time, successful orders, messages sent). Chasing money directly, it's easy to harm the product (dark patterns), killing long-term growth.
:::

## OKRs on product metrics

OKRs (Objectives & Key Results) link a goal with measurable results based on metrics: Objective — "improve new-user retention", Key Results — "D7 retention from 20% to 28%", "activation from 40% to 50%". Metrics from the frameworks above become Key Results.

## Which framework when

| Task | Framework |
|------|-----------|
| Understand the lifecycle funnel | AARRR |
| Assess UX/experience quality | HEART |
| Set a single focus for the team | North Star |
| Set measurable goals | OKRs on metrics |

<details>
<summary>1. Why is revenue a poor choice for a North Star Metric?</summary>

Revenue is a consequence of value, not the value itself. The North Star should reflect the benefit to the user that leads to money (e.g. successful orders). Chasing revenue directly, teams tend toward dark patterns and short-term tricks that harm retention and long-term growth.

</details>

<details>
<summary>2. Conversion to purchase is good, but users don't return. Which AARRR stage is sagging?</summary>

Retention. Acquisition, Activation and Revenue may be working, but without users returning the business is a "leaky bucket". AARRR helps localize the problem by stage: here the focus is retention, not acquisition.

</details>

## What's next

- [Key metrics](/en/08-product-analytics/01-key-metrics/) — the North Star and driver metrics.
- [A/B testing](/en/09-ab-testing/01-fundamentals/) — how to improve framework metrics testably.
