---
title: Amplitude
description: "Amplitude from connection to report: how events get in (SDK/API), how the data is structured, reports (segmentation/funnel/retention), cohorts, dashboards, limits."
sidebar:
  order: 8
---

:::tip[In short]
Amplitude is a popular product-analytics platform based on [events](/en/08-product-analytics/07-event-tracking/). Without SQL, you build **segmentation**, **funnels** and **retention** with the mouse, assemble **cohorts** (including behavioral) and dashboards. The quality of all this depends on the quality of event logging.
:::

:::note[Data flow]
Input: the product sends events via SDK/HTTP API (per the [tracking plan](/en/08-product-analytics/07-event-tracking/))
→ Processing: Amplitude stitches events to users and computes metrics with clicks in the UI
→ Output: funnels, retention, segmentation, cohorts, dashboards.
Why: PM and analyst compute product metrics themselves, without DB exports.
:::

## Why you need it

Amplitude/Mixpanel are often required in product postings: they let you compute metrics yourself, without going to engineers or SQL. Knowing Amplitude is a frequent plus on a product analyst's resume.

## How data gets in

Amplitude is a cloud service (SaaS): you register a project, get an **API key**, and the product starts sending events:

- **SDK** — for web, iOS/Android, the backend; implemented by developers per the [tracking plan](/en/08-product-analytics/07-event-tracking/).
- **Server-to-server HTTP API** — the backend sends events directly (for server-side actions like payment).
- **Import/connectors** — historical loads, integrations with a CDP (Segment) and the [DWH](/en/11-modern-stack/01-cloud-dwh-overview/).

An analyst usually doesn't write the SDK but **designs which events and properties to log** — and all subsequent analytics depends on that.

## How the data is structured

Three building blocks (in detail — [event tracking](/en/08-product-analytics/07-event-tracking/)):

- **Event** — an action (`order_completed`) with **event properties** (`amount`, `payment_method`).
- **User properties** — user attributes (`plan`, `country`).
- **Identity** — Amplitude stitches anonymous actions (`device_id`) to a logged-in `user_id`, so the user's path is unified before and after signup.

## How to work with it: the main reports

| Report | Answers the question |
|--------|----------------------|
| **Segmentation** | how often an event occurs, by properties |
| **Funnel** | where people drop off in a sequence of steps |
| **Retention** | do users return over time |
| **User paths / Flows** | which paths they take through the product |

These are the same [funnels](/en/08-product-analytics/03-funnels/) and [retention](/en/08-product-analytics/05-retention-curves/), but with clicks on top of events. The basic report is **Event Segmentation**: you pick an event (`order_completed`), a metric (event count / unique users) and a breakdown by property (`country`, `platform`).

**Cohorts:**
- **Cohort** — a saved group (e.g. "signed up in March").
- **Behavioral cohort** — a group by **behavior** ("made ≥ 3 purchases", "used feature X but not Y"). Very powerful: you plug such a cohort as a filter into any report.

Several reports are assembled into a **dashboard** for regular monitoring.

:::note[Amplitude counts by unique users]
By default many reports operate on unique users, not events — which is right for product metrics (DAU, retention). But always check what's selected in the metric ("unique users" vs "event totals"): mix them up and you'll get incomparable figures.
:::

:::caution[Limits: Amplitude is not a DWH]
Amplitude is strong at ready-made product reports over events, but it's **not a replacement for SQL and a warehouse**: arbitrary JOINs with billing/CRM, complex custom logic and "raw" data access are limited. For deep ad-hoc, raw events are often **exported to a [DWH](/en/11-modern-stack/01-cloud-dwh-overview/)** and analyzed there. Amplitude is for quick product questions, not all of a company's analytics.
:::

**The flow end to end:** the product logs events → Amplitude stitches them to users → you get funnels, retention and segments with clicks, without writing a line of SQL.

<details>
<summary>1. You need to find which onboarding step users drop off at. Which report?</summary>

Funnel: you set the sequence of onboarding events, and Amplitude shows the conversion and dropoff at each step. Then you segment by platform/channel to see whose drop it is. It's [funnel analysis](/en/08-product-analytics/03-funnels/) without SQL.

</details>

<details>
<summary>2. How is a behavioral cohort more useful than a signup-date cohort?</summary>

It groups by actions ("made 3+ purchases", "activated a feature"), not by arrival time. This lets you study and target users by actual behavior — e.g. compare retention of those who reached a key action with those who didn't. More flexible than a fixed date.

</details>

<details>
<summary>3. A PM asks for a complex report joining events with CRM billing data. Do it in Amplitude?</summary>

Probably not: Amplitude is tuned for events, and arbitrary joins with external systems and raw access are limited in it. Such analysis is easier on an export of events to a DWH + SQL. Amplitude is for quick product questions (funnels, retention), not cross-system analytics.

</details>

## What's next

- [Mixpanel](/en/08-product-analytics/09-mixpanel/) — Amplitude's competitor, what's different.
- [Event tracking](/en/08-product-analytics/07-event-tracking/) — without quality events the reports are useless.
