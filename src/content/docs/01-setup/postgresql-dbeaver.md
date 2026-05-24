---
title: PostgreSQL и DBeaver
description: "Установка PostgreSQL и DBeaver Community, подключение к базе, загрузка демо-данных для практики SQL."
sidebar:
  order: 3
---

:::tip[Коротко]
Для практики SQL нужны две вещи: **сервер БД** (PostgreSQL — стандарт для аналитиков) и **GUI-клиент** (DBeaver Community — бесплатный, под все ОС). Ставим оба, создаём подключение, заливаем демо-данные — и можно писать запросы.
:::

## PostgreSQL

**macOS** (Homebrew):

```bash
brew install postgresql@16
brew services start postgresql@16   # запустить сервер
```

**Windows**: скачай установщик [EDB](https://www.postgresql.org/download/windows/), запусти, запомни пароль для пользователя `postgres`.

**Linux** (Debian/Ubuntu):

```bash
sudo apt install postgresql
sudo systemctl start postgresql
```

Проверка, что сервер жив:

```bash
psql --version
```

## DBeaver Community

Скачай с [dbeaver.io](https://dbeaver.io/download/) (версия **Community** — бесплатная) и установи. Это удобный GUI: дерево таблиц, редактор запросов, просмотр результатов.

## Создание подключения

1. В DBeaver: **Database → New Database Connection → PostgreSQL**.
2. Host `localhost`, Port `5432`, Database `postgres`, User `postgres`, пароль — тот, что задал при установке (на macOS через Homebrew пароль обычно пустой, юзер — твоё имя в системе).
3. **Test Connection** → если зелёная галочка, жми **Finish**.

## Демо-данные для практики

Чтобы было на чём тренироваться, залей готовую учебную базу. Популярные варианты:

- **dvdrental** (Pagila) — классика для PostgreSQL, [скачать](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/).
- **Northwind** — заказы и товары, есть [порт под Postgres](https://github.com/pthom/northwind_psql).

Либо просто создай таблицу `orders` из [раздела SQL](/02-sql/02-environment-setup/) — сквозной демо-датасет этого хендбука.

:::caution[Сервер должен быть запущен]
Если DBeaver пишет «Connection refused» — почти всегда сервер PostgreSQL не запущен. Проверь: `brew services list` (macOS), `systemctl status postgresql` (Linux) или службу «postgresql» в «Службах» (Windows).
:::

## Что дальше

- [SQL: настройка окружения](/02-sql/02-environment-setup/) — создаём демо-таблицы хендбука.
- [Основы SELECT](/02-sql/03-select-basics/) — первый запрос.
