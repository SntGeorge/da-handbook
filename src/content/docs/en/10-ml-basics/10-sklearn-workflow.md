---
title: sklearn workflow
description: "The scikit-learn workflow: the fit/predict/score pattern, Pipeline, ColumnTransformer for mixed features, GridSearchCV, saving a model (joblib)."
sidebar:
  order: 10
---

:::tip[In short]
All scikit-learn models share one interface: **`.fit()` → `.predict()` → `.score()`**. Preprocessing and the model are linked in a **`Pipeline`** so preprocessing is fit only on train (protection against [leakage](/en/10-ml-basics/09-overfitting/)), hyperparameters are tuned with **`GridSearchCV`**, and the finished model is saved via `joblib`.
:::

## Why you need it

scikit-learn is the standard classic-ML library in Python. Its uniform API lets you swap models in one line, and a Pipeline makes the code reproducible and protected from common mistakes. This is the practical minimum to apply everything from the previous chapters.

## The basic pattern

One interface for any model:

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_tr, X_test, y_tr, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(random_state=42)
model.fit(X_tr, y_tr)              # training
preds = model.predict(X_test)      # prediction
model.score(X_test, y_test)        # a quick estimate
```

Switching models = replacing one class — the rest of the code is the same.

## Pipeline

A `Pipeline` links preprocessing and the model into one object:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier()),
])
pipe.fit(X_tr, y_tr)
```

:::tip[Pipeline protects against data leakage]
The main benefit: on `fit`, preprocessing (scaling, encoding) is learned **only on train**, and during cross-validation — within each fold separately. If you scale the data manually before the split, the statistics will "see" test → [leakage](/en/10-ml-basics/09-overfitting/). A Pipeline does this correctly automatically.
:::

## ColumnTransformer

Real data is mixed: numbers need scaling, categories need encoding. `ColumnTransformer` applies different processing to different columns:

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

prep = ColumnTransformer([
    ("num", StandardScaler(), ["amount", "age"]),
    ("cat", OneHotEncoder(), ["country", "status"]),
])
pipe = Pipeline([("prep", prep), ("model", RandomForestClassifier())])
```

## Hyperparameter tuning

`GridSearchCV` searches combinations of parameters with cross-validation; `RandomizedSearchCV` — randomly (faster over a large space):

```python
from sklearn.model_selection import GridSearchCV

grid = GridSearchCV(pipe, {"model__n_estimators": [100, 300],
                           "model__max_depth": [5, 10]}, cv=5)
grid.fit(X_tr, y_tr)
grid.best_params_
```

The `model__` prefix addresses a parameter of the pipeline step.

## Saving a model

```python
import joblib
joblib.dump(grid.best_estimator_, "model.pkl")   # save
model = joblib.load("model.pkl")                  # load
```

Save the **whole Pipeline**, not just the model — then the preprocessing travels with it, and there's no mismatch in production.

<details>
<summary>1. Why put preprocessing in a Pipeline rather than scaling the data beforehand?</summary>

So preprocessing is learned only on train. With manual scaling before the train/test split (or before cross-validation), the statistics (mean, variance) are computed over all data, including test — that's leakage inflating the estimate. A Pipeline recomputes preprocessing within each fold honestly.

</details>

<details>
<summary>2. What and why to save for production — the model or the Pipeline?</summary>

The whole Pipeline. The model expects data in the same form it was trained on (scaled, encoded). If you save only the model, you'll have to manually reproduce the preprocessing in production — a source of errors and mismatch. A Pipeline encapsulates both the preparation and the model.

</details>

## What's next

- [Model evaluation](/en/10-ml-basics/08-model-evaluation/) — metrics and cross-validation in code.
- [Python: common patterns](/en/04-python/16-common-patterns/) — where to embed ML in the analysis pipeline.
