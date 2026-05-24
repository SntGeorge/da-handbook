---
title: Mixpanel
description: "Mixpanel basics: Insights/Funnels/Retention reports, Flows, differences from Amplitude and when to choose which."
sidebar:
  order: 9
---

:::tip[In short]
Mixpanel is a direct competitor of [Amplitude](/en/08-product-analytics/08-amplitude/): the same event-based analytics, the same funnels/retention/segmentation. The main reports are **Insights**, **Funnels**, **Retention**, **Flows**. Conceptually the tools are very similar; the choice is usually up to the company, and for an analyst it's important to understand the general approach, not to memorize buttons.
:::

:::note[Data flow]
Input: the product sends events via SDK/HTTP API (as in [Amplitude](/en/08-product-analytics/08-amplitude/))
→ Processing: Mixpanel stitches events to user profiles, computes reports in the UI
→ Output: Insights, Funnels, Retention, Flows.
Why: the same product metrics without SQL; the model is identical to Amplitude.
:::

## Why you need it

If you know Amplitude — you'll learn Mixpanel in a day, and vice versa: the "events + properties + reports" model is the same. Knowing either one covers the "product-analytics experience" requirement in a posting.

## Architecture and how data gets in

The same model as Amplitude and in [event tracking](/en/08-product-analytics/07-event-tracking/): the product sends **events** with **properties** via an SDK or HTTP API, there are **user profiles** (user attributes), and identity is stitched by `distinct_id`. The analyst doesn't write the SDK — they design the events and build reports on top of them in the UI. The loading method and data structure are covered in detail on the [Amplitude](/en/08-product-analytics/08-amplitude/) page — Mixpanel works the same way.

## The main reports

| Report | What it does |
|--------|--------------|
| **Insights** | event segmentation and dynamics (analog of Amplitude Segmentation) |
| **Funnels** | conversion and dropoff by steps |
| **Retention** | user return rate |
| **Flows** | actual user paths between events |

## Flows

Flows visualizes **where users go** before/after a chosen event — which routes they take through the product. It helps find unexpected paths and exit points that aren't visible in a strict funnel.

## Differences from Amplitude

| | Mixpanel | Amplitude |
|--|----------|-----------|
| Focus | simplicity, quick reports | deep analytics, behavioral cohorts |
| Behavioral cohorts | present, simpler | a strong suit |
| Entry barrier | a bit lower | a bit higher, but more powerful |
| Free tier | generous | present |

The differences are in nuances and UX rather than principles. Both count by unique users, both build funnels and retention.

:::note[Don't memorize interfaces — understand the model]
In an interview they don't ask "where's which button in Mixpanel". What matters is understanding the general model (events, properties, cohorts, funnels, retention) and a [solid tracking plan](/en/08-product-analytics/07-event-tracking/). Master one tool and you'll switch to the other effortlessly.
:::

## When to choose which

- **Mixpanel** — when you need a quick start and simple, clear reports, a small team.
- **Amplitude** — when deep behavioral analytics and complex cohorts matter.
- In practice the company makes the choice; the analyst adapts. There's no fundamental difference for a junior.

## Practice tasks

<details>
<summary>1. You know Amplitude, at work it turned out to be Mixpanel. How much of a problem is it?</summary>

Minimal. The tools are built on one model (events + properties + funnel/retention/segmentation reports). Switching is a day or two of getting used to the UI. So in a resume it's enough to confidently know one; "I understand event-based product analytics" matters more than the specific brand.

</details>

<details>
<summary>2. Which report shows unexpected user paths between screens?</summary>

Flows (in Amplitude — User Paths): it visualizes the actual routes before and after an event, including unforeseen ones. A funnel checks a predefined sequence, while Flows reveals actual behavior and unexpected exit points.

</details>

## What's next

- [Product frameworks](/en/08-product-analytics/10-product-frameworks/) — AARRR, HEART, North Star.
- [Amplitude](/en/08-product-analytics/08-amplitude/) — comparing the approaches.
