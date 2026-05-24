---
title: Matplotlib и Seaborn
description: "Визуализация в Python: matplotlib (figure/axes, line/bar/scatter/hist/box), кастомизация и Seaborn (heatmap, pairplot, темы)."
sidebar:
  order: 11
---

:::tip[Коротко]
**Matplotlib** — базовая библиотека графиков (всё строится через `fig, ax`). **Seaborn** — надстройка над ней: красивее по умолчанию и короче для статистических графиков. На практике: быстрый график — прямо из pandas (`df.plot`), статистика — Seaborn, тонкая настройка — matplotlib.
:::

## Зачем это нужно

График объясняет данные быстрее таблицы: тренд, выброс, распределение видно глазом. Для разведочного анализа (EDA) и отчётов это незаменимо. Для интерактива есть [Plotly](/04-python/12-plotly-basics/), но статичные графики — рабочая основа.

## Matplotlib: figure и axes

Канва (`figure`) и область с осями (`axes`) — основа всего:

```python
import matplotlib.pyplot as plt

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot([1, 2, 3], [10, 20, 15])
ax.set_title("Выручка")
ax.set_xlabel("Месяц")
ax.set_ylabel("₽")
plt.show()
```

Из pandas ещё быстрее — он сам вызывает matplotlib:

```python
df.groupby("country")["amount"].sum().plot(kind="bar")
```

## Типы графиков

| Тип | Метод | Когда |
|-----|-------|-------|
| Линия | `plot` | динамика во времени |
| Столбцы | `bar` | сравнение категорий |
| Точки | `scatter` | связь двух величин |
| Гистограмма | `hist` | распределение одной величины |
| Ящик с усами | `boxplot` | разброс и выбросы |

Какой график для какой задачи — подробно в [разделе визуализации](/06-visualization/02-chart-types/).

## Кастомизация

```python
ax.set_title("Заголовок", fontsize=14)
ax.legend(["Продажи"])              # легенда
ax.set_xticks(range(0, 12))         # деления оси
ax.grid(True, alpha=0.3)            # сетка
fig.savefig("chart.png", dpi=150, bbox_inches="tight")   # сохранить
```

## Seaborn: меньше кода

Seaborn работает прямо с DataFrame и сам считает статистику:

```python
import seaborn as sns

sns.barplot(data=df, x="country", y="amount", estimator="sum")
sns.histplot(data=df, x="amount", bins=20)        # распределение
sns.boxplot(data=df, x="status", y="amount")      # разброс по группам
sns.heatmap(corr_matrix, annot=True)              # матрица корреляций
sns.pairplot(df)                                  # все пары числовых столбцов
```

`heatmap` корреляций и `pairplot` — классика быстрого EDA: за одну строку видно связи между признаками.

:::note[pandas .plot vs Seaborn vs matplotlib]
Быстрый набросок по ходу анализа — `df.plot()`. Статистический график «из коробки» (распределения, корреляции) — Seaborn. Полный контроль над каждым элементом для финального отчёта — чистый matplotlib. Все три совместимы: Seaborn рисует поверх matplotlib-осей.
:::

## Стили и темы

```python
sns.set_theme(style="whitegrid")     # аккуратная тема Seaborn разом
plt.style.use("ggplot")              # встроенные стили matplotlib
```

<details>
<summary>1. Нужно быстро глянуть распределение сумм заказов. Что построить?</summary>

Гистограмму: `df["amount"].hist(bins=20)` или `sns.histplot(data=df, x="amount")`. Гистограмма показывает, как часто встречаются разные диапазоны значений — форму распределения, перекосы, выбросы.

</details>

<details>
<summary>2. Когда брать Seaborn вместо matplotlib?</summary>

Когда нужен статистический график с минимумом кода (распределения, boxplot по группам, heatmap корреляций, pairplot) и устраивает оформление по умолчанию. Для полного контроля над каждым элементом — matplotlib. Seaborn всё равно строится поверх него.

</details>

## Что дальше

- [Plotly](/04-python/12-plotly-basics/) — интерактивные графики.
- [Принципы визуализации](/06-visualization/01-principles/) — как не врать графиком.
