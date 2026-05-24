---
title: Running the test
description: "Running an A/B test: pre-test sanity checks, monitoring during the test, the peeking problem, and sequential testing."
sidebar:
  order: 5
---

:::tip[In short]
Before launch — **sanity checks** (50/50 split, metrics are logged, A/A is clean). During the test you watch its health, but **don't make the decision on interim data**: "peeking" and early stopping at the first "significant" result sharply inflate false positives.
:::

## Why you need it

Even a perfectly planned test is easy to ruin at launch: forgot to log a metric, the split drifted, stopped early "because it's already significant". Launch discipline protects the result from these mistakes.

## Pre-test sanity checks

Before a full rollout, make sure:

- **The split is correct** — group shares match the design (no [SRM](/en/09-ab-testing/07-common-pitfalls/)).
- **Metrics are logged** — the primary and guardrails are actually written and computed.
- **A/A is clean** — two identical groups don't give a "significant" difference (otherwise randomization/the metric is broken).
- **The change is visible only to group B** — no variant leak into the control.

## Monitoring during the test

Watch **the experiment's health**, not its victory:

- whether something broke (errors, a guardrail drop — a reason to stop);
- whether group balance holds;
- whether the sample is accumulating as planned.

This isn't the same as "checking whether we won" — see below.

## The peeking problem

:::caution[You can't stop the test at the first "significant" p-value]
If you peek repeatedly and stop as soon as $p < 0.05$, the false-positive rate grows from 5% to 20–30%+. The reason: the p-value "wanders" over the course of the test and randomly crosses the threshold. The fix — fix the [sample size and timeframe](/en/09-ab-testing/03-sample-size/) in advance and look at the result **only at the end**, or use peeking-aware methods (below).
:::

This is a direct consequence of [multiple comparisons](/en/05-statistics/06-hypothesis-testing/): each "look" is an extra test.

## Sequential testing

If you do need to peek (to stop a harmful test early or lock in a clear win), use **sequential analysis** methods that correctly control the error under repeated checks: alpha-spending (O'Brien-Fleming), always-valid p-values, the [Bayesian approach](/en/05-statistics/09-bayesian-vs-frequentist/). They "pay" for the ability to peek with a slightly larger sample, but do it in a statistically honest way.

<details>
<summary>1. On day three the p-value dropped below 0.05 for the first time. Stop and ship?</summary>

No (unless you use sequential methods). An interim p-value randomly crosses the threshold — stopping at the first "significant" look inflates false positives to 20–30%. Wait for the planned sample size/timeframe, then the conclusion is honest. This is exactly the peeking problem.

</details>

<details>
<summary>2. Why run an A/A test before an A/B?</summary>

To check the infrastructure: two identical groups shouldn't give a significant difference. If they do — randomization, metric logging is broken, or there's SRM. An A/A catches these bugs before you trust the results of a real A/B.

</details>

## What's next

- [Analyzing results](/en/09-ab-testing/06-analyzing-results/) — what to do with the data at the end.
- [Common pitfalls](/en/09-ab-testing/07-common-pitfalls/) — SRM, Simpson, peeking in detail.
