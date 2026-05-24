---
title: Overfitting
description: "Overfitting and underfitting: train/val/test split, learning curves, regularization, early stopping, data leakage."
sidebar:
  order: 9
---

:::tip[In short]
**Overfitting** — the model "memorized" the training data, including noise, and works poorly on new data. The diagnosis: **good on train, bad on test**. It's fought by splitting into train/val/test, [regularization](/en/10-ml-basics/03-linear-regression/), early stopping and simplifying the model. The opposite is underfitting (the model is too simple).
:::

## Why you need it

This is the central problem of ML and a favorite interview question. A model with "99% accuracy" that fails in production is almost always overfit. Even an analyst who only applies ready-made models must understand and catch overfitting.

## Overfitting vs underfitting

| | Underfitting | Overfitting |
|--|--------------|-------------|
| Model | too simple | too complex |
| Train | poor | excellent |
| Test | poor | poor |
| Cause | caught little signal | memorized noise |

The goal is a balance in the middle: the model catches the pattern but not the noise (the bias-variance trade-off).

## Train / validation / test split

The basic defense — split the data:

- **Train** — what we learn on.
- **Validation** — where we tune hyperparameters.
- **Test** — the final honest estimate, touched **once** at the end.

```python
from sklearn.model_selection import train_test_split
X_tr, X_test, y_tr, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
```

## Learning curves

Plots of train and validation error against data volume / model complexity:

- a large **gap** (train good, val bad) → overfitting;
- both curves **high** and close → underfitting;
- converge at an acceptable level → good.

## How to fight overfitting

- **More data** — the best way, if possible.
- **Regularization** — L1/L2, limiting tree depth.
- **Early stopping** — stop training (boosting, a neural net) when val error stops falling.
- **Simplify the model** / reduce the number of features.
- **Cross-validation** for an honest estimate ([model evaluation](/en/10-ml-basics/08-model-evaluation/)).
- **Dropout** — a technique for neural nets (randomly "switches off" neurons); not used for tabular models, but the term is worth knowing.

## Data leakage

:::caution[Leakage gives a falsely perfect result]
If a feature accidentally includes information unavailable at prediction time (the future, something derived from the target, or statistics computed over all data including test), the model shows brilliant test quality and fails in reality. Examples: target encoding over all data, a "deal close date" feature when predicting closing. Prepare features strictly on train and think about what's actually known at prediction time.
:::

<details>
<summary>1. Train accuracy 99%, test 70%. Diagnosis and what to do?</summary>

Classic overfitting: the model memorized the training data with noise. The remedy — regularization (or limiting tree depth), simplifying the model, more data, feature selection, early stopping. And check quality with cross-validation, not on train.

</details>

<details>
<summary>2. The model is perfect on test but fails in production. First suspicion?</summary>

Data leakage: information unavailable at real prediction time leaked into the features (the future, target leakage, statistics over the whole dataset). On test this "peeking" inflates the metric, but in production that information isn't there. Check how features were prepared and what's actually known at prediction time.

</details>

## What's next

- [Model evaluation](/en/10-ml-basics/08-model-evaluation/) — cross-validation against overfitting.
- [sklearn workflow](/en/10-ml-basics/10-sklearn-workflow/) — a Pipeline that prevents leakage.
