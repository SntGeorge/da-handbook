---
title: Visualizations in Power BI
description: "Power BI visualizations: built-in visuals, custom visuals from the marketplace, conditional formatting, tooltips and page tooltips, bookmarks."
sidebar:
  order: 6
---

:::tip[In short]
A visual is built by dragging fields into the right area (Axis/Values/Legend). The built-in visuals cover 95% of tasks; **custom visuals** from the marketplace are for the rare cases. Power BI's strengths: **conditional formatting**, **page tooltips** (a pop-up mini-report) and **bookmarks** (saved states for navigation).
:::

## Why you need it

Measures and the model are the engine, and visuals are what the user sees. A good visual choice and tidy formatting decide whether the report is understood in 5 seconds. Principles — in the [visualization section](/en/06-visualization/01-principles/).

## Built-in visuals

The **Visualizations** panel: bar/line, pie (carefully), tables, matrices, cards for KPIs, maps, scatter, funnel, gauge. You drop a field into a visual's area (Axis, Values, Legend) — the chart builds.

Choose the type by task, not by looks (see [which chart to choose](/en/06-visualization/02-chart-types/)).

## Custom visuals from the marketplace

If the built-in isn't enough — **Get more visuals** (AppSource): thousands of third-party visuals.

:::caution[Third-party visuals are a matter of trust]
Custom visuals are third-party code working with your data. In a corporate environment they're often restricted for security. Use only certified visuals and don't drag random ones from the marketplace into reports with sensitive data.
:::

## Conditional formatting

A powerful Power BI feature: color/icons/bars by value. For example, color negatives red, add data bars to a table, a traffic light by KPI. Configured in the visual's format → Conditional formatting, can be driven by a DAX measure.

## Tooltips and page tooltips

- **A regular tooltip** — pops up on hover, you can add extra fields.
- **A page tooltip** — a whole mini-page report as a tooltip: hover over a region — a mini-dashboard for it pops up. It greatly boosts informativeness without clutter.

## Bookmarks

**Bookmarks** save the report's state (filters, visual visibility). Navigation and interactivity are built on them: view-switching buttons, filter reset, step-by-step reveals. A common technique for "app-like" dashboards.

## Practice tasks

<details>
<summary>1. You want a mini-dashboard to pop up when hovering over a country. What to use?</summary>

A page tooltip: create a separate tooltip page with the needed visuals and assign it as the main visual's tooltip. On hover Power BI shows this mini-report in the context of the specific country. It's more informative than a plain text tooltip.

</details>

<details>
<summary>2. What to keep in mind when adding a marketplace custom visual to a corporate report?</summary>

It's third-party code working with the report's data — a security matter. Prefer certified visuals, check company policy, and don't use random visuals with sensitive data. Often the built-in visuals are enough.

</details>

## What's next

- [Publishing Power BI](/en/07-bi-tools/power-bi/07-publishing/) — publish the report and set up access.
- [Visualization principles](/en/06-visualization/01-principles/) — how not to overload the report.
