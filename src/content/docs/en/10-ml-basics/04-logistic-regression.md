---
title: Logistic regression
description: "Logistic regression: the sigmoid and log-odds, log-loss, interpretation via odds ratio, threshold tuning, multinomial."
sidebar:
  order: 4
---

:::tip[In short]
Despite the word "regression", this is a **classification** model: it predicts the **probability** of a class (0 to 1) via a sigmoid. A threshold (usually 0.5) turns the probability into a yes/no answer. Like [linear regression](/en/10-ml-basics/03-linear-regression/), it's well interpretable — via the odds ratio — and often serves as a solid classification baseline (churn, default, spam).
:::

## Why you need it

Binary classification is a frequent analyst task: will a customer leave or not, approve a loan or not. Logistic regression gives not just a label but a **probability**, stays explainable and rarely overfits — an excellent starting point.

## The sigmoid and log-odds

A linear combination of features is run through a sigmoid that squeezes any number into the range (0, 1) — that's the probability:

$$p = \frac{1}{1 + e^{-(\beta_0 + \beta_1 x_1 + \dots)}}$$

Under the hood the model is linear in **log-odds** (the log of the odds): $\log\frac{p}{1-p} = \beta_0 + \beta_1 x_1 + \dots$

## Log-loss

It trains not on MSE but on **log-loss** (the logistic loss function): it heavily penalizes confident but wrong predictions (said "99% will leave", but the customer stayed). This is the right error metric for probabilities.

## Interpretation: odds ratio

The coefficient $\beta_i$ is interpreted via the **odds ratio**: $e^{\beta_i}$ shows how many times the odds change when the feature grows by one unit.

- $e^{\beta} = 1.5$ → the feature increases the class's odds by 50%.
- $e^{\beta} < 1$ → decreases the odds.

This is clearer to the business than abstract weights — a strength of the method.

## Threshold tuning

:::caution[A 0.5 threshold isn't dogma]
The model outputs a probability; the yes/no decision depends on the **threshold**. By default 0.5, but you move it for the task: if missing churn is costly — lower the threshold (catch more potential leavers at the cost of false alarms). The threshold choice is a balance of [precision and recall](/en/10-ml-basics/08-model-evaluation/), not a property of the model.
:::

```python
from sklearn.linear_model import LogisticRegression
model = LogisticRegression().fit(X, y)
proba = model.predict_proba(X_new)[:, 1]    # class-1 probabilities
pred = (proba > 0.3).astype(int)             # a custom threshold
```

## Multinomial

For **more than two** classes there's a multiclass variant (multinomial / softmax): the model predicts probabilities across all classes, and the most likely is chosen. The binary case is a special case.

<details>
<summary>1. Why "regression" if the task is classification?</summary>

Because under the hood the model linearly predicts log-odds (the log of the odds) — that's "regression" in the mathematical sense. The sigmoid then turns the result into a probability, and the threshold into a class. The historical name misleads: by task it's a classifier.

</details>

<details>
<summary>2. The model catches few real churns, though accuracy is high. What to tweak?</summary>

Lower the classification threshold (from 0.5 to, say, 0.3): then more customers land in "will leave", churn recall rises at the cost of more false alarms. It's a precision/recall trade-off tuned by the threshold, not overfitting. The cost of missing churn determines where to move the threshold.

</details>

## What's next

- [Decision trees and forests](/en/10-ml-basics/05-decision-trees-forests/) — nonlinear classification models.
- [Model evaluation](/en/10-ml-basics/08-model-evaluation/) — precision, recall, ROC and threshold choice.
