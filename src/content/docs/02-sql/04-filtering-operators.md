---
title: Операторы фильтрации
description: "BETWEEN, IN, NOT IN, LIKE, ILIKE, IS NULL — удобные операторы WHERE и их подводные камни с NULL."
sidebar:
  order: 4
---

:::tip[Коротко]
Поверх `=`/`>`/`<` есть удобные операторы фильтрации:

- `BETWEEN a AND b` — диапазон **включительно**.
- `IN (...)` — «равно любому из списка».
- `LIKE` / `ILIKE` — поиск по шаблону (`%` — любые символы, `_` — один).
- `IS NULL` / `IS NOT NULL` — проверка на пустоту.

Главная ловушка: `= NULL` **не работает** и `NOT IN` с `NULL` молча отдаёт пусто. Подробнее ниже.
:::

:::note[Поток данных]
Вход: все строки таблицы
→ Обработка: условие в `WHERE` (`BETWEEN`/`IN`/`LIKE`/`IS NULL`) проверяется для каждой строки
→ Выход: только строки, где условие истинно.
Зачем: точно отобрать нужное подмножество данных — диапазон, список, шаблон, пропуски.
:::

## Зачем это нужно

Эти операторы делают `WHERE` короче и читаемее. Вместо `amount >= 1000 AND amount <= 5000` пишешь `amount BETWEEN 1000 AND 5000`. Но у `NULL` своя логика, и именно на ней теряют данные.

```sql title="Демо-данные"
CREATE TABLE customers (
    customer_id int PRIMARY KEY,
    name        text,
    country     text,
    phone       text          -- у некоторых не указан (NULL)
);

INSERT INTO customers VALUES
    (1, 'Аня',   'RU', '+7 900 111'),
    (2, 'Борис', 'RU', NULL),
    (3, 'Кира',  'KZ', '+7 701 222'),
    (4, 'Лев',   'DE', NULL),
    (5, 'Мия',   'US', '+1 415 333');
```

## BETWEEN: диапазон включительно

```sql
SELECT customer_id, name
FROM customers
WHERE customer_id BETWEEN 2 AND 4;
```

| customer_id | name  |
|-------------|-------|
| 2           | Борис |
| 3           | Кира  |
| 4           | Лев   |

:::note[Границы входят в диапазон]
`BETWEEN 2 AND 4` — это `2 <= x AND x <= 4`, то есть **обе** границы включаются. Для дат это частый источник ошибок: `BETWEEN '2026-01-01' AND '2026-01-31'` пропустит события 31-го числа после полуночи. Безопаснее `>= '2026-01-01' AND < '2026-02-01'`.
:::

## IN: «равно любому из списка»

```sql
SELECT name, country
FROM customers
WHERE country IN ('RU', 'KZ');
```

| name  | country |
|-------|---------|
| Аня   | RU      |
| Борис | RU      |
| Кира  | KZ      |

`country IN ('RU', 'KZ')` — короче, чем `country = 'RU' OR country = 'KZ'`.

## LIKE и ILIKE: поиск по шаблону

`%` — любое количество любых символов, `_` — ровно один символ.

```sql
-- телефоны, начинающиеся на "+7"
SELECT name, phone
FROM customers
WHERE phone LIKE '+7%';
```

| name | phone      |
|------|------------|
| Аня  | +7 900 111 |
| Кира | +7 701 222 |

`LIKE` чувствителен к регистру. В PostgreSQL есть `ILIKE` — регистронезависимый: `name ILIKE 'а%'` найдёт и «Аня», и «аня».

## IS NULL: проверка на пустоту

`NULL` — это «значение неизвестно», а не «пусто» и не «ноль». Любое сравнение с `NULL` через `=`, `<>`, `<` даёт не `true`/`false`, а `NULL` (≈ «неизвестно»), и строка не попадает в результат.

```sql
-- ❌ так НЕ найти клиентов без телефона — вернётся 0 строк
SELECT name FROM customers WHERE phone = NULL;

-- ✅ правильно
SELECT name FROM customers WHERE phone IS NULL;
```

| name  |
|-------|
| Борис |
| Лев   |

## Главная ловушка: NOT IN и NULL

Если в списке `NOT IN` окажется `NULL`, запрос молча вернёт **ноль строк** — даже там, где данные есть. Это одна из самых коварных ошибок в SQL.

```sql
-- если подзапрос вернёт хоть один NULL, результат будет пустым
SELECT name FROM customers
WHERE country NOT IN ('US', NULL);   -- ← вернёт 0 строк, а не "все кроме US"
```

Причина: `NOT IN (a, b)` разворачивается в `<> a AND <> b`, а `<> NULL` = `NULL`, и всё условие «ломается». Лечение — фильтровать `NULL` заранее или использовать `NOT EXISTS` (см. [Подзапросы](/02-sql/07-subqueries/)).

:::caution[Запомни про NULL]
- Сравнение с `NULL` всегда даёт «неизвестно» → строка отсекается.
- `COUNT(column)` не считает `NULL`, а `COUNT(*)` считает все строки.
- `NULL` в `NOT IN` обнуляет результат. В аналитике это тихо съедает данные — проверяй.
:::

<details>
<summary>1. Клиенты, у которых указан телефон.</summary>

```sql
SELECT name FROM customers WHERE phone IS NOT NULL;
```

Аня, Кира, Мия.

</details>

<details>
<summary>2. Клиенты из RU или KZ с известным телефоном.</summary>

```sql
SELECT name, country, phone
FROM customers
WHERE country IN ('RU', 'KZ') AND phone IS NOT NULL;
```

Аня и Кира (у Бориса телефон NULL).

</details>

<details>
<summary>3. Почему `WHERE country NOT IN ('US', NULL)` возвращает пусто?</summary>

`NOT IN (a, b)` = `country <> a AND country <> b`. Сравнение `country <> NULL` всегда даёт `NULL`, поэтому всё условие никогда не становится `true`. Нужно убрать `NULL` из списка или использовать `NOT EXISTS`.

</details>

## Что дальше

- [Агрегации](/02-sql/05-aggregations/) — `GROUP BY`, `COUNT`, `SUM` и поведение `NULL` в агрегатах.
- [CASE и условные выражения](/02-sql/12-case-and-conditionals/) — `COALESCE` для замены `NULL` на значение по умолчанию.

**Практика:** [SQLBolt](https://sqlbolt.com/) и [LeetCode SQL](https://leetcode.com/problemset/database/) — много задач на фильтрацию и `NULL`.
