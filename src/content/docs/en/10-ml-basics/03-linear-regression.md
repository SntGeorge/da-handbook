---
title: Linear regression
description: "Linear regression: the equation and MSE/OLS, interpreting coefficients, the method's assumptions, L1/L2 regularization (Lasso, Ridge), when it fails."
sidebar:
  order: 3
---

:::tip[In short]
Linear regression predicts a **number** with a line $y = \beta_0 + \beta_1 x + \dots$, fitting coefficients to minimize the error (MSE). Its main value for an analyst is **interpretability**: each $\beta$ tells how much $y$ changes when a feature grows by one unit. It's the same regression as in [statistics](/en/05-statistics/08-correlation-regression/), but seen from the ML side.
:::

## Why you need it

It's the most explainable model and often sufficient. Before reaching for boosting, an analyst tries linear regression: it trains fast, is easy to interpret, and serves as a baseline to compare complex models against.

## The equation, MSE, OLS

The model finds a line (hyperplane):

$$\hat{y} = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots$$

Coefficients are fitted by **ordinary least squares (OLS)** — minimizing the mean squared error:

$$\text{MSE} = \frac{1}{n}\sum (y_i - \hat{y}_i)^2$$

The square penalizes large misses more — so regression is sensitive to outliers.

## Interpreting coefficients

The main advantage: $\beta_i$ = **how much $y$ changes when $x_i$ grows by one unit, all else being equal**.

```python
from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X, y)
model.coef_        # the β coefficients
model.intercept_   # β0
```

For example, $\beta = 3$ for `ad_spend` → each dollar of advertising is associated with +$3 of revenue (within the model; this [doesn't prove causation](/en/05-statistics/08-correlation-regression/)).

## Assumptions

:::caution[Linear regression makes strong assumptions]
The method is valid when its assumptions hold: **linearity** of the relationship, independence of observations, constant error variance (homoscedasticity), normality of residuals, no strong **multicollinearity** (correlated features). If the relationship is nonlinear or features duplicate each other — the coefficients lie, and you need a different model or data transformation.
:::

## Regularization: L1 and L2

When there are many features, the model overfits. Regularization adds a penalty for large coefficients:

| Type | Method | Effect |
|------|--------|--------|
| **L2** | Ridge | shrinks coefficients, fights multicollinearity |
| **L1** | Lasso | **zeroes out** some coefficients → feature selection |
| L1+L2 | ElasticNet | a combination |

Lasso is handy when you need to automatically drop useless features.

## When it fails

- The relationship is substantially **nonlinear** (then — trees/boosting or feature engineering).
- Many **outliers** (the squared error inflates them).
- Strong **multicollinearity** without regularization.
- Complex feature interactions a line can't capture.

<details>
<summary>1. What's the value of linear regression for an analyst if there's accurate boosting?</summary>

Interpretability and simplicity. The coefficients directly tell how each factor affects the result — explainable to the business, unlike a boosting "black box". Plus it's fast and serves as a baseline: if a simple model is already good, a complex one may be unnecessary.

</details>

<details>
<summary>2. How does Lasso (L1) differ from Ridge (L2) in practice?</summary>

Ridge shrinks all coefficients toward zero but doesn't zero them — good against multicollinearity. Lasso can **zero out** some coefficients entirely, effectively selecting features. If you need to automatically remove useless variables — use Lasso; if just to stabilize — Ridge.

</details>

## What's next

- [Logistic regression](/en/10-ml-basics/04-logistic-regression/) — the same idea, but for classification.
- [Correlation and regression](/en/05-statistics/08-correlation-regression/) — the statistical view and causation.
