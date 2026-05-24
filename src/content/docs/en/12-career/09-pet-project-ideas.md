---
title: Pet project ideas
description: "20+ pet project ideas for an analyst's portfolio: public data, your own data, scraping, A/B simulation, dashboards, cohort analysis."
sidebar:
  order: 9
---

:::tip[In short]
A good pet project shows the **full analyst cycle**: question → data → analysis → conclusion → visualization. The best ideas use data you find **personally interesting** (your music, finances, favorite game): motivation is higher, and in an interview you light up telling the story. One project taken to completion is worth more than ten sketches.
:::

## Why you need it

A [portfolio](/en/12-career/02-portfolio/) without projects is empty. These ideas give specifics: what to take to demonstrate SQL, Python, BI and product thinking. Pick what hooks you personally — that's how you'll finish it.

## How to choose and present a project

- **One end-to-end question** the project answers (not "played with data", but "does X affect Y").
- The full cycle: collection → [cleaning](/en/04-python/10-data-cleaning/) → analysis → visualization → **conclusion**.
- A README with the goal, data and results (see [portfolio](/en/12-career/02-portfolio/)).
- Where possible — a live dashboard ([Tableau Public/Looker](/en/07-bi-tools/looker/01-intro/)).

## Public data

Ready datasets — a quick start:

- **Kaggle** — thousands of datasets on any topic.
- **Open government data** — demographics, transport, weather.
- Classic learning bases: sales, NYC taxi, flights.
- [Cohort analysis](/en/08-product-analytics/04-cohort-analysis/) or RFM on an open e-commerce dataset.

## Your own data (the most motivating)

- **Spotify / Last.fm** — analysis of your music over a year (genres, listening seasonality).
- **Apple Health / step counter** — personal activity, sleep, correlations.
- **Personal finances** — a dashboard of spending by category and month.
- **Chat history** — frequency, time of day, activity (with care for privacy).

## Scraping + analysis

Shows [working with APIs/the web](/en/04-python/15-apis-and-scraping/):

- A **job-posting parser** + analysis of the required stack (a live link to the [market overview](/en/00-intro/market-stack-2026/)).
- Prices of goods/real estate over time.
- Analysis of a Telegram channel via the API (activity, topics, growth).

:::caution[Scrape ethically and without personal data]
Respect `robots.txt` and rate limits, don't publish personal data in a public repo, and don't commit tokens/keys ([see scraping ethics](/en/04-python/15-apis-and-scraping/)). Care with data is itself the signal of a mature analyst that recruiters appreciate.
:::

## Simulations and product projects

- **An A/B test simulation**: generate data, check significance, show the [pitfalls](/en/09-ab-testing/07-common-pitfalls/) (peeking, SRM).
- **A funnel and retention** on event data.
- Customer segmentation via [clustering](/en/10-ml-basics/06-clustering/) or RFM.
- Forecasting a simple metric ([regression](/en/10-ml-basics/03-linear-regression/)).

## Idea table by skill

| Project | What it demonstrates |
|---------|----------------------|
| Personal finance dashboard | BI, visualization |
| Job parser + stack | API/scraping, Python, conclusions |
| Cohorts/RFM on e-commerce | SQL, product analytics |
| A/B simulation | statistics, A/B |
| Your music analysis | Python, storytelling |
| Customer segmentation | ML basics, clustering |

<details>
<summary>1. What turns "played with a dataset" into a strong pet project?</summary>

A clear question and a full cycle with a conclusion: the project should answer a specific question (does X affect Y, where do we lose users) and reach a visualization and a meaningful conclusion documented in a README. A set of scattered charts with no question and no conclusion makes no impression.

</details>

<details>
<summary>2. You don't know which project to choose. By what criterion to decide?</summary>

By personal interest in the data (your music, finances, a game, a topic you like). Motivation sharply raises the chance of finishing the project, and in an interview you tell it with enthusiasm — that comes across. A finished project on interesting data beats a "correct but boring" one you'll abandon.

</details>

## What's next

- [Portfolio](/en/12-career/02-portfolio/) — how to present and where to host the project.
- [DA resume](/en/12-career/01-resume/) — how to feature the project in the resume.
