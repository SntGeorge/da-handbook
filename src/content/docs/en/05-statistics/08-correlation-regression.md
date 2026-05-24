---
title: Correlation and regression
description: "Pearson and Spearman correlation, correlation ≠ causation, linear regression and interpreting coefficients, R-squared, multiple regression."
sidebar:
  order: 8
---

:::tip[In short]
**Correlation** measures the strength of a relationship between two quantities as a number from −1 to +1. **Regression** goes further — it describes the relationship with a formula and lets you predict. The golden rule they'll ask in an interview: **correlation ≠ causation**. Moving together doesn't prove one causes the other.
:::

## Why you need it

"Is ad spend related to revenue?", "how does price affect demand?" — these are correlation and regression. They find and describe dependencies, but require caution in conclusions about causes.

## Pearson correlation

The coefficient $r \in [-1, 1]$ — the strength and direction of a **linear** relationship:

- $r = 1$ — perfect direct relationship, $r = -1$ — perfect inverse, $r = 0$ — no linear relationship.
- $|r| > 0.7$ — strong, $0.3$–$0.7$ — moderate, $< 0.3$ — weak (rough guides).

```python
df[["ad_spend", "revenue"]].corr()       # Pearson correlation matrix
```

## Spearman and Kendall

Pearson captures only linear relationships and is sensitive to outliers. When the relationship is monotonic but not linear, or the data is ordinal — use rank correlations:

- **Spearman** — Pearson correlation on ranks; captures any monotonic relationship.
- **Kendall (τ)** — based on pair concordance; robust on small samples.

## Correlation ≠ causation

:::caution[The main trap]
High correlation does **not** prove a cause-and-effect link. Possible explanations:

- **Reverse causation** — not A causing B, but the other way around.
- **A hidden variable (confounder)** — both rise due to a third factor. The classic: ice cream sales and drownings correlate — but the common cause is heat, not ice cream.
- **Chance** — across many variables, correlations arise on their own.

To speak of causation you need an experiment (an [A/B test](/en/09-ab-testing/01-fundamentals/)), not observational correlation.
:::

## Linear regression

Describes the relationship with a line formula:

$$y = \beta_0 + \beta_1 x + \varepsilon$$

- $\beta_0$ — the intercept (the value of $y$ at $x=0$).
- $\beta_1$ — the slope: **how much $y$ changes when $x$ grows by one unit**. That's the interpretation.

```python
import statsmodels.formula.api as smf
model = smf.ols("revenue ~ ad_spend", data=df).fit()
model.params        # the β coefficients
model.summary()     # full report with p-values and R²
```

For example, the model returned $\beta_0 = 1000$, $\beta_1 = 3$ for `ad_spend`. Read and **used** like this:

- **Interpretation**: each dollar of advertising is associated on average with +$3 of revenue (within the model and data).
- **Prediction**: plug $x$ into the formula. At a spend of $50,000: $y = 1000 + 3 \cdot 50000 = 151{,}000$ in expected revenue.

So regression isn't only "there's a relationship", but a ready formula for prediction: plug in the input — get an estimate of the output.

## R-squared

$R^2 \in [0, 1]$ — the share of $y$'s variance explained by the model. $R^2 = 0.7$ → the model explains 70% of the variation. Higher is better, but a high $R^2$ guarantees neither causation nor predictive power on new data.

## Multiple regression

When there are several predictors: $y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots$ Each $\beta_i$ is the effect of its factor **all else being equal**. It helps separate variables' contributions but requires caution with correlated predictors (multicollinearity).

## Practice tasks

<details>
<summary>1. The number of firefighters at a fire correlates strongly with the damage. So firefighters cause harm?</summary>

No — it's a hidden variable. Both the number of firefighters and the damage grow with the fire's size. A classic "correlation ≠ causation" example: the link is real, but the common cause is the scale of the fire, not the firefighters.

</details>

<details>
<summary>2. In the regression `revenue ~ ad_spend` the ad_spend coefficient is 3. How to read it?</summary>

When ad spend increases by 1 unit, revenue rises on average by 3 units — within the model and observed data. It's an association, not proven causation: a causal conclusion needs an experiment.

</details>

## What's next

- [Bayesian vs frequentist](/en/05-statistics/09-bayesian-vs-frequentist/) — two approaches to inference.
- [ML basics](/en/10-ml-basics/03-linear-regression/) — regression as the first machine-learning model.
