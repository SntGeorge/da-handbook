---
title: sklearn workflow
description: "Рабочий процесс scikit-learn: паттерн fit/predict/score, Pipeline, ColumnTransformer для смешанных признаков, GridSearchCV, сохранение модели (joblib)."
sidebar:
  order: 10
---

:::tip[Коротко]
У всех моделей scikit-learn единый интерфейс: **`.fit()` → `.predict()` → `.score()`**. Подготовку и модель связывают в **`Pipeline`**, чтобы предобработка училась только на train (защита от [утечки](/10-ml-basics/09-overfitting/)), гиперпараметры подбирают **`GridSearchCV`**, а готовую модель сохраняют через `joblib`.
:::

## Зачем это нужно

scikit-learn — стандартная библиотека классического ML в Python. Её единообразный API позволяет менять модели одной строкой, а Pipeline делает код воспроизводимым и защищённым от типичных ошибок. Это практический минимум, чтобы применять всё из предыдущих глав.

## Базовый паттерн

Один интерфейс для любой модели:

```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

X_tr, X_test, y_tr, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(random_state=42)
model.fit(X_tr, y_tr)              # обучение
preds = model.predict(X_test)      # предсказание
model.score(X_test, y_test)        # быстрая оценка
```

Сменить модель = заменить один класс — остальной код тот же.

## Pipeline

`Pipeline` связывает предобработку и модель в один объект:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("model", RandomForestClassifier()),
])
pipe.fit(X_tr, y_tr)
```

:::tip[Pipeline защищает от утечки данных]
Главная польза: при `fit` препроцессинг (масштабирование, кодирование) учится **только на train**, а при кросс-валидации — внутри каждого fold отдельно. Если масштабировать данные вручную до split, статистики «увидят» test → [утечка](/10-ml-basics/09-overfitting/). Pipeline делает это правильно автоматически.
:::

## ColumnTransformer

Реальные данные смешанные: числа надо масштабировать, категории — кодировать. `ColumnTransformer` применяет разную обработку к разным столбцам:

```python
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

prep = ColumnTransformer([
    ("num", StandardScaler(), ["amount", "age"]),
    ("cat", OneHotEncoder(), ["country", "status"]),
])
pipe = Pipeline([("prep", prep), ("model", RandomForestClassifier())])
```

## Подбор гиперпараметров

`GridSearchCV` перебирает комбинации параметров с кросс-валидацией; `RandomizedSearchCV` — случайно (быстрее на большом пространстве):

```python
from sklearn.model_selection import GridSearchCV

grid = GridSearchCV(pipe, {"model__n_estimators": [100, 300],
                           "model__max_depth": [5, 10]}, cv=5)
grid.fit(X_tr, y_tr)
grid.best_params_
```

Префикс `model__` адресует параметр шага пайплайна.

## Сохранение модели

```python
import joblib
joblib.dump(grid.best_estimator_, "model.pkl")   # сохранить
model = joblib.load("model.pkl")                  # загрузить
```

Сохраняй **весь Pipeline**, а не только модель — тогда предобработка поедет вместе с ней, и в проде не будет рассинхрона.

## Задачи для самопроверки

<details>
<summary>1. Зачем класть препроцессинг в Pipeline, а не масштабировать данные заранее?</summary>

Чтобы предобработка училась только на train. При ручном масштабировании до train/test split (или до кросс-валидации) статистики (среднее, дисперсия) посчитаются по всем данным, включая test — это утечка, завышающая оценку. Pipeline пересчитывает препроцессинг внутри каждого fold честно.

</details>

<details>
<summary>2. Что и почему сохранять для продакшена — модель или Pipeline?</summary>

Весь Pipeline. Модель ожидает данные в том же виде, в каком обучалась (масштабированные, закодированные). Если сохранить только модель, в проде придётся вручную воспроизводить препроцессинг — источник ошибок и рассинхрона. Pipeline инкапсулирует и подготовку, и модель.

</details>

## Что дальше

- [Оценка моделей](/10-ml-basics/08-model-evaluation/) — метрики и кросс-валидация в коде.
- [Python: типичные паттерны](/04-python/16-common-patterns/) — куда встроить ML в пайплайн анализа.
