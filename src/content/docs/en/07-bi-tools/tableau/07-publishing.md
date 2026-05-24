---
title: Publishing
description: "Where to publish Tableau dashboards: Tableau Public for a portfolio, Tableau Cloud/Server for a company, an overview of embedded analytics."
sidebar:
  order: 7
---

:::tip[In short]
A finished dashboard needs to be published. For a **portfolio** — Tableau Public (free, a public link for your resume). Inside a **company** — Tableau Cloud (cloud) or Server (self-hosted) with access control. Embedding into a site/product is embedded analytics.
:::

## Why you need it

A dashboard in a local file won't be seen by anyone. Publishing turns it into a shareable link: for a junior it's primarily a way to show work to a recruiter.

## Tableau Public — for a portfolio

Free publishing to the Tableau Public cloud:

- **File → Save to Tableau Public** → the work is published, you get a link.
- A profile on [public.tableau.com](https://public.tableau.com/) = your dashboard portfolio.
- It can be embedded on a personal site.

:::caution[Tableau Public is all public]
Any dashboard on Tableau Public is visible to everyone on the internet, and so is the data. **Never publish real/sensitive company data there** — only anonymized or open datasets. For a pet project, use public datasets.
:::

## Tableau Cloud / Server — for a company

| Option | Where it lives | For whom |
|--------|----------------|----------|
| **Tableau Cloud (Online)** | in Tableau's cloud | without your own infrastructure |
| **Tableau Server** | on the company's servers | strict data control, on-premise |

They provide privacy, access management (who sees which dashboards), extract refresh schedules and [row-level security](/en/07-bi-tools/power-bi/07-publishing/) (different users see different rows).

## Embedded analytics (overview)

Tableau dashboards can be embedded into web apps and portals (iframe or JavaScript API), so analytics lives inside the company's product. That's already an engineering task; for an analyst it's enough to know the capability exists and that access is managed by Server/Cloud.

<details>
<summary>1. Where to publish a dashboard for a resume, and what to keep in mind?</summary>

On Tableau Public — free, gives a public link and a portfolio profile. The main thing: everything there is publicly accessible, so use only open/anonymized data, never real employer data.

</details>

<details>
<summary>2. You need regional managers to see only their own data in one dashboard. What to use?</summary>

Publishing to Tableau Cloud/Server with Row-Level Security: one dashboard, but rows are filtered by user/region. Tableau Public won't do for this — it has no privacy or access management.

</details>

## What's next

- [Power BI — introduction](/en/07-bi-tools/power-bi/01-intro/) — the second main BI, let's compare approaches.
- [Pet project ideas](/en/12-career/09-pet-project-ideas/) — what to build and publish on Tableau Public.
