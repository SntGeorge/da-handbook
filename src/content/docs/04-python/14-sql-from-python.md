---
title: SQL из Python
description: "Запросы к БД из Python: pandas.read_sql, SQLAlchemy engine, psycopg для PostgreSQL, параметризованные запросы (защита от SQL-инъекций), to_sql."
sidebar:
  order: 14
---

:::tip[Коротко]
Чтобы тянуть данные из базы в pandas, нужны два кирпича: **движок подключения** (обычно через SQLAlchemy) и **`pd.read_sql`**, который возвращает результат запроса сразу как DataFrame. Параметры запроса всегда передавай отдельно (`params=`), а не склеивай в строку — это защита от SQL-инъекций.
:::

:::note[Поток данных]
Вход: таблицы в БД (PostgreSQL и др.)
→ Обработка: SQLAlchemy-движок открывает подключение, `pd.read_sql` выполняет запрос на стороне базы
→ Выход: результат запроса сразу как DataFrame.
Зачем: тяжёлую фильтрацию/агрегацию делает база, а pandas получает готовый компактный результат.
:::

## Зачем это нужно

Чаще всего данные живут в базе, а не в файлах. Связка SQL + pandas — повседневный рабочий процесс: тяжёлую фильтрацию и агрегацию делает база (быстро, близко к данным), а тонкий анализ и графики — pandas.

## Подключение через SQLAlchemy

`engine` описывает, к какой базе и как подключаться:

```python
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://user:pass@localhost:5432/shop")
```

Для PostgreSQL нужен драйвер `psycopg2` (или `psycopg`), для MySQL — `pymysql`, для SQLite — встроено.

:::caution[Не храни пароль в коде]
Строка подключения с паролем не должна попадать в репозиторий. Держи её в переменной окружения (`os.environ["DB_URL"]`) или `.env`-файле, а сам файл добавь в `.gitignore`. Закоммиченный пароль от боевой базы — серьёзный инцидент.
:::

## read_sql: запрос → DataFrame

```python
import pandas as pd

df = pd.read_sql("SELECT country, SUM(amount) AS revenue "
                 "FROM orders GROUP BY country", engine)
```

Результат сразу DataFrame — можно строить графики и считать дальше. Тяжёлую работу (`JOIN`, `GROUP BY`) отдавай базе, а не тащи всю таблицу в Python.

## Параметризованные запросы

Если в запрос подставляется значение от пользователя/переменной — **никогда** не склеивай строку. Передавай параметры отдельно:

```python
# ❌ опасно — SQL-инъекция
pd.read_sql(f"SELECT * FROM orders WHERE country = '{user_input}'", engine)

# ✅ безопасно — параметр передан отдельно
from sqlalchemy import text
q = text("SELECT * FROM orders WHERE country = :c AND amount > :a")
pd.read_sql(q, engine, params={"c": "RU", "a": 2000})
```

При склейке строки злоумышленник может подставить `'; DROP TABLE orders; --` и испортить базу. Параметризация экранирует значение и делает это невозможным.

## Запись в базу: to_sql

```python
df.to_sql("results", engine, if_exists="append", index=False)
```

`if_exists`: `fail` (по умолчанию, ошибка если таблица есть), `replace` (пересоздать), `append` (дописать).

<details>
<summary>1. Нужна выручка по странам из БД для графика. Тянуть всю таблицу в pandas?</summary>

Нет. Отдай агрегацию базе: `pd.read_sql("SELECT country, SUM(amount) ... GROUP BY country", engine)`. База сделает это быстрее и вернёт компактный результат. Тащить миллионы строк в pandas ради суммы — расточительно.

</details>

<details>
<summary>2. Почему нельзя вставлять значение прямо в строку запроса через f-string?</summary>

Это уязвимость SQL-инъекции: вредоносный ввод изменит логику запроса (вплоть до удаления данных). Нужно передавать значения через `params=` — драйвер безопасно их экранирует. Это правило действует всегда, даже если «ввод вроде бы свой».

</details>

## Что дальше

- [API и скрейпинг](/04-python/15-apis-and-scraping/) — данные из веба, а не из базы.
- [Изменение данных в SQL](/02-sql/13-data-modification/) — INSERT, UPDATE, DELETE.
