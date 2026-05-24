---
title: Anti-patterns
description: "Visualization anti-patterns: 3D charts, truncated Y axis, dual axis, overloaded pie, mismatched comparisons, cherry-picking periods."
sidebar:
  order: 5
---

:::tip[In short]
It's easy to lie with a chart — sometimes unintentionally. Top traps: **3D**, a **truncated Y axis** (inflates tiny differences), a **dual axis** (imposes a false link), an overloaded **pie**, and **cherry-picking** the period. You need to know them doubly: to avoid doing it yourself and to catch it in others' reports.
:::

## Why you need it

A manipulative chart passes the "looks nice" test but leads to a wrong decision. An analyst must both not lie and recognize manipulation in colleagues' and vendors' presentations.

## Truncated Y axis

:::caution[The most common manipulation]
If the Y axis doesn't start at zero, a tiny difference looks huge. Growth from 50.1% to 50.4% on a [50%, 51%] axis looks like a "jump", though the difference is 0.3 pp.

The rule: for **bars** the Y axis must start at zero (height encodes magnitude). For **line** charts truncating is acceptable to see the dynamics — but label the scale honestly and don't pass noise off as a trend.
:::

## 3D charts

Volume distorts: a pie's near sectors seem bigger, bars look taller due to perspective. 3D adds not a byte of information, only perception error. Always flat.

## Dual axis

Two different scales on one chart (e.g. revenue on the left, customer count on the right) create an **illusion of a link**: the lines "correlate" only because you tuned the axis scales. A manipulator can fit the axes to show any "dependency".

Better: two separate charts side by side, or normalize both metrics to a common base (index = 100).

## Overloaded pie

A pie of 10+ sectors is unreadable: the angles of close shares can't be compared. At most 2–3 sectors, otherwise — sorted [bars](/en/06-visualization/02-chart-types/).

## Mismatched comparisons

- Comparing an **incomplete period** with a full one: "March" (10 days) against "February" (whole) — March "sags" artificially.
- **Absolutes instead of shares**: a rise in complaints from 100 to 150 is scary, but if customers tripled, the complaint rate fell.
- Different units/metric definitions in one comparison.

## Cherry-picking periods

Choosing a convenient time window to show the desired trend: "growth over the last month" while it's falling over the year. Always show enough context (several periods), not a slice that confirms the conclusion.

## An honest-chart checklist

| Check | Why |
|-------|-----|
| Bar Y axis from zero? | otherwise it inflates differences |
| No 3D and shadows? | they distort perception |
| One axis / comparable scales? | a dual axis lies about a link |
| Period full and representative? | against cherry-picking |
| Comparing shares where needed? | absolutes mislead |

<details>
<summary>1. A bar chart: Y axis from 95 to 100, the difference "huge". What's the catch?</summary>

The Y axis doesn't start at zero. For bars this is manipulation: height must encode magnitude from zero, otherwise a few-percent difference looks like a multiple. Rebuild with zero — and the "jump" turns out tiny.

</details>

<details>
<summary>2. A chart with two Y axes shows a "link" between ads and sales. Can you trust it?</summary>

With caution. A dual axis lets you tune the scales so any two lines "coincide". This doesn't prove a link. Better to normalize both metrics to an index, or show a scatter and compute a [correlation](/en/05-statistics/08-correlation-regression/) — and remember that correlation ≠ causation.

</details>

## What's next

- [Visualization principles](/en/06-visualization/01-principles/) — the foundation of honest charts.
- [Storytelling with data](/en/06-visualization/04-storytelling/) — delivering the conclusion without manipulation.
