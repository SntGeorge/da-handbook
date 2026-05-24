---
title: Supervised vs unsupervised
description: "Supervised and unsupervised learning: the difference, example tasks, semi-supervised and reinforcement learning overview."
sidebar:
  order: 2
---

:::tip[In short]
The main ML division is whether the data has **correct answers (labels)**. **Supervised**: we train on examples with answers — forecasting, classification. **Unsupervised**: there are no answers, the model finds structure itself — clustering, dimensionality reduction. This determines both the model choice and how you evaluate it.
:::

## Why you need it

This is the first question on any ML task: "do I have labeled data?". The answer determines which models apply and how to measure quality. Confusion here is a common interview mistake.

## Supervised: with labels

You have **features (X) and a correct answer (y)**. The model learns from "input → answer" pairs and predicts y for new data.

- **Regression** — y is a number (revenue, price).
- **Classification** — y is a category (churn yes/no, customer type).
- Example: order history labeled "returned/left" → the model predicts churn for new customers.

Quality is measured by comparing predictions with known answers ([model evaluation](/en/10-ml-basics/08-model-evaluation/)).

## Unsupervised: without labels

You have only **features (X)**, no answers. The model finds structure itself:

- **Clustering** — groups similar items ([clustering](/en/10-ml-basics/06-clustering/)): customer segments without predefined labels.
- **Dimensionality reduction** (PCA) — compresses many features into a few while preserving the essence.
- Example: split users into behavioral groups without knowing in advance what they are.

:::caution[Without labels there's no "right" answer to check against]
In unsupervised you can't compute accuracy — there's nothing to compare with. Clustering quality is assessed indirectly (silhouette, interpretability, business value) and often subjectively. This is a fundamental difference: "the model found 5 clusters" doesn't yet mean they're meaningful.
:::

## Comparison

| | Supervised | Unsupervised |
|--|------------|--------------|
| Data | X + answers y | only X |
| Tasks | regression, classification | clustering, PCA |
| Evaluation | comparison with y (accuracy, RMSE) | indirect, subjective |
| Example | churn prediction | customer segmentation |

## Semi-supervised and reinforcement (overview)

- **Semi-supervised** — only part of the data is labeled (labeling is expensive). The model uses both labels and the structure of the unlabeled. A compromise between the two worlds.
- **Reinforcement learning** — an agent learns via **rewards** for actions (games, robotics, dynamic pricing). Rare in an analyst's work; it's enough to know it's a separate "learning by trial and reward" paradigm.

<details>
<summary>1. You have customer history labeled "left/stayed" — you need to predict churn for new ones. Supervised or not?</summary>

Supervised (classification): you have features and correct answers (left/stayed), the model learns on them and predicts the class for new customers. Quality is checked by comparing predictions with the fact on a held-out set.

</details>

<details>
<summary>2. Why can't you compute accuracy for clustering?</summary>

Because there are no "correct" labels to compare with — it's unsupervised. The model made up the groups itself, there's no reference. Quality is assessed indirectly (metrics like silhouette, the meaningfulness and business value of the clusters), and that's largely subjective.

</details>

## What's next

- [Linear regression](/en/10-ml-basics/03-linear-regression/) — a basic supervised model.
- [Clustering](/en/10-ml-basics/06-clustering/) — the analyst's main unsupervised task.
