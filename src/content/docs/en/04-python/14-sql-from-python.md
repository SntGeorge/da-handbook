---
title: SQL from Python
description: "Querying a DB from Python: pandas.read_sql, SQLAlchemy engine, psycopg for PostgreSQL, parameterized queries (SQL injection protection), to_sql."
sidebar:
  order: 14
---

:::tip[In short]
To pull data from a database into pandas you need two building blocks: a **connection engine** (usually via SQLAlchemy) and **`pd.read_sql`**, which returns a query result directly as a DataFrame. Always pass query parameters separately (`params=`) rather than concatenating into the string — that's protection against SQL injection.
:::

:::note[Data flow]
Input: tables in a DB (PostgreSQL, etc.)
→ Processing: a SQLAlchemy engine opens a connection, `pd.read_sql` runs the query on the database side
→ Output: the query result directly as a DataFrame.
Why: the database does the heavy filtering/aggregation, and pandas gets a ready compact result.
:::

## Why you need it

Most often data lives in a database, not in files. The SQL + pandas combo is a daily workflow: the database does the heavy filtering and aggregation (fast, close to the data), and pandas does the fine analysis and charts.

## Connecting via SQLAlchemy

The `engine` describes which database to connect to and how:

```python
from sqlalchemy import create_engine

engine = create_engine("postgresql+psycopg2://user:pass@localhost:5432/shop")
```

For PostgreSQL you need the `psycopg2` driver (or `psycopg`), for MySQL — `pymysql`, for SQLite — built in.

:::caution[Don't store the password in code]
A connection string with a password must not end up in the repository. Keep it in an environment variable (`os.environ["DB_URL"]`) or a `.env` file, and add that file to `.gitignore`. A committed production database password is a serious incident.
:::

## read_sql: query → DataFrame

```python
import pandas as pd

df = pd.read_sql("SELECT country, SUM(amount) AS revenue "
                 "FROM orders GROUP BY country", engine)
```

The result is a DataFrame right away — you can chart and compute further. Hand the heavy work (`JOIN`, `GROUP BY`) to the database, don't drag the whole table into Python.

## Parameterized queries

If a value from a user/variable is substituted into the query — **never** concatenate the string. Pass parameters separately:

```python
# ❌ dangerous — SQL injection
pd.read_sql(f"SELECT * FROM orders WHERE country = '{user_input}'", engine)

# ✅ safe — the parameter is passed separately
from sqlalchemy import text
q = text("SELECT * FROM orders WHERE country = :c AND amount > :a")
pd.read_sql(q, engine, params={"c": "RU", "a": 2000})
```

With string concatenation an attacker can inject `'; DROP TABLE orders; --` and wreck the database. Parameterization escapes the value and makes that impossible. More — in [the section on SQL injection](/en/02-sql/13-data-modification/).

## Writing to the database: to_sql

```python
df.to_sql("results", engine, if_exists="append", index=False)
```

`if_exists`: `fail` (default, errors if the table exists), `replace` (recreate), `append` (add).

<details>
<summary>1. You need revenue by country from the DB for a chart. Pull the whole table into pandas?</summary>

No. Hand the aggregation to the database: `pd.read_sql("SELECT country, SUM(amount) ... GROUP BY country", engine)`. The DB does it faster and returns a compact result. Dragging millions of rows into pandas just for a sum is wasteful.

</details>

<details>
<summary>2. Why can't you insert a value directly into the query string via an f-string?</summary>

It's an SQL injection vulnerability: malicious input changes the query's logic (up to deleting data). You must pass values via `params=` — the driver escapes them safely. This rule always applies, even if "the input seems to be your own".

</details>

## What's next

- [APIs and scraping](/en/04-python/15-apis-and-scraping/) — data from the web, not the database.
- [Data modification in SQL](/en/02-sql/13-data-modification/) — INSERT/UPDATE and the injection topic.
