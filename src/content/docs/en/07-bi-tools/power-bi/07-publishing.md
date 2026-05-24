---
title: Publishing Power BI
description: "Publishing to Power BI Service: workspace and apps, data refresh (scheduled/incremental), Row-Level Security (RLS), sharing reports."
sidebar:
  order: 7
---

:::tip[In short]
A report from Desktop is published to **Power BI Service** (the cloud), where it lives in a **workspace** and is distributed via **apps**. Data is refreshed on a schedule (**scheduled refresh**). To restrict row access — **Row-Level Security (RLS)**: one report, but each user sees only their own data.
:::

## Why you need it

A `.pbix` report on your laptop is useless to the team. Publishing to Service makes it accessible, refreshable and secure. Understanding refresh and RLS is the mandatory minimum for teamwork.

## Power BI Service

**Publish** from Desktop → the report uploads to the Power BI Service cloud (app.powerbi.com). There it's viewed in a browser and on mobile, without installing Desktop.

## Workspace and Apps

- **Workspace** — the team's working space: reports, datasets, dashboards. This is where development and collaboration happen.
- **App** — a "published storefront" from a workspace for end users: a clean, stable set of reports with managed access. The team edits in the workspace, consumers view the app.

## Data refresh

| Type | What it does |
|------|--------------|
| **Scheduled refresh** | refresh on a schedule (up to 8×/day on Pro) |
| **Incremental refresh** | loads only new/changed data — for large tables |

:::note[A Gateway is needed for refresh from a local source]
If data sits not in the cloud but in a local DB/file, Service can't reach it itself — you need an **On-premises Data Gateway** (a bridge between the cloud and your network). Without it, scheduled refresh will fail. For cloud sources no gateway is needed.
:::

## Row-Level Security (RLS)

RLS restricts access to **rows** by user: a Russia manager sees only Russian data in the same report. Configured via roles with a DAX filter:

```dax
[Country] = "RU"            -- the "RU manager" role sees only these rows
```

Roles are created in Desktop (Manage roles), and users are assigned in Service. This is the standard way to give one report to many with different data visibility.

## Sharing

You can share by: adding to a workspace, publishing an app, sending a link (share) or embedding. For most internal scenarios the right path is an **app** with configured permissions, not mailing out `.pbix` files.

<details>
<summary>1. A scheduled refresh of a report from a local PostgreSQL fails. Why?</summary>

Power BI Service has no direct access to a local DB outside the cloud. You need an On-premises Data Gateway — a bridge through which Service reaches the local source. For cloud sources (BigQuery, cloud SQL) no gateway is required.

</details>

<details>
<summary>2. You need regional managers to see one report, but each only their own data. With what?</summary>

Row-Level Security (RLS): create roles with a DAX filter by region (`[Region] = "..."`) in Desktop and assign users in Service. One report, but rows are filtered per user. It's the same idea as [RLS in Tableau](/en/07-bi-tools/tableau/07-publishing/).

</details>

## What's next

- [Looker Studio](/en/07-bi-tools/looker/01-intro/) — a free cloud alternative.
- [Modern Stack](/en/11-modern-stack/01-cloud-dwh-overview/) — where Power BI gets data in the cloud.
