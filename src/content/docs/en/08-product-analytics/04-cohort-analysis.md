---
title: Cohort analysis
description: "Cohort analysis: what a cohort is, types (by date/channel/feature), building a cohort matrix, interpreting trends, implementation in SQL and pandas."
sidebar:
  order: 4
---

:::tip[In short]
A cohort is a group of users united by a common starting event (signup month, channel, feature). Cohort analysis looks at how a group behaves **over time** and separates "the product got better" from "more people just came". A basic tool for retention and [unit economics](/en/08-product-analytics/02-unit-economics/).
:::

## Why you need it

An overall metric averages everyone and hides the dynamics. If retention dropped in March — are the new cohorts worse or are the old ones "aging"? Cohorts separate the effects and show **whether the product is improving month over month**.

## What a cohort is

A group with a common start. Types:

- **By date** — everyone who signed up in one month (the most common).
- **By channel** — those from ads vs from organic.
- **By feature/action** — those who used onboarding vs not.

## The cohort matrix

Rows — cohorts (signup month), columns — how many months passed, cells — retention:

| Cohort | Month 0 | Month 1 | Month 2 | Month 3 |
|--------|---------|---------|---------|---------|
| January | 100% | 45% | 32% | 28% |
| February | 100% | 48% | 35% | — |
| March | 100% | 52% | — | — |

## Interpretation

- **Read down a column** (e.g. "Month 1"): 45% → 48% → 52% — each new cohort retains better. The product is improving. 👍
- **Read across a row**: how a single cohort "ages" — does retention fall to a plateau or to zero.
- **The diagonal** — the effect of a calendar period (a common shock, season) hitting all cohorts at once.

:::caution[Don't compare incomplete cohorts with full ones]
Fresh cohorts (March) don't yet have data for later months — that's "—", not "0". You can't compare January's Month 3 with an empty March. This is a common matrix-reading mistake: young cohorts look "worse" only because they haven't lived to the later periods.
:::

## Implementation

**SQL** — assign a cohort via the user's first event and count activity by period (see [window functions](/en/02-sql/09-window-functions/) and [patterns](/en/02-sql/16-common-patterns/)):

```sql
WITH first_month AS (
    SELECT user_id, DATE_TRUNC('month', MIN(event_date)) AS cohort
    FROM events GROUP BY user_id
)
SELECT f.cohort,
       DATE_PART('month', AGE(DATE_TRUNC('month', e.event_date), f.cohort)) AS period,
       COUNT(DISTINCT e.user_id) AS users
FROM events e JOIN first_month f USING (user_id)
GROUP BY f.cohort, period;
```

**pandas** — `groupby` by cohort + `pivot_table` (a ready recipe — in [Python common patterns](/en/04-python/16-common-patterns/)).

## Practice tasks

<details>
<summary>1. In the "Month 1" column retention grows from old cohorts to new: 40% → 45% → 50%. What does it mean?</summary>

Each new cohort retains better than the previous one a month after start — meaning the product/onboarding is improving over time. A good signal. Reading "down the column" is exactly what answers "is the product getting better".

</details>

<details>
<summary>2. The March cohort is empty in "Month 3". Does it have zero retention?</summary>

No. Empty (—) means fewer than 3 months have passed — the data simply isn't there yet, it's not zero. You can't compare it with full cohorts on later periods, or fresh cohorts will wrongly look like failures.

</details>

## What's next

- [Retention curves](/en/08-product-analytics/05-retention-curves/) — what's built from cohort data.
- [Python common patterns](/en/04-python/16-common-patterns/) — cohort analysis in pandas.
