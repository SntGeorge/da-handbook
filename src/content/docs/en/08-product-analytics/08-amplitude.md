---
title: Amplitude
description: "Amplitude basics: events and properties in the UI, charts (segmentation, funnel, retention), cohorts and behavioral cohorts, dashboards."
sidebar:
  order: 8
---

:::tip[In short]
Amplitude is a popular product-analytics platform based on [events](/en/08-product-analytics/07-event-tracking/). Without SQL, you build **segmentation**, **funnels** and **retention** with the mouse, assemble **cohorts** (including behavioral) and dashboards. The quality of all this depends on the quality of event logging.
:::

## Why you need it

Amplitude/Mixpanel are often required in product postings: they let an analyst and PM compute metrics themselves without DB exports. Knowing Amplitude is a frequent plus on a product analyst's resume.

## SDK and data (overview)

Events are sent to Amplitude by the product's code via an SDK (implemented by developers per the [tracking plan](/en/08-product-analytics/07-event-tracking/)). The analyst usually doesn't write the SDK but works with the incoming events and their properties in the UI.

## The main chart types

| Report | Answers the question |
|--------|----------------------|
| **Segmentation** | how often an event occurs, by properties |
| **Funnel** | where people drop off in a sequence of steps |
| **Retention** | do users return over time |
| **User paths / Flows** | which paths they take through the product |

These are the same [funnels](/en/08-product-analytics/03-funnels/) and [retention](/en/08-product-analytics/05-retention-curves/), but built with clicks on top of events.

## Event segmentation

The basic report: you pick an event (`order_completed`), a metric (event count, unique users) and a breakdown by property (`country`, `platform`). You get the dynamics and a comparison of segments without SQL.

## Cohorts and behavioral cohorts

- **Cohort** — a saved group of users (e.g. "signed up in March").
- **Behavioral cohort** — a group by **behavior**: "made ≥ 3 purchases in a month" or "used feature X but not Y". Very powerful: you then plug such cohorts into any report as a filter.

## Dashboards

Several charts are assembled into a dashboard for regular monitoring (like in [BI tools](/en/07-bi-tools/), but tailored to events and product metrics).

:::note[Amplitude counts by unique users]
By default many reports operate on unique users, not events — which is right for product metrics (DAU, retention). But always check what's selected in the metric ("unique users" vs "event totals"): mix them up and you'll get incomparable figures.
:::

## Practice tasks

<details>
<summary>1. You need to find which onboarding step users drop off at. Which Amplitude report?</summary>

Funnel: you set the sequence of onboarding events, and Amplitude shows the conversion and dropoff at each step. Then you can segment by platform/channel to see whose drop it is. It's [funnel analysis](/en/08-product-analytics/03-funnels/) without SQL.

</details>

<details>
<summary>2. How is a behavioral cohort more useful than a signup-date cohort?</summary>

It groups by actions ("made 3+ purchases", "activated a feature"), not by arrival time. This lets you study and target users by actual behavior — e.g. compare retention of those who reached a key action with those who didn't. More flexible than a fixed date.

</details>

## What's next

- [Mixpanel](/en/08-product-analytics/09-mixpanel/) — Amplitude's competitor, what's different.
- [Event tracking](/en/08-product-analytics/07-event-tracking/) — without quality events the reports are useless.
