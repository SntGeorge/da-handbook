---
title: Technical interview
description: "An analyst's technical interview: top questions on SQL, Python/pandas and statistics, prep on LeetCode/StrataScratch, live coding tips."
sidebar:
  order: 5
---

:::tip[In short]
A DA technical interview rests on three pillars: **SQL** (above all window functions, JOIN, aggregations), **Python/pandas** (grouping, merge, cleaning) and **statistics** (p-value, A/B, confidence intervals). You prepare by practicing on StrataScratch/LeetCode. The key skill is **talking through your solution aloud**, not writing code in silence.
:::

## Why you need it

This is the stage where the most candidates are filtered out. The good news: the questions are predictable and recurring. Systematic prep on the topics below sharply raises your odds of passing.

## SQL — the most important

Almost certainly asked. What to rehearse:

- **Window functions** — `ROW_NUMBER`, `RANK`, `LAG/LEAD`, `SUM() OVER` ([the top topic](/en/02-sql/09-window-functions/)).
- **JOIN** and the [row-doubling trap](/en/02-sql/06-joins/).
- **GROUP BY / HAVING**, `COUNT(*)` vs `COUNT(DISTINCT)`.
- Subqueries and **CTEs**.
- Classics: **second highest**, **top-N per group**, running total, [ready tasks with solutions](/en/02-sql/17-interview-tasks/).

## Python / pandas

- `groupby` + `agg`, `merge` (and doubling, as in SQL), `pivot_table`.
- Cleaning: missing values, types, duplicates.
- Sometimes plain Python: working with lists/dicts, a simple algorithm.

In detail — in the [Python section](/en/04-python/16-common-patterns/).

## Statistics

What will definitely come up ([the whole section](/en/05-statistics/06-hypothesis-testing/)):

- What **p-value** is (and what it is NOT).
- A **confidence interval** — what 95% means.
- **Type I/II errors**, power.
- The logic of an **A/B test**, sample size.
- Correlation ≠ causation.

## Preparation

| Resource | For what |
|----------|----------|
| **StrataScratch** | real SQL/Python tasks from DA interviews |
| **LeetCode (Database)** | SQL tasks, easy to hard |
| **sql-ex.ru** | a classic SQL trainer (CIS) |
| This handbook | [SQL tasks](/en/02-sql/17-interview-tasks/), statistics, A/B |

Solve regularly in small doses, not in a marathon the night before the interview.

## Live coding tips

:::tip[Think aloud — it's half the evaluation]
In live coding they assess your **thought process**, not just the final code. What to do:

- **Clarify the task** before coding: data, granularity, edge cases (NULL, duplicates, empty groups).
- **Talk through the plan** aloud: "first I'll group by…, then with a window I'll compute…".
- Write step by step, test on a small example.
- **Stuck — reason aloud**, don't go silent: the interviewer will hint and see how you think.
- Mention edge cases upfront — a sign of maturity.
:::

<details>
<summary>1. Which SQL topic is almost guaranteed on a DA tech interview?</summary>

Window functions (`ROW_NUMBER`/`RANK`, `LAG/LEAD`, `SUM() OVER`) and related tasks like "top-N per group" and "second highest". Plus JOIN with an understanding of row doubling. This is the core of an analyst's SQL interview — rehearse it to automaticity.

</details>

<details>
<summary>2. You froze on a task in live coding. Think silently or talk?</summary>

Talk. They assess the thought process, not just the final code. Verbalize what you're trying and where you're stuck — the interviewer often hints at a direction and in any case sees your approach. Silence reads worse than "I'm thinking about how to handle duplicates in the key".

</details>

## What's next

- [Case interview](/en/12-career/06-case-interview/) — product tasks with no single answer.
- [SQL: interview tasks](/en/02-sql/17-interview-tasks/) — practice right now.
