---
title: Dashboards
description: "Building a dashboard in Tableau: sheets/dashboards/stories, tiled vs floating layout, actions, mobile layout, performance tips."
sidebar:
  order: 6
---

:::tip[In short]
A dashboard is an assembly of several sheets into one interactive screen. Do the layout via **tiled** (a grid, recommended), and the interactivity via [actions](/en/07-bi-tools/tableau/05-parameters-filters/). For speed, minimize the number of sheets and heavy computations on one dashboard.
:::

## Why you need it

A single chart answers one question; a dashboard ties them into a tool where the user explores the data themselves. The ability to build a clear, fast dashboard is what Tableau is learned for.

## Sheets vs Dashboards vs Stories

| Object | What it is |
|--------|------------|
| **Sheet** (worksheet) | one chart |
| **Dashboard** | several sheets + filters on one screen |
| **Story** | a sequence of dashboards/sheets as a narrative presentation |

A Story is for step-by-step [storytelling](/en/06-visualization/04-storytelling/); the workhorse is the Dashboard.

## Layout: tiled vs floating

- **Tiled** — elements in a grid, no overlapping, auto-fitting. Recommended by default: predictable and adaptive.
- **Floating** — free positioning with overlap. Flexible, but easy to have it "fall apart" at another screen size. Use it sparingly (e.g. a floating title).

## Actions

Make a dashboard interactive (Dashboard → Actions):

- **Filter** — a selection on one sheet filters the others.
- **Highlight** — highlight related marks.
- **URL** — navigate to a link.

## Mobile layout

Tableau lets you set a separate layout for phone/tablet (Device Preview). A dashboard can look different on desktop and mobile — for mobile, key widgets are left vertically. If the audience views from a phone, check the mobile layout separately.

## Performance tips

:::tip[How to speed up a dashboard]
- **Fewer sheets on a dashboard** — each sheet = separate queries.
- **Extract instead of Live** on a slow DB ([details](/en/07-bi-tools/tableau/02-connecting-data/)).
- **Filter data at the source**, don't drag the excess.
- Avoid heavy table calcs and a large number of marks on one chart.
- Use **context filters** to cut the volume down to the main computations.
:::

<details>
<summary>1. Tiled or floating for a dashboard's main layout?</summary>

Tiled. Elements arrange into a grid, don't overlap and adapt to size — the dashboard looks predictable on different screens. Leave floating for special cases (a floating title/legend), otherwise the layout will "fall apart".

</details>

<details>
<summary>2. The dashboard opens slowly. The first three steps?</summary>

(1) Reduce the number of sheets on the dashboard — each spawns queries. (2) Switch from Live to Extract if the source is slow. (3) Cut the data volume with source/context filters and remove heavy table calcs.

</details>

## What's next

- [Publishing](/en/07-bi-tools/tableau/07-publishing/) — publish the dashboard for a portfolio or team.
- [Storytelling with data](/en/06-visualization/04-storytelling/) — how to make a dashboard meaningful.
