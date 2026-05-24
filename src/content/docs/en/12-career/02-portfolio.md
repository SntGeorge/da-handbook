---
title: Portfolio
description: "A data analyst's portfolio: why it matters without experience, GitHub with a README, Kaggle, Tableau Public for dashboards, articles on Medium."
sidebar:
  order: 2
---

:::tip[In short]
Without commercial experience, a portfolio **substitutes** for the "work experience" line: it proves you can actually do it, not just that you took courses. The minimum — 1–2 finished projects on **GitHub** with a clear README and, if there are dashboards, a link to **Tableau Public / Looker Studio**. One project taken to completion beats ten abandoned ones.
:::

## Why you need it

"Took a SQL course" is words. A project with code, a dashboard and conclusions is proof. For a junior without experience the portfolio often decides whether you get invited to an interview. It's your only way to show the skill before the interview.

## GitHub

The main code showcase. What a recruiter looks at:

- **The project README** — the most important: what the project is, what question it solved, what data, what came out (with chart screenshots). READMEs are read more often than code.
- **Structure** — tidy folders (`data/`, `notebooks/`, `README.md`), not a dump of files.
- **Clean notebooks** — with markdown explanations and conclusions, runnable top to bottom ([as in Jupyter](/en/04-python/02-jupyter-workflow/)).

:::caution[Don't commit data and secrets]
The repository shouldn't include large datasets, passwords, API keys, `.env`. Add a `.gitignore` ([see Git](/en/01-setup/git-github/)). A committed key is both bad for security and a bad signal to a recruiter about your diligence.
:::

## Tableau Public / Looker Studio

For dashboards, code in GitHub isn't illustrative — you need a **live interactive link**. [Tableau Public](/en/07-bi-tools/tableau/07-publishing/) and [Looker Studio](/en/07-bi-tools/looker/01-intro/) are free and give a public URL you put right in the resume. The recruiter clicks and immediately sees your dashboard.

## Kaggle

A platform with datasets and competitions. Useful for:

- **Notebooks** — public notebooks with analysis (your thought process is visible).
- **Datasets** — ready data for pet projects.
- Competitions — optional; a top spot isn't required, but participating shows practice.

## Articles (Medium)

A write-up of your project as an article is a strong bonus: it shows [storytelling](/en/06-visualization/04-storytelling/) and the ability to explain. Not mandatory, but it sets you apart among juniors and works for your personal brand.

## What to show

| Format | For what |
|--------|----------|
| GitHub repository | code, SQL, notebooks, README |
| Tableau Public / Looker | interactive dashboards |
| Kaggle notebook | analysis with explanations |
| Article | storytelling, a case write-up |

## Practice tasks

<details>
<summary>1. What matters more in a GitHub project to a recruiter — the code or the README?</summary>

The README. A recruiter (and often the hiring manager) first reads the description: what question the project solved, on what data, what came out, with screenshots of results. Without a clear README even good code looks like a dump of files. The code is reviewed later, if the README hooked them.

</details>

<details>
<summary>2. Ten started projects or one finished — what's better in a portfolio?</summary>

One taken to completion: with data, analysis, a dashboard/conclusions and a polished README. It shows you can drive to a result — which is exactly what an employer needs. Ten abandoned half-projects make the opposite impression.

</details>

## What's next

- [Pet project ideas](/en/12-career/09-pet-project-ideas/) — what exactly to build for a portfolio.
- [DA resume](/en/12-career/01-resume/) — how to reference projects in the resume.
