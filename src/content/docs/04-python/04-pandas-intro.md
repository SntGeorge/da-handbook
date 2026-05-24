---
title: "pandas: введение"
description: "Основы pandas: Series и DataFrame, создание, чтение read_csv/read_excel/read_sql, запись, первый осмотр данных info/describe/head."
sidebar:
  order: 4
---

:::tip[Коротко]
pandas — главный инструмент аналитика в Python. Основные объекты: **`Series`** (один столбец) и **`DataFrame`** (таблица). Данные читаются одной строкой (`pd.read_csv`, `read_excel`, `read_sql`), а первый осмотр делается через `head()`, `info()`, `describe()`.
:::

## Зачем это нужно

pandas — это «Excel в коде»: таблицы, фильтры, группировки, сводные — но воспроизводимо, на любых объёмах и без ручного клика. Практически вся работа аналитика на Python проходит через pandas.

## Series и DataFrame

```python
import pandas as pd

# Series — один столбец с индексом
s = pd.Series([2500, 1800, 4200], name="amount")

# DataFrame — таблица из столбцов
df = pd.DataFrame({
    "order_id":    [101, 102, 104],
    "country":     ["RU", "RU", "KZ"],
    "status":      ["paid", "paid", "paid"],
    "amount":      [2500, 1800, 4200],
})
```

`DataFrame` — это набор `Series` с общим индексом. Один столбец `df["amount"]` — это `Series`.

## Чтение данных

Откуда обычно берут данные:

```python
df = pd.read_csv("orders.csv")              # CSV — чаще всего
df = pd.read_excel("report.xlsx")           # Excel
df = pd.read_json("data.json")              # JSON
df = pd.read_sql("SELECT * FROM orders", conn)   # прямо из БД
```

Полезные параметры `read_csv`: `sep=";"` (разделитель), `encoding="utf-8"`, `parse_dates=["date"]`. Подробнее — в [работе с файлами](/04-python/13-working-with-files/).

## Запись данных

```python
df.to_csv("result.csv", index=False)    # index=False — без столбца индекса
df.to_excel("result.xlsx", index=False)
```

:::caution[index=False при сохранении]
Без `index=False` pandas допишет лишний безымянный столбец с индексом (0,1,2…). При следующем чтении он станет колонкой `Unnamed: 0`. Привыкай ставить `index=False` при `to_csv`/`to_excel`.
:::

## Первый осмотр данных

Первое, что делают с любым новым датасетом:

```python
df.head()        # первые 5 строк
df.tail(3)       # последние 3
df.shape         # (строк, столбцов) → (3, 4)
df.info()        # типы столбцов и количество не-null
df.describe()    # статистика по числовым: count, mean, min, max, квантили
df.columns       # список названий столбцов
df["country"].value_counts()   # частоты значений
```

`info()` сразу показывает, где есть пропуски (по числу non-null) и не «съехали» ли типы (число прочиталось как текст).

## Задачи для самопроверки

<details>
<summary>1. В чём разница между Series и DataFrame?</summary>

`Series` — одномерный массив с индексом (по сути один столбец). `DataFrame` — двумерная таблица, набор `Series` с общим индексом. Обращение к одному столбцу `df["col"]` возвращает `Series`.

</details>

<details>
<summary>2. С чего начать знакомство с незнакомым CSV?</summary>

`pd.read_csv(...)`, затем `df.head()` (посмотреть данные), `df.shape` (размер), `df.info()` (типы и пропуски), `df.describe()` (числовая сводка). Это даёт картину за минуту до любого анализа.

</details>

## Что дальше

- [pandas: выборка данных](/04-python/05-pandas-selecting/) — фильтры, `loc`/`iloc`, маски.
- [pandas: трансформации](/04-python/06-pandas-transforming/) — создавать и менять столбцы.
