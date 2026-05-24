---
title: Visualization principles
description: "Data visualization principles: Tufte's data-to-ink ratio, chartjunk, Cleveland's perception hierarchy, pre-attentive attributes."
sidebar:
  order: 1
---

:::tip[In short]
A good chart is **maximum data with minimum decoration**. Remove everything that carries no information (chartjunk), and remember Cleveland's perception hierarchy: people read length more accurately than area, and area more accurately than color. That's why bars are more honest than pies.
:::

## Why you need it

A chart is a communication tool, not report decoration. The principles below help build charts that read in a second and don't mislead — valued both in dashboards and in interviews.

## Data-to-ink ratio (Tufte)

Edward Tufte introduced the idea: the share of "ink" spent on the data itself should be maximal. Everything else is a candidate for removal.

- Remove heavy borders, background fills, excess gridlines.
- Put labels right by the data rather than in a distant legend, where possible.
- Less decor → the point reads faster.

## Chartjunk

**Chartjunk** is visual clutter that carries no information: 3D effects, shadows, gradients, background images, fill patterns.

:::caution[3D almost always hurts]
Volume distorts perception: a 3D pie visually inflates the near sectors, shadows make heights hard to compare. 3D almost never adds meaning, yet it consistently distorts the data. Keep it flat.
:::

## Perception hierarchy (Cleveland)

William Cleveland experimentally ranked which ways of encoding a quantity people read **most accurately** (best to worst):

1. Position on a common scale (points on one axis)
2. Length (bars)
3. Angle / slope
4. Area
5. Volume
6. Color / saturation

The practical conclusion: for precise number comparison — **bars** (length), not pies (angle/area). Color — for categories and accents, not for precise quantities.

## Pre-attentive attributes

Some properties the brain notices **instantly**, before conscious attention: color, size, orientation, position. Accents are built on this:

- One red bar among gray ones — the eye finds it immediately.
- No need to "circle it with an arrow" — highlighting by color/size is enough.

Use pre-attentive attributes sparingly: if everything is highlighted, nothing is.

## Stephen Few's principles (dashboards)

- Context beats pixel-precision: show a comparison (plan/actual, prior period).
- Minimal colors, a unified style, aligned elements.
- A dashboard is for monitoring, not "everything at once on one screen".

## Practice tasks

<details>
<summary>1. You need to precisely compare revenue across 8 departments. Pie or bars?</summary>

Bars. By Cleveland's hierarchy people read length more accurately than a pie's angle/area, especially with many sectors close in size. A pie works at most for 2–3 "part of a whole" shares, and even then with caveats.

</details>

<details>
<summary>2. What is chartjunk and why remove it?</summary>

It's visual elements with no informational load: 3D, shadows, gradients, background images, excess gridlines. They lower the data-to-ink ratio, distract, and often distort perception. Removing the clutter makes the data clearer and more honest.

</details>

## What's next

- [Which chart to choose](/en/06-visualization/02-chart-types/) — the chart type for the task.
- [Anti-patterns](/en/06-visualization/05-common-mistakes/) — how charts lie.
