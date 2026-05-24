---
title: Установка окружения
description: "PostgreSQL + DBeaver, загрузка демо-БД и схема интернет-магазина, на которой построены все примеры раздела."
sidebar:
  order: 2
---

:::tip[Коротко]
Минимальный набор для практики SQL: **PostgreSQL** (сама БД) + **DBeaver** (графический клиент). Дальше — либо подгружаешь готовую демо-БД (Sakila/Northwind), либо создаёшь нашу учебную схему интернет-магазина (DDL ниже).
:::

## Зачем это нужно

SQL учится только руками. Читать примеры бесполезно — нужно выполнять запросы и видеть результат. Поднимем локальную БД и зальём данные, на которых построены все примеры этого раздела.

## Шаг 1. PostgreSQL

PostgreSQL — самая популярная СУБД у аналитиков, бесплатная и стандартная по синтаксису. Подробная установка под твою ОС — в разделе [Установка и окружение](/01-setup/postgresql-dbeaver/).

Быстрый путь:

- **macOS:** `brew install postgresql@16 && brew services start postgresql@16`
- **Windows:** установщик с [postgresql.org](https://www.postgresql.org/download/windows/)
- **Linux:** `sudo apt install postgresql`

Проверка, что сервер жив:

```bash
psql --version
psql -U postgres -c "SELECT version();"
```

## Шаг 2. DBeaver

[DBeaver](https://dbeaver.io/) — бесплатный графический клиент: подключаешься к БД, пишешь запросы, видишь результат таблицей. Удобнее, чем терминал.

1. Скачай Community Edition, установи.
2. New Connection → PostgreSQL → хост `localhost`, порт `5432`, пользователь `postgres`.
3. Создай отдельную учебную БД: правой кнопкой на сервере → Create New Database → `handbook`.

## Шаг 3. Наша демо-схема

Все примеры раздела SQL используют один сквозной датасет интернет-магазина. Выполни этот скрипт в SQL-редакторе DBeaver (или через `psql -d handbook -f schema.sql`) — и можешь повторять любой запрос из раздела:

```sql title="schema.sql — учебная схема интернет-магазина"
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
    (1, 'Аня', 'RU'), (2, 'Борис', 'RU'), (3, 'Кира', 'KZ'), (4, 'Лев', 'DE');

INSERT INTO orders VALUES
    (101, 1, 'paid', 2500), (102, 1, 'paid', 1800),
    (103, 2, 'cancelled', 990), (104, 3, 'paid', 4200), (105, 9, 'paid', 700);

INSERT INTO products VALUES
    (10, 'Кофе', 'Еда'), (20, 'Кружка', 'Посуда'), (30, 'Книга', 'Книги');

INSERT INTO order_items VALUES
    (101, 10, 2), (101, 20, 1), (102, 30, 1), (104, 10, 1), (104, 30, 3);
```

Проверь, что всё загрузилось:

```sql
SELECT COUNT(*) AS customers FROM customers;   -- 4
SELECT COUNT(*) AS orders FROM orders;          -- 5
```

| customers |
|-----------|
| 4         |

## Готовые демо-БД (по желанию)

Для задач посложнее пригодятся классические учебные базы:

| База | Про что | Где взять |
|------|---------|-----------|
| **dvdrental** | прокат фильмов (Postgres-native) | [пример из доков PostgreSQL](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/) |
| **Northwind** | интернет-торговля (классика) | порт для Postgres на GitHub |
| **Sakila** | прокат фильмов (изначально MySQL) | есть Postgres-порт |

Загрузка дампа:

```bash
# восстановить из .tar/.sql дампа в созданную БД
pg_restore -U postgres -d dvdrental dvdrental.tar
# или для .sql
psql -U postgres -d northwind -f northwind.sql
```

:::note[Не хочешь ставить локально?]
Есть онлайн-песочницы: [DB Fiddle](https://www.db-fiddle.com/), [SQLite Online](https://sqliteonline.com/). Для первых шагов хватит, но для серьёзной практики лучше локальный PostgreSQL + DBeaver — ближе к реальной работе.
:::

## Полезные шорткаты DBeaver

| Действие | Шорткат |
|----------|---------|
| Выполнить запрос | `Ctrl/Cmd + Enter` |
| Выполнить скрипт целиком | `Alt + X` |
| Автодополнение | `Ctrl + Space` |
| Форматировать SQL | `Ctrl/Cmd + Shift + F` |

## Что дальше

- [SELECT и WHERE](/02-sql/03-select-basics/) — первые запросы к загруженным таблицам.
- [Реляционные БД: концепции](/02-sql/01-rdbms-concepts/) — если хочется сперва разобраться в устройстве таблиц и ключей.
