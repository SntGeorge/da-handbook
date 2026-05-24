---
title: Model evaluation
description: "Model evaluation: regression metrics (MAE/RMSE/R²) and classification (accuracy/precision/recall/F1), ROC-AUC, confusion matrix, cross-validation."
sidebar:
  order: 8
---

:::tip[In short]
The metric is chosen for the task. Regression: **RMSE/MAE** and R². Classification: **not accuracy alone!** — on imbalanced data it deceives, you need **precision/recall/F1** and ROC-AUC. Quality is checked by **cross-validation**, not on the training set. The metric choice matters more than the model choice.
:::

## Why you need it

"95% accuracy" means nothing without context: with 5% churn, a "everyone stays" model also gives 95%. Understanding metrics protects against falsely good results — one of the most common ML topics in an analyst's interview.

## Regression metrics

| Metric | What it means |
|--------|---------------|
| **MAE** | mean absolute error (in target units, robust to outliers) |
| **MSE / RMSE** | mean squared; RMSE in target units, penalizes large misses more |
| **R²** | share of variance explained (0–1) |

MAE — "on average we're off by N dollars"; RMSE — when large errors are especially undesirable.

## Classification metrics

:::caution[Accuracy deceives on class imbalance]
If classes are 95% / 5%, an "always the majority" model gives 95% accuracy, catching none of the rare cases (churn, fraud). On imbalanced data look at precision/recall, not accuracy. A classic trap.
:::

- **Precision** — of those predicted "positive", how many really are (few false alarms).
- **Recall** — of all real positives, how many were caught (few misses).
- **F1** — the harmonic mean of precision and recall (a balance).

Between precision and recall there's a trade-off regulated by the [threshold](/en/10-ml-basics/04-logistic-regression/):

| Matters more | Example |
|--------------|---------|
| Recall | don't miss a disease/fraud/churn |
| Precision | don't bother people for nothing (spam filter, costly intervention) |

## ROC-AUC and confusion matrix

- **Confusion matrix** — a table of TP/FP/FN/TN, from which all metrics are computed; always look at it first.
- **ROC-AUC** — ranking quality across all thresholds (0.5 = random, 1.0 = perfect). Handy for comparing models independent of the threshold.
- **PR-AUC** — preferable to ROC-AUC under strong imbalance.

## Cross-validation

:::caution[You can't evaluate a model on the training data]
Quality on train is inflated — the model "saw" it. Split into train/test, or more reliably — **k-fold cross-validation**: split data into k parts, train on k−1 and validate on the rest in turn, then average. For imbalanced classes — **stratified**, for time series — **time series split** (you can't train on the future and validate on the past).
:::

## Practice tasks

<details>
<summary>1. A fraud-detection model: 99% accuracy, but it barely catches fraudsters. How?</summary>

The classes are imbalanced (~1% fraud). An "all legitimate" model gives 99% accuracy, catching no fraudsters — recall for the fraud class ≈ 0. You need to look at precision/recall/PR-AUC, not accuracy, and probably lower the threshold or weight the classes.

</details>

<details>
<summary>2. You're forecasting sales from historical data. Why is plain k-fold incorrect?</summary>

Plain k-fold shuffles the data, and the model may train on the "future" and validate on the "past" — a time leak, an inflated estimate. For time series you need a time series split: train only on the past relative to the validation period, preserving chronology.

</details>

## What's next

- [Overfitting](/en/10-ml-basics/09-overfitting/) — why a train estimate lies.
- [sklearn workflow](/en/10-ml-basics/10-sklearn-workflow/) — computing metrics and cross-validation in practice.
