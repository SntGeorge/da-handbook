---
title: Looker Studio
description: "Looker Studio — Google's free BI: how it differs from Looker (enterprise), what it's good for, connecting sources and a basic report."
sidebar:
  order: 1
---

:::tip[In short]
Looker Studio (formerly Google Data Studio) is Google's **free** cloud BI. Ideal for pet projects and quick dashboards, especially on top of Google data (Sheets, Analytics, BigQuery). Don't confuse it with **Looker** — that's a separate, expensive enterprise product with the LookML language.
:::

## Why you need it

Tableau Public and Power BI are good, but Looker Studio wins on one thing: it's completely free, runs in the browser (even on a Mac) and connects to Google services in a couple of clicks. For a portfolio and small reports — a great quick start.

## Looker Studio vs Looker

:::caution[These are two different products]
**Looker Studio** — a free self-service BI for dashboards (our hero). **Looker** — a paid Google Cloud enterprise platform with data modeling in the LookML language, for large companies. The names are similar, but these are entirely different tools. In junior postings they almost always mean Looker **Studio**.
:::

## Free for everyone

You only need a Google account — go to [lookerstudio.google.com](https://lookerstudio.google.com/) and work in the browser. No installation, no licenses, reports live in the cloud and are shared by a link like a Google doc.

## Connecting sources

Dozens of connectors, but the Google ecosystem is the strongest:

- **Google Sheets** — the most common source for small projects.
- **Google Analytics 4**, **Google Ads** — natively, for marketing dashboards.
- **BigQuery** — for big data in the [cloud](/en/11-modern-stack/03-bigquery/).
- **PostgreSQL/MySQL**, CSV upload, third-party connectors.

## A basic report

1. **Create → Report** → pick a source (e.g. a Google Sheet).
2. Charts are added to the canvas (scorecard, table, time series, bar) from the panel.
3. Drop a field into a visual's **Dimension** (breakdown) or **Metric** (number).
4. The report is live right away and shared by a link.

The logic is the same "dimension × measure" as in [Tableau](/en/07-bi-tools/tableau/01-intro/) and [Power BI](/en/07-bi-tools/power-bi/01-intro/).

<details>
<summary>1. A posting says "Looker". Is it about the free tool?</summary>

Not necessarily — clarify. "Looker" strictly is the paid enterprise platform with LookML. "Looker Studio" is the free dashboard tool. People often write loosely, but for a junior they almost always mean Studio; it's worth knowing the difference.

</details>

<details>
<summary>2. A quick free dashboard on top of Google Sheets with link sharing. Which BI?</summary>

Looker Studio: free, connects natively to Google Sheets/Analytics, runs in the browser on any OS and is shared by a link like a Google doc. For this scenario it's more convenient than Tableau or Power BI.

</details>

## What's next

- [Looker Studio: the basics](/en/07-bi-tools/looker/02-basics/) — a report, filters, calculated fields, sharing.
- [Metabase and Superset](/en/07-bi-tools/metabase-superset/) — open-source alternatives.
