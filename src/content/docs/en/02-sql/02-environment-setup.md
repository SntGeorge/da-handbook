---
title: Environment setup
description: "PostgreSQL + DBeaver, loading a demo database, and the online-store schema all the section's examples are built on."
sidebar:
  order: 2
---

:::tip[In short]
The minimal kit for practicing SQL: **PostgreSQL** (the database itself) + **DBeaver** (a GUI client). Then either load a ready-made demo DB (Sakila/Northwind) or create our learning online-store schema (DDL below).
:::

## Why you need it

SQL is only learned hands-on. Reading examples is useless — you need to run queries and see the result. Let's spin up a local database and load the data all examples in this section are built on.

## Step 1. PostgreSQL

PostgreSQL is the most popular database among analysts — free and standard in syntax. Detailed install for your OS is in the [Setup & Environment](/en/01-setup/postgresql-dbeaver/) section.

Quick path:

- **macOS:** `brew install postgresql@16 && brew services start postgresql@16`
- **Windows:** the installer from [postgresql.org](https://www.postgresql.org/download/windows/)
- **Linux:** `sudo apt install postgresql`

Check the server is alive:

```bash
psql --version
psql -U postgres -c "SELECT version();"
```

## Step 2. DBeaver

[DBeaver](https://dbeaver.io/) is a free GUI client: connect to a database, write queries, see the result as a table. More convenient than the terminal.

1. Download Community Edition, install it.
2. New Connection → PostgreSQL → host `localhost`, port `5432`, user `postgres`.
3. Create a separate learning DB: right-click the server → Create New Database → `handbook`.

## Step 3. Our demo schema

All examples in the SQL section use one shared online-store dataset. Run this script in DBeaver's SQL editor (or via `psql -d handbook -f schema.sql`) — and you can reproduce any query in the section:

```sql title="schema.sql — learning online-store schema"
CREATE TABLE customers (
    customer_id int PRIMARY KEY,
    name        text,
    country     text
);

CREATE TABLE orders (
    order_id    int PRIMARY KEY,
    customer_id int,
    status      text,
    amount      numeric
);

CREATE TABLE products (
    product_id int PRIMARY KEY,
    title      text,
    category   text
);

CREATE TABLE order_items (
    order_id   int,
    product_id int,
    qty        int
);

INSERT INTO customers VALUES
    (1, 'Anna', 'RU'), (2, 'Boris', 'RU'), (3, 'Kira', 'KZ'), (4, 'Lev', 'DE');

INSERT INTO orders VALUES
    (101, 1, 'paid', 2500), (102, 1, 'paid', 1800),
    (103, 2, 'cancelled', 990), (104, 3, 'paid', 4200), (105, 9, 'paid', 700);

INSERT INTO products VALUES
    (10, 'Coffee', 'Food'), (20, 'Mug', 'Dishes'), (30, 'Book', 'Books');

INSERT INTO order_items VALUES
    (101, 10, 2), (101, 20, 1), (102, 30, 1), (104, 10, 1), (104, 30, 3);
```

Check that everything loaded:

```sql
SELECT COUNT(*) AS customers FROM customers;   -- 4
SELECT COUNT(*) AS orders FROM orders;          -- 5
```

| customers |
|-----------|
| 4         |

## Ready-made demo databases (optional)

For tougher tasks, classic learning databases come in handy:

| Database | About | Where to get it |
|----------|-------|-----------------|
| **dvdrental** | DVD rental (Postgres-native) | [PostgreSQL sample database](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) |
| **Northwind** | online retail (a classic) | a Postgres port on GitHub |
| **Sakila** | DVD rental (originally MySQL) | a Postgres port exists |

Loading a dump:

```bash
# restore from a .tar/.sql dump into the created DB
pg_restore -U postgres -d dvdrental dvdrental.tar
# or for .sql
psql -U postgres -d northwind -f northwind.sql
```

:::note[Don't want to install locally?]
There are online playgrounds: [DB Fiddle](https://www.db-fiddle.com/), [SQLite Online](https://sqliteonline.com/). Enough for first steps, but for serious practice a local PostgreSQL + DBeaver is closer to real work.
:::

## Handy DBeaver shortcuts

| Action | Shortcut |
|--------|----------|
| Run query | `Ctrl/Cmd + Enter` |
| Run whole script | `Alt + X` |
| Autocomplete | `Ctrl + Space` |
| Format SQL | `Ctrl/Cmd + Shift + F` |

## What's next

- [SELECT and WHERE](/en/02-sql/03-select-basics/) — your first queries against the loaded tables.
- [Relational databases: concepts](/en/02-sql/01-rdbms-concepts/) — if you'd rather first understand how tables and keys work.
