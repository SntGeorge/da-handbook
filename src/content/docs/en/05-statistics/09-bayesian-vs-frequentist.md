---
title: Bayesian vs frequentist
description: "Two approaches to statistics: frequentist and Bayesian, prior and posterior, Bayes Factor, when Bayes gives more, Bayesian A/B testing."
sidebar:
  order: 9
---

:::tip[In short]
Two views of probability. **Frequentist**: probability is a fraction over many repetitions; the parameter is fixed, we answer with p-values and confidence intervals. **Bayesian**: probability is a degree of belief; there's a prior opinion that data updates into a posterior. In practice an analyst meets the frequentist one more often (A/B tests), but Bayes is handier for "the probability that B is better than A".
:::

## Why you need it

Most courses and tools use the frequentist approach, but the Bayesian one appears more and more (especially in product A/B platforms). You need to understand the difference to read results correctly and not mix interpretations.

## The philosophy of the two approaches

| | Frequentist | Bayesian |
|--|-------------|----------|
| What probability is | a fraction over ∞ repetitions | a degree of belief |
| Parameter (e.g. conversion) | fixed, unknown | random, has a distribution |
| Accounts for prior knowledge | no | yes (via a prior) |
| Main result | p-value, confidence interval | posterior distribution |
| Answers the question | "how surprising the data is if there's no effect" | "what's the probability B is better than A" |

## Prior and posterior

The core of Bayes is updating belief with data (the same [Bayes' theorem](/en/05-statistics/02-probability-basics/)):

$$P(\text{hypothesis} \mid \text{data}) \propto P(\text{data} \mid \text{hypothesis}) \cdot P(\text{hypothesis})$$

- **Prior** $P(\text{hypothesis})$ — what we thought before the experiment.
- **Posterior** $P(\text{hypothesis} \mid \text{data})$ — the updated belief after the data.

For example, before a test we assume conversion ~5% (prior), collect data — and get a refined distribution of conversion (posterior).

:::caution[The subjectivity of the prior]
The strength and weakness of Bayes is the prior. It lets you bring in domain knowledge, but with little data it strongly influences the result, and its choice can be disputed. The frequentist approach avoids this argument by forgoing a prior altogether.
:::

## Bayes Factor

The analog of the p-value in the Bayesian world: how many times more likely the data is under $H_1$ than under $H_0$. $BF = 10$ → the data supports $H_1$ ten times more. Unlike the p-value, it can be evidence **in favor** of $H_0$, not only against it.

## When Bayes gives more

- When there's reliable prior knowledge (a history of past tests).
- When you need the direct answer "probability that B is better than A = 92%" — clearer to the business than a p-value.
- For **sequential analysis**: Bayes lets you "peek" at the data along the way without inflating the error, which a classic frequentist test forbids.

## Bayesian A/B testing (overview)

Instead of "significant/not significant", Bayesian A/B gives:

- **P(B > A)** — the probability that variant B is better.
- **Expected loss** — how much we lose by choosing the "wrong" variant.

This is more intuitive for decision-making. Many product platforms (e.g. for experimentation) build reports exactly this way. More on the practice — in [advanced A/B techniques](/en/09-ab-testing/08-advanced-techniques/).

## Practice tasks

<details>
<summary>1. Why is a Bayesian A/B test's answer handier than a frequentist p-value for the business?</summary>

Bayes gives a direct, clear quantity — "the probability that B is better than A is 92%" and the expected loss. The frequentist p-value answers a narrower and counterintuitive question ("how surprising the data is given no effect") and is easy to misinterpret.

</details>

<details>
<summary>2. What is simultaneously the strength and weakness of the prior distribution?</summary>

The strength — it lets you build in prior knowledge (test history, expertise), especially valuable with little data. The weakness — it's subjective: with insufficient data it strongly influences the result, and its choice can be disputed. The frequentist approach avoids this by not using a prior.

</details>

## What's next

- [Probability basics](/en/05-statistics/02-probability-basics/) — Bayes' theorem, where it all starts.
- [A/B testing](/en/09-ab-testing/01-fundamentals/) — where both approaches are applied in practice.
