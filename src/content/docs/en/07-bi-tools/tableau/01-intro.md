---
title: Tableau — introduction
description: "What Tableau is, the difference between Desktop/Public/Server/Online, the free Tableau Public, the interface and your first data connection."
sidebar:
  order: 1
---

:::tip[In short]
Tableau is a powerful BI tool for interactive dashboards, the market leader in the US. For learning and a portfolio, take **Tableau Public** (free). The workflow: connect data → drag fields onto shelves (Rows/Columns) → Tableau builds the chart. Fields split into **dimensions** (categories) and **measures** (numbers).
:::

## Why you need it

Dashboards are asked for in almost every analyst posting. Tableau is one of the two main tools (the other is [Power BI](/en/07-bi-tools/power-bi/01-intro/)). Mastering it means you can turn tables into interactive reports the business reads.

## Tableau editions

| Edition | What it is | Price |
|---------|------------|-------|
| **Tableau Public** | Desktop that saves only to the Public cloud | free |
| **Tableau Desktop** | the full version, local saving | paid |
| **Tableau Server** | a self-hosted server for publishing inside a company | paid |
| **Tableau Cloud (Online)** | the same, but in Tableau's cloud | paid |

:::note[Take Tableau Public to start]
For studying and a portfolio Tableau Public covers almost everything: the same building capabilities as Desktop. The one downside — work is published publicly to the cloud (you can't store it locally or privately). For a pet project that's even a plus — you put the link in your resume.
:::

## The interface

Key elements of a worksheet:

- **Data pane** (left) — the source's fields, split into **Dimensions** (country, date) and **Measures** (sum, count).
- **Columns / Rows** — shelves: drag a field → it becomes an axis.
- **Marks card** — controls color, size, label, chart type.
- **Filters / Pages shelves** — filters and paged viewing.
- Tabs at the bottom: Worksheets (charts), Dashboards, Stories.

## Dimensions vs measures

Tableau's main mental model:

- **Dimension** (blue fields) — categories you **slice** data by: country, product, date. Usually go into Rows/Columns and break down the result.
- **Measure** (green fields) — numbers you **aggregate**: sum, average. By default Tableau sums them.

"Revenue (measure) by country (dimension)" = drag `country` into Columns, `Sales` into Rows.

## The first connection

1. Launch Tableau Public → **Connect** → pick a source (Text file for CSV, Microsoft Excel, or a DB server).
2. Tableau shows the **Data Source** tab — a preview of the tables.
3. Go to a sheet (Sheet 1) — fields are already split into Dimensions/Measures.
4. Drag fields onto the shelves — the chart builds itself.

<details>
<summary>1. Which Tableau edition to take for a portfolio pet project?</summary>

Tableau Public — free and sufficient in capabilities. The only limit: work is published publicly to Tableau's cloud. For a portfolio that's convenient — you give a recruiter a direct link to an interactive dashboard.

</details>

<details>
<summary>2. How does a dimension differ from a measure?</summary>

A dimension is a categorical field that data is sliced into groups by (country, date); a measure is a numeric field that gets aggregated (sum, average). Roughly: dimensions answer "by what", measures answer "what we compute".

</details>

## What's next

- [Connecting data](/en/07-bi-tools/tableau/02-connecting-data/) — Live/Extract, joins, blending.
- [Power BI — introduction](/en/07-bi-tools/power-bi/01-intro/) — the second main BI for comparison.
