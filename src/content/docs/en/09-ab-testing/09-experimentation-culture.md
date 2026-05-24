---
title: Experimentation culture
description: "Experimentation culture in a product: maturity (Crawl-Walk-Run-Fly), a hypothesis backlog, documenting results, how to sell experimentation to leadership."
sidebar:
  order: 9
---

:::tip[In short]
Experiments deliver value not as one-off tests but as a **process**: a hypothesis backlog, a single platform, documented results (including failures). Maturity grows along the **Crawl → Walk → Run → Fly** model — from individual tests to hundreds a year. Most hypotheses **don't pan out** — and that's the norm, not a failure.
:::

## Why you need it

One good test changes a feature; an experimentation culture changes a company. An analyst not only computes tests but helps build the process — that's what sets an influential specialist apart. The topic is popular in senior interviews and product teams.

## Maturity: Crawl-Walk-Run-Fly

| Stage | What's happening |
|-------|------------------|
| **Crawl** | individual manual tests, no platform |
| **Walk** | a tool exists, tests are regular, computed correctly |
| **Run** | dozens of tests, a hypothesis backlog, guardrails by default |
| **Fly** | hundreds of tests/year, almost every change is tested, a "don't believe — verify" culture |

The goal isn't to "fly at any cost", but to move through the stages as the need and data maturity grow.

## The hypothesis backlog

Hypotheses are collected and prioritized, not tested at random. A common prioritization frame is **ICE** (Impact × Confidence × Ease) or **PIE**: you score the potential effect, confidence and implementation cost, then sort. This way traffic and time go to the most promising ideas.

## Documenting results

:::caution[Document the failures too]
The strongest asset of a mature culture is a database of past experiments, including **negative** ones. Otherwise teams re-discover the same thing for years ("let's make a red button" — it's been tested three times). Record the hypothesis, design, result and conclusion even when the test failed — it saves future resources.
:::

## Most hypotheses don't pan out

A normal experiment success rate is around 10–30%. This isn't poor work by the team but the essence of the method: experiments exist precisely to cheaply weed out ideas that **seemed** good. The culture should treat a "negative" result as valuable knowledge, not a defeat.

## How to sell experimentation to leadership

- Speak the language of **money and risk**: a test cheaply prevents a costly rollout of a bad feature.
- Show the **cost of a mistake** without tests: how much an "intuition" rollout that failed would have cost.
- Start with **quick visible wins** on an important metric, then scale the process.
- Tie it to [product metrics](/en/08-product-analytics/10-product-frameworks/) and business goals, not "tests for tests' sake".

<details>
<summary>1. Of 20 tests in a quarter only 4 "won". Is the team doing poorly?</summary>

No, a 20% success rate is normal and even healthy. The essence of experiments is to cheaply weed out ideas that only seemed good. If almost all won, it would rather mean weak hypotheses or analysis errors. Negative results are saved resources, not a failure.

</details>

<details>
<summary>2. Why store the results of failed tests?</summary>

To avoid re-discovering the same ideas and re-spending traffic. An experiment database (with the hypothesis, design and conclusion, including negative ones) is institutional memory: new hires see what's already been tried and with what outcome. It's a key asset of a mature experimentation culture.

</details>

## What's next

- [A/B fundamentals](/en/09-ab-testing/01-fundamentals/) — where the experiment cycle begins.
- [Product frameworks](/en/08-product-analytics/10-product-frameworks/) — which metrics to move with experiments.
