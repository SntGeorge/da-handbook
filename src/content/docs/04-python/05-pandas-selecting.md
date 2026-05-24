---
title: "pandas: выборка данных"
description: "Выбор и фильтрация в pandas: loc и iloc, булевы маски, isin/between/str.contains, метод query, where/mask."
sidebar:
  order: 5
---

:::tip[Коротко]
Два способа доступа: **`loc`** — по меткам (имена столбцов, значения индекса), **`iloc`** — по числовым позициям. Фильтрация — через **булевы маски** (`df[df["amount"] > 2000]`) или удобный **`query()`** в SQL-подобном стиле.
:::

:::note[Поток данных]
Вход: DataFrame со всеми строками и столбцами
→ Обработка: булева маска / `loc` / `query` отбирают нужные строки и столбцы
→ Выход: подмножество данных.
Зачем: оставить только релевантное для анализа — аналог `WHERE` и выбора колонок в SQL.
:::

## Зачем это нужно

90% работы с данными — это «оставить нужные строки и столбцы»: заказы из России, дороже 2000, оплаченные. В pandas это делается масками и `loc` — аналог `WHERE` и выбора колонок в SQL.

```python title="Демо-DataFrame df"
#  order_id country status  amount
#  101      RU      paid    2500
#  102      RU      paid    1800
#  104      KZ      paid    4200
#  105      KZ      cancel  700
#  106      DE      paid    3000
```

## Выбор столбцов

```python
df["amount"]                 # один столбец → Series
df[["country", "amount"]]    # несколько → DataFrame
```

## loc vs iloc

```python
df.loc[0, "amount"]          # по метке: строка с индексом 0, столбец amount → 2500
df.loc[df["country"]=="RU", ["order_id","amount"]]   # маска + столбцы
df.iloc[0, 3]                # по позиции: 1-я строка, 4-й столбец → 2500
df.iloc[0:2]                 # первые две строки
```

`loc` — по именам, `iloc` — по номерам. Запомни: **l**oc = **l**abels.

## Булевы маски

Условие даёт `Series` из `True/False`, которым отбираются строки:

```python
df[df["amount"] > 2000]                       # дороже 2000
df[(df["country"]=="RU") & (df["status"]=="paid")]   # И
df[(df["country"]=="RU") | (df["country"]=="KZ")]    # ИЛИ
```

:::caution[Скобки и & вместо and]
В масках pandas используется `&`, `|`, `~` (не `and`/`or`/`not`), и **каждое условие в скобках**: `(df.a > 1) & (df.b < 5)`. Без скобок Python поймёт приоритеты неверно и выдаст ошибку.
:::

## Удобные методы фильтрации

```python
df[df["country"].isin(["RU", "KZ"])]          # значение из списка
df[df["amount"].between(1000, 3000)]          # диапазон включительно
df[df["status"].str.contains("paid")]         # подстрока в тексте
```

## query() — SQL-подобный синтаксис

`query()` пишет условие строкой — часто читается чище, особенно при многих условиях:

```python
df.query("country == 'RU' and amount > 2000")
df.query("amount.between(1000, 3000)")
threshold = 2000
df.query("amount > @threshold")               # @ — подставить переменную
```

## where и mask

В отличие от фильтра (он удаляет строки), `where`/`mask` сохраняют форму, заменяя не подошедшие значения на `NaN`:

```python
df["amount"].where(df["amount"] > 2000)       # оставит >2000, прочее → NaN
df["amount"].mask(df["amount"] > 2000, 0)     # наоборот: >2000 заменит на 0
```

<details>
<summary>1. Как выбрать оплаченные заказы из Казахстана дороже 1000?</summary>

Маской: `df[(df["country"]=="KZ") & (df["status"]=="paid") & (df["amount"]>1000)]`. Или `query`: `df.query("country=='KZ' and status=='paid' and amount>1000")`. На демо-данных — заказ 104.

</details>

<details>
<summary>2. В чём разница между loc и iloc?</summary>

`loc` обращается по меткам (имя столбца, значение индекса), `iloc` — по целочисленным позициям. `df.loc[0,"amount"]` — по имени столбца; `df.iloc[0,3]` — по номеру столбца. Для фильтрации масками используют `loc`.

</details>

## Что дальше

- [pandas: трансформации](/04-python/06-pandas-transforming/) — менять и создавать столбцы.
- [pandas: группировка](/04-python/07-pandas-grouping/) — агрегаты по группам.
