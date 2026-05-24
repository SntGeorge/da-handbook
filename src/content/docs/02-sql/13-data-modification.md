---
title: Модификация данных
description: "INSERT, UPDATE, DELETE, UPSERT (ON CONFLICT), TRUNCATE и транзакции — как менять данные безопасно."
sidebar:
  order: 13
---

:::tip[Коротко]
Три команды изменения данных (DML): `INSERT` (добавить), `UPDATE` (изменить), `DELETE` (удалить).

- `INSERT ... SELECT` — вставить результат запроса.
- `UPDATE ... WHERE` / `DELETE ... WHERE` — **всегда с `WHERE`**, иначе заденешь всю таблицу.
- `INSERT ... ON CONFLICT` — upsert (вставить или обновить).
- Оборачивай рискованные изменения в **транзакцию** (`BEGIN ... COMMIT/ROLLBACK`).
:::

:::note[Поток данных]
Вход: таблица + новые/изменяемые значения
→ Обработка: `INSERT` добавляет строки, `UPDATE` меняет по `WHERE`, `DELETE` удаляет по `WHERE`
→ Выход: изменённое состояние таблицы.
Зачем: не только читать, но и менять данные — наполнять таблицы, править, чистить.
:::

## Зачем это нужно

Аналитик в основном читает данные, но иногда нужно и менять: подготовить витрину, поправить грязные значения, наполнить тестовую таблицу. Здесь цена ошибки выше — `UPDATE` без `WHERE` молча перезапишет всю таблицу.

```sql title="Демо-данные"
CREATE TABLE customers (
    customer_id int PRIMARY KEY,
    name        text,
    country     text,
    bonus       int DEFAULT 0
);

INSERT INTO customers (customer_id, name, country) VALUES
    (1, 'Аня', 'RU'), (2, 'Борис', 'RU'), (3, 'Кира', 'KZ');
```

## INSERT

Явно перечисляй столбцы — так вставка не сломается при изменении схемы:

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (4, 'Лев', 'DE');

-- сразу несколько строк
INSERT INTO customers (customer_id, name, country)
VALUES (5, 'Мия', 'US'), (6, 'Ник', 'GB');
```

`INSERT ... SELECT` наполняет таблицу результатом запроса — основа для витрин:

```sql
INSERT INTO vip_customers (customer_id, name)
SELECT customer_id, name FROM customers WHERE bonus > 1000;
```

## UPDATE

```sql
UPDATE customers
SET bonus = 500
WHERE country = 'RU';
```

:::danger[UPDATE/DELETE без WHERE = вся таблица]
`UPDATE customers SET bonus = 500;` без `WHERE` обновит **каждую** строку. Привычка: сначала напиши `SELECT` с тем же `WHERE`, убедись, что выбираются нужные строки, и только потом меняй `SELECT` на `UPDATE`/`DELETE`.
:::

`UPDATE` с данными из другой таблицы (синтаксис PostgreSQL — `FROM`):

```sql
UPDATE orders o
SET status = 'vip'
FROM customers c
WHERE c.customer_id = o.customer_id AND c.bonus > 1000;
```

## DELETE и TRUNCATE

```sql
DELETE FROM customers WHERE customer_id = 6;   -- удалить конкретные строки
```

| Команда | Что делает | Откат |
|---------|-----------|-------|
| `DELETE FROM t WHERE ...` | удаляет строки по условию | можно (в транзакции) |
| `DELETE FROM t` | удаляет все строки построчно | можно, но медленно |
| `TRUNCATE t` | мгновенно очищает таблицу целиком | быстро, но без построчного отката |

`TRUNCATE` — когда нужно быстро очистить всю таблицу (например, перед перезаливкой витрины). `DELETE` — когда удаляешь по условию.

## UPSERT: INSERT ... ON CONFLICT

«Вставить, а если такой ключ уже есть — обновить». Незаменимо для идемпотентной загрузки данных:

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (1, 'Аня', 'AM')
ON CONFLICT (customer_id)
DO UPDATE SET country = EXCLUDED.country;   -- обновит страну Ани на 'AM'
```

`EXCLUDED` — это строка, которую пытались вставить. В стандарте SQL и в Snowflake/BigQuery аналог — команда `MERGE`.

## Транзакции на пальцах

Транзакция — это «всё или ничего»: набор изменений, который применяется целиком или откатывается целиком.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;   -- зафиксировать; или ROLLBACK — отменить всё
```

Если между двумя `UPDATE` что-то упадёт — `ROLLBACK` вернёт всё как было, деньги не «потеряются». Свойства транзакций описывают аббревиатурой **ACID** (атомарность, согласованность, изоляция, надёжность).

:::tip[Безопасный апдейт]
Перед массовым изменением: `BEGIN;` → выполни `UPDATE` → `SELECT` проверь результат → `COMMIT` (если ок) или `ROLLBACK` (если что-то не так). Так ошибка не станет необратимой.
:::

<details>
<summary>1. Начисли бонус 300 всем клиентам из Казахстана.</summary>

```sql
-- сначала проверь, кого заденет:
SELECT * FROM customers WHERE country = 'KZ';
-- потом меняй:
UPDATE customers SET bonus = 300 WHERE country = 'KZ';
```

</details>

<details>
<summary>2. Загрузи клиента так, чтобы повторный запуск не создал дубль.</summary>

```sql
INSERT INTO customers (customer_id, name, country)
VALUES (3, 'Кира', 'KZ')
ON CONFLICT (customer_id) DO NOTHING;
```

`ON CONFLICT DO NOTHING` делает вставку идемпотентной — повторный запуск ничего не сломает.

</details>

<details>
<summary>3. Чем TRUNCATE отличается от DELETE без WHERE?</summary>

Оба очищают таблицу, но `TRUNCATE` делает это мгновенно (не построчно), сбрасывает счётчики автоинкремента и обычно не пишет каждую строку в лог. `DELETE` удаляет построчно, медленнее, но гибче (можно с `WHERE`) и аккуратнее откатывается.

</details>

## Что дальше

- [Индексы и оптимизация](/02-sql/14-indexes-optimization/) — почему массовые `UPDATE` бывают медленными и как это диагностировать.
- [CTE](/02-sql/08-cte/) — для сложных `INSERT ... SELECT` с предварительной подготовкой данных.

**Практика:** [PostgreSQL docs: INSERT](https://www.postgresql.org/docs/current/sql-insert.html) — про `ON CONFLICT`; транзакции — [глава про MVCC](https://www.postgresql.org/docs/current/mvcc.html).
