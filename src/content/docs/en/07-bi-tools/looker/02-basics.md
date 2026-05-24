---
title: "Looker Studio: the basics"
description: "Looker Studio in practice: building a dashboard, calculated fields, filters and controls, sharing and embed, when to choose Looker Studio vs another BI."
sidebar:
  order: 2
---

:::tip[In short]
In Looker Studio a dashboard is assembled from visuals by dragging fields, formula metrics — via **calculated fields**, and interactivity is provided by **controls** (drop-down filters, date pickers). Sharing is like a Google doc's. Choose it for free/fast/Google-oriented tasks, and Tableau/Power BI for heavy corporate ones.
:::

## Why you need it

Knowing the basic Looker Studio cycle, you assemble a live dashboard for a pet project in an evening and put the link in your resume. It's the cheapest way to show the dashboarding skill.

## Building a dashboard

1. **Create → Report**, connect a source.
2. Add visuals (Add a chart): a scorecard for KPIs, time series for dynamics, table, bar.
3. Drop fields into a visual's **Dimension** and **Metric**.
4. Style it: theme, titles, layout. **View** mode shows what the viewer sees.

## Calculated fields

New metrics from formulas right in the report (SQL/spreadsheet-style functions):

```
-- margin
Revenue - Cost

-- amount category
CASE WHEN Amount > 2000 THEN "large" ELSE "small" END
```

Created at the source level or for a specific field. The analog of [Tableau's calculated fields](/en/07-bi-tools/tableau/03-calculated-fields/).

## Filters and controls

- **Filter** (at the visual/page level) — hard-limits the data, the viewer can't change it.
- **Control** — an interactive widget for the viewer: a drop-down list, date range picker, search. The viewer adjusts the dashboard themselves.

For a "pick a period and region" dashboard you add a date range control and a list control — the data rebuilds.

## Sharing and embed

Like Google Docs: the **Share** button → by link/by email/publicly, with View or Edit rights. A finished report can be embedded on a site via an iframe.

:::caution[Link access = public]
By opening access to "anyone with the link", you make the data available to anyone who gets the URL. For reports with sensitive data, grant access to specific accounts, not a public link. It's the same risk as any shared Google doc.
:::

## When to choose Looker Studio

| Take Looker Studio | Take Tableau / Power BI |
|--------------------|-------------------------|
| free, pet project, portfolio | corporate requirements |
| data in the Google ecosystem | complex model, heavy DAX/LOD |
| quick dashboard, link sharing | large volumes, RLS, on-premise |
| work from any OS in the browser | advanced computations |

## Practice tasks

<details>
<summary>1. You want the viewer to pick the period and region on the dashboard themselves. Filter or control?</summary>

A control: add a date range control and a list control (by region) — these are interactive widgets the viewer operates. A filter hard-limits the data and isn't available for the viewer to change. For self-driven dashboard adjustment you need controls.

</details>

<details>
<summary>2. When is Looker Studio preferable to Power BI?</summary>

When you need a free quick dashboard, the data is in the Google ecosystem (Sheets, GA4, BigQuery), link sharing matters and you want browser work on any OS. For complex models, heavy computations, large volumes and corporate security, Power BI/Tableau is better.

</details>

## What's next

- [Metabase and Superset](/en/07-bi-tools/metabase-superset/) — open-source BI for self-hosting.
- [Pet project ideas](/en/12-career/09-pet-project-ideas/) — what to build in Looker Studio for a portfolio.
