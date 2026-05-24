---
title: Key metrics
description: "Key product metrics: DAU/WAU/MAU and stickiness, retention and churn, LTV, CAC, LTV/CAC, ARPU vs ARPPU, North Star Metric."
sidebar:
  order: 1
---

:::tip[In short]
Product metrics fall into three groups: **engagement** (DAU/MAU, stickiness), **retention** (retention, churn) and **money** (LTV, CAC, ARPU). The main business-health ratio is **LTV/CAC ≥ 3**: a customer should bring at least three times what it cost to acquire them.
:::

## Why you need it

"Is our product good?" can't be answered without metrics. They turn a vague "we seem to be growing" into numbers you make decisions on. These definitions are asked in every product interview.

## Engagement: DAU / WAU / MAU

- **DAU** — unique users per day, **WAU** — per week, **MAU** — per month.
- **Stickiness = DAU / MAU** — how often they come back. 0.5 means a user visits ~15 days a month (very sticky); 0.1 — occasionally.

:::caution["Unique" is the key word]
DAU/MAU are counted by **unique** users (`COUNT(DISTINCT user_id)`), not by the number of sessions or events. Count events and you get inflated nonsense. It's the same `COUNT(*)` vs `COUNT(DISTINCT)` trap from [SQL aggregations](/en/02-sql/05-aggregations/).
:::

## Retention and churn

- **Retention** — the share of users who returned after N days/weeks. The main product metric (in detail — [retention curves](/en/08-product-analytics/05-retention-curves/)).
- **Churn rate** — the share who left over a period. `churn = 1 − retention`. For subscriptions — how many unsubscribed.

## Money: LTV, CAC, ARPU

| Metric | What it means | Rough formula |
|--------|---------------|---------------|
| **LTV** | how much a customer brings over their lifetime | ARPU × average lifespan |
| **CAC** | how much it cost to acquire a customer | marketing ÷ customers acquired |
| **ARPU** | average revenue per user | revenue ÷ all users |
| **ARPPU** | average revenue per **paying** user | revenue ÷ paying users |

:::note[ARPU vs ARPPU]
`ARPU` divides by **all** users, `ARPPU` — only by **paying** ones. In a freemium product 2–5% pay, so ARPPU is several times higher than ARPU. Confusing them is a common mistake: "average check 2000" (ARPPU) and "revenue per user 60" (ARPU) are about the same thing, but different.
:::

## LTV/CAC — the health ratio

The main indicator of business sustainability:

- **LTV/CAC < 1** — acquisition is loss-making (we spend more than comes back).
- **LTV/CAC ≈ 3** — a healthy benchmark.
- **LTV/CAC > 5** — possibly under-investing in growth (you could acquire more aggressively).

Linked to [unit economics](/en/08-product-analytics/02-unit-economics/) and the payback period.

## North Star Metric

The "north star" is the single metric that best reflects the product's value to the user: for Spotify — listening time, for a marketplace — the number of successful orders. Not revenue directly, but what generates it. Team goals are built around it.

<details>
<summary>1. Stickiness (DAU/MAU) = 0.6. Good or bad?</summary>

Very good: on average a user visits ~18 days a month (0.6 × 30). That's the level of messengers and social networks. For most products 0.1–0.2 is normal, 0.5+ is excellent engagement and a strong habit.

</details>

<details>
<summary>2. In a freemium app ARPU = $0.50, while ARPPU = $15. A contradiction?</summary>

No. ARPU divides by all users (including free ones), ARPPU — only by paying ones. If ~3% pay, then ARPPU ≈ ARPU / 0.03 ≈ 30× larger. Both metrics are correct and describe different things: revenue per any user and per paying user.

</details>

## What's next

- [Unit economics](/en/08-product-analytics/02-unit-economics/) — how LTV and CAC add up to profit.
- [Retention curves](/en/08-product-analytics/05-retention-curves/) — retention in detail.
