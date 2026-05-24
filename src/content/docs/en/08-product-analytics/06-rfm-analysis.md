---
title: RFM segmentation
description: "RFM segmentation: Recency, Frequency, Monetary — computation, segments (champions, at-risk, lost), SQL implementation, use in marketing."
sidebar:
  order: 6
---

:::tip[In short]
RFM splits customers along three axes: **Recency** (how recently they bought), **Frequency** (how often), **Monetary** (how much). Each gets a score (usually 1–5), and segments are defined by the combination — "champions", "dormant", "lost". A simple but powerful way to work with the base individually, without any ML.
:::

## Why you need it

The "average customer" doesn't exist. One buys every week, another left six months ago. RFM groups customers by actual behavior so you can treat them differently: who to retain, who to reactivate, who not to spend budget on.

## The three dimensions

| Letter | What it means | Higher score if |
|--------|---------------|-----------------|
| **R** — Recency | how recent the last purchase | bought recently |
| **F** — Frequency | how often they buy | buys often |
| **M** — Monetary | total revenue | spent more |

## Computing the scores

Each dimension is cut into quantiles (usually 5 groups = scores 1–5):

- **R**: the fresher the purchase, the higher the score (small recency → R=5).
- **F** and **M**: the higher the frequency/amount, the higher the score.

A customer gets three digits, e.g. `R=5, F=4, M=5` → "fresh, frequent, high-value".

:::caution[Recency is counted in reverse]
For F and M "more = better = higher score". For Recency it's the opposite: small recency (bought yesterday) is good, so a **high** score. A common mistake is assigning recent buyers a low R. Sort R by ascending recency and invert the scores.
:::

## Segments

By the R, F, M combination groups are defined (simplified):

| Segment | Profile | What to do |
|---------|---------|------------|
| **Champions** | R↑ F↑ M↑ | protect, loyalty program |
| **Loyal** | F↑, stable | upsell, recommendations |
| **At-risk** | once active, R↓ | reactivation, win-back discount |
| **Lost** | haven't bought in a long time | minimal budget or a last chance |
| **New** | R↑, low F | onboarding, a second order |

## RFM in SQL

`NTILE(5)` cuts customers into 5 groups per dimension ([window functions](/en/02-sql/09-window-functions/)):

```sql
SELECT customer_id,
       NTILE(5) OVER (ORDER BY last_order_date)        AS r,  -- fresher → higher
       NTILE(5) OVER (ORDER BY order_count)            AS f,
       NTILE(5) OVER (ORDER BY total_spent)            AS m
FROM customer_stats;
```

Then a segment is assigned by the `r, f, m` combination via `CASE`.

## Use in marketing

RFM is the basis of CRM campaigns: "champions" — early access to new releases, "at-risk" — a win-back discount email, "lost" — a last reactivation or removal from paid ads. Budget goes where the return is higher, rather than being spread across the whole base.

## Practice tasks

<details>
<summary>1. A customer: R=5, F=1, M=2. Which segment and what to do?</summary>

Bought recently for the first time (fresh, but rare and low-value) — this is a "New" customer. The task is to get them to a second purchase: onboarding, reminders, an incentive to reorder. Not a "champion" (no frequency or amount) and not "lost" (R is high).

</details>

<details>
<summary>2. Why for Recency does a high score = small recency, not large?</summary>

Because a recent purchase is a good sign (the customer is active), and good corresponds to a high score. Large recency = the customer is cooling = low R. This sets R apart from F and M, where "larger value = higher score". Reverse the direction and you'll ruin the whole segmentation.

</details>

## What's next

- [SQL window functions](/en/02-sql/09-window-functions/) — `NTILE` for splitting into quantiles.
- [Product frameworks](/en/08-product-analytics/10-product-frameworks/) — where RFM fits in the big picture.
