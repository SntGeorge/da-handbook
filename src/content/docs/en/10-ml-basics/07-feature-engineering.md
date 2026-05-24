---
title: Feature engineering
description: "Feature engineering: encoding categories (one-hot/label/target), scaling and log-transforming numbers, features from dates and text, feature selection."
sidebar:
  order: 7
---

:::tip[In short]
Feature engineering is the preparation and creation of features for a model, and it's often **more important than the choice of algorithm**. Categories are encoded (one-hot/target encoding), numbers are scaled, useful features are extracted from dates and text. Rule #1: fit the preprocessing **only on train** and apply to test, otherwise you get [data leakage](/en/10-ml-basics/09-overfitting/).
:::

## Why you need it

"Garbage in — garbage out": even the best boosting won't rescue bad features. Yet a good feature (e.g. "days since last purchase") often gives more gain than switching models. This is the area where an analyst who understands the data is especially strong.

## Encoding categories

Models work with numbers, so categories are encoded:

| Method | How | When |
|--------|-----|------|
| **One-hot** | a flag column per value | few categories, no order |
| **Label** | a number per category | for trees; risky for linear (imposes an order) |
| **Target encoding** | replaces a category with the mean target for it | many categories, but leakage risk |

:::caution[Target encoding easily causes leakage]
Target encoding uses the target variable, so if you compute the means over **all** data (including test), information about the target "leaks" into the features, and the model shows falsely high quality. Compute target means only on train (and carefully, via cross-validation within folds).
:::

## Numeric features

- **Scaling** (StandardScaler, MinMax) — bring to a common scale. Critical for [k-means](/en/10-ml-basics/06-clustering/), kNN, linear models; trees don't need it.
- **Log transform** — for skewed quantities (income, price): compresses the long tail, brings it closer to normal.
- **Binning** — split a number into intervals (age → groups).

## Features from dates

A single date yields many useful features: day of week, month, hour, weekend/weekday, holiday, "days since an event". Often time features ("days since last purchase") are the strongest churn predictors. Related to [time series in pandas](/en/04-python/09-pandas-time-series/).

## Features from text

- **Bag of Words** — word frequencies.
- **TF-IDF** — frequencies adjusted for a word's commonness (rare but meaningful words weigh more).

The basic way to turn text into numbers for a model.

## Feature selection

Extra features add noise and overfitting risk. They're selected: by importance (feature importance from trees), via [L1 regularization](/en/10-ml-basics/03-linear-regression/) (Lasso zeroes out useless ones), by removing strongly correlated duplicates.

<details>
<summary>1. A categorical feature "city" with 500 values. Is one-hot a good idea?</summary>

A bad one: one-hot creates 500 sparse columns, bloating the data and slowing the model. Better target encoding (with leakage protection) or grouping rare cities into "other". One-hot is good when there are few categories. For trees, label/ordinal sometimes suffices, or CatBoost with native category handling.

</details>

<details>
<summary>2. Why do k-means and kNN need feature scaling, but trees don't?</summary>

k-means and kNN compute **distances** between points — a feature with a large range dominates, so a common scale is needed. Trees split by thresholds of individual features (`x > 5`) and are scale-insensitive: a monotonic transform doesn't change the order of splits.

</details>

## What's next

- [Model evaluation](/en/10-ml-basics/08-model-evaluation/) — how to measure that features helped.
- [Data cleaning](/en/04-python/10-data-cleaning/) — preparing data before feature engineering.
