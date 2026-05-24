---
title: PostgreSQL and DBeaver
description: "Installing PostgreSQL and DBeaver Community, connecting to the database, loading demo data for SQL practice."
sidebar:
  order: 3
---

:::tip[In short]
For SQL practice you need two things: a **DB server** (PostgreSQL — the standard for analysts) and a **GUI client** (DBeaver Community — free, all OSes). Install both, create a connection, load demo data — and you can write queries.
:::

## PostgreSQL

**macOS** (Homebrew):

```bash
brew install postgresql@16
brew services start postgresql@16   # start the server
```

**Windows**: download the [EDB installer](https://www.postgresql.org/download/windows/), run it, remember the password for the `postgres` user.

**Linux** (Debian/Ubuntu):

```bash
sudo apt install postgresql
sudo systemctl start postgresql
```

Check the server is alive:

```bash
psql --version
```

## DBeaver Community

Download from [dbeaver.io](https://dbeaver.io/download/) (the **Community** edition is free) and install. It's a handy GUI: a table tree, a query editor, a results view.

## Creating a connection

1. In DBeaver: **Database → New Database Connection → PostgreSQL**.
2. Host `localhost`, Port `5432`, Database `postgres`, User `postgres`, password — the one you set during install (on macOS via Homebrew the password is usually empty and the user is your system name).
3. **Test Connection** → if you get a green check, click **Finish**.

## Demo data for practice

To have something to train on, load a ready-made learning database. Popular options:

- **dvdrental** (Pagila) — the PostgreSQL classic, [download](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).
- **Northwind** — orders and products, there's a [Postgres port](https://github.com/pthom/northwind_psql).

Or just create the `orders` table from the [SQL section](/en/02-sql/02-environment-setup/) — this handbook's running demo dataset.

:::caution[The server must be running]
If DBeaver says "Connection refused" — almost always the PostgreSQL server isn't running. Check: `brew services list` (macOS), `systemctl status postgresql` (Linux), or the "postgresql" service in Services (Windows).
:::

## What's next

- [SQL: environment setup](/en/02-sql/02-environment-setup/) — creating the handbook's demo tables.
- [SELECT basics](/en/02-sql/03-select-basics/) — your first query.
