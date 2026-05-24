---
title: Probability basics
description: "Probability and events, independence, conditional probability, Bayes' theorem with examples, the Monty Hall problem."
sidebar:
  order: 2
---

:::tip[In short]
Probability is a number from 0 to 1, a measure of how likely an event is. The key ideas for an analyst: **independence** (one event doesn't affect another), **conditional probability** $P(A\mid B)$ and **Bayes' theorem** — recomputing probability given new data. Bayes underlies many intuitively "strange" results.
:::

## Why you need it

A/B tests, risk assessment, interpreting a "positive" test — all of this is probability. Without it, it's easy to draw a conclusion that seems right but is statistically wrong (see the medical-test example below).

## Event and probability

The probability of event $A$: $P(A) = \frac{\text{favorable outcomes}}{\text{all outcomes}}$, a value in $[0, 1]$.

- $P(A) = 0$ — impossible, $P(A) = 1$ — certain.
- Rolling a fair die: $P(\text{a 6}) = \frac{1}{6}$.

## Independence

Events are independent if one doesn't affect the other's probability. Then the probability of both occurring is the product:

$$P(A \cap B) = P(A) \cdot P(B)$$

Two fair coin flips: $P(\text{heads twice}) = 0.5 \cdot 0.5 = 0.25$.

:::caution[Don't confuse independence with "apparent" dependence]
The classic gambler's mistake: "5 heads in a row — now tails is due". No: flips are independent, the probability of tails is still 0.5. The past doesn't affect the next flip.
:::

## Conditional probability

$P(A \mid B)$ — the probability of $A$ given that $B$ has already happened:

$$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Example: the probability that an order is paid ($A$) given that it's from Russia ($B$) — computed only within Russian orders.

## Bayes' theorem

Lets you "flip" a conditional probability — recompute $P(A\mid B)$ via $P(B\mid A)$:

$$P(A \mid B) = \frac{P(B \mid A)\, P(A)}{P(B)}$$

**Example (why intuition fails).** A disease affects 1% of people. A test is correct 99% of the time. The test is positive — what's the probability the person is actually sick?

Intuition says "99%", but the correct answer is ≈ **50%**: there are many healthy people (99%), and even 1% false positives among them produces as many errors as the true positives among the 1% who are sick. Bayes forces you to account for the **base rate** (1%), not just the test's accuracy.

## The Monty Hall problem

Three doors, a prize behind one. You pick a door, the host opens one of the others that's empty and offers to switch. **Switching is worth it**: the probability of winning by switching is $\frac{2}{3}$, by staying — $\frac{1}{3}$.

Why: initially your door wins with $\frac{1}{3}$, and "the other doors together" with $\frac{2}{3}$. By opening an empty one, the host concentrated that $\frac{2}{3}$ on the single remaining door. Again it's about conditional probability and accounting for new information.

<details>
<summary>1. A disease test is 99% accurate, the disease affects 1% of people. The test is positive — is the patient almost certainly sick?</summary>

No, the probability is about 50%, not 99%. Because of the low base rate (1%), false positives among the huge number of healthy people are comparable in count to true positives among the few sick. This is a direct consequence of Bayes' theorem — you can't ignore the prior probability.

</details>

<details>
<summary>2. A coin came up heads 5 times in a row. The probability of heads on the 6th flip?</summary>

Still 0.5. Flips are independent, the coin has "no memory". Expecting that "tails is now due" is the gambler's fallacy.

</details>

## What's next

- [Distributions](/en/05-statistics/03-distributions/) — how probability spreads across values.
- [Bayesian vs frequentist](/en/05-statistics/09-bayesian-vs-frequentist/) — two views of probability.
