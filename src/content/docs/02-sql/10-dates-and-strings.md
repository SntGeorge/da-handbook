---
title: Даты и строки
description: "Работа с датами (EXTRACT, DATE_TRUNC, INTERVAL) и строками (SUBSTRING, REPLACE, конкатенация, кастинг типов)."
sidebar:
  order: 10
---

:::tip[Коротко]
Даты и строки — рутина аналитика: «выручка по месяцам», «события за последние 7 дней», «достать домен из email».

- `DATE_TRUNC('month', ts)` — округлить дату до начала месяца (группировка по периодам).
- `EXTRACT(YEAR FROM ts)` — вытащить часть даты.
- `ts - INTERVAL '7 days'` — арифметика с датами.
- `||` или `CONCAT` — склеить строки; `SUBSTRING`, `REPLACE`, `LOWER` — обработка текста.
- `value::type` — привести тип (`'2026-01-01'::date`).
:::

## Зачем это нужно

Сырые данные почти всегда «грязные»: даты в разных форматах, телефоны с пробелами, email в разном регистре. Плюс любой отчёт во времени — это группировка по дням/месяцам. Без дат и строк не построить ни одной метрики.

```sql title="Демо-данные"
CREATE TABLE events (
    user_id int,
    email   text,
    ts      timestamp
);

INSERT INTO events VALUES
    (1, 'Anna@Mail.RU',    '2026-01-05 10:30'),
    (1, 'Anna@Mail.RU',    '2026-01-20 14:00'),
    (2, 'boris@gmail.com', '2026-02-03 09:15');
```

## Типы даты/времени

| Тип | Что хранит |
|-----|------------|
| `date` | только дату (2026-01-05) |
| `timestamp` | дату и время без зоны |
| `timestamptz` | дату, время и часовой пояс (рекомендуется для событий) |

`CURRENT_DATE`, `NOW()` — текущие дата и момент времени.

## DATE_TRUNC и EXTRACT

`DATE_TRUNC` «обрезает» дату до начала периода — основа группировки по месяцам/неделям:

```sql
SELECT DATE_TRUNC('month', ts)::date AS month, COUNT(*) AS events
FROM events
GROUP BY 1
ORDER BY 1;
```

| month      | events |
|------------|--------|
| 2026-01-01 | 2      |
| 2026-02-01 | 1      |

`EXTRACT` достаёт отдельную часть (год, месяц, день недели):

```sql
SELECT EXTRACT(YEAR FROM ts) AS y, EXTRACT(MONTH FROM ts) AS m
FROM events;
```

## INTERVAL: арифметика с датами

```sql
-- события за последние 30 дней
SELECT * FROM events
WHERE ts >= NOW() - INTERVAL '30 days';

-- сколько дней между событиями
SELECT user_id, MAX(ts)::date - MIN(ts)::date AS days_span
FROM events GROUP BY user_id;
```

| user_id | days_span |
|---------|-----------|
| 1       | 15        |
| 2       | 0         |

:::caution[Границы дат и BETWEEN]
Для периода надёжнее полуинтервал `>= начало AND < конец_след_периода`, а не `BETWEEN`. `BETWEEN '2026-01-01' AND '2026-01-31'` пропустит события 31-го после полуночи (`timestamp` за этот день > `'2026-01-31 00:00'`). Пиши `>= '2026-01-01' AND < '2026-02-01'`.
:::

## Строковые функции

| Функция | Что делает | Пример → результат |
|---------|-----------|--------------------|
| `LOWER` / `UPPER` | регистр | `LOWER('Mail') → mail` |
| `LENGTH` | длина | `LENGTH('Anna') → 4` |
| `TRIM` | убрать пробелы по краям | `TRIM(' x ') → x` |
| `SUBSTRING` | вырезать кусок | `SUBSTRING('abcde', 2, 3) → bcd` |
| `POSITION` | найти позицию | `POSITION('@' IN email)` |
| `REPLACE` | заменить | `REPLACE('a-b','-','_') → a_b` |
| `\|\|` / `CONCAT` | склеить | `'a' \|\| 'b' → ab` |

Практический пример — достать домен из email и привести к нижнему регистру:

```sql
SELECT DISTINCT
    LOWER(SUBSTRING(email FROM POSITION('@' IN email) + 1)) AS domain
FROM events;
```

| domain    |
|-----------|
| mail.ru   |
| gmail.com |

## Кастинг типов

Привести значение к нужному типу — оператором `::` (PostgreSQL) или `CAST(... AS ...)`:

```sql
SELECT '2026-01-01'::date,        -- строка → дата
       '42'::int,                 -- строка → число
       amount::text               -- число → строка
FROM orders LIMIT 1;
```

:::note[Регулярные выражения]
В PostgreSQL есть `~` (совпадение по regex) и `REGEXP_REPLACE`. Удобно для сложной чистки: `REGEXP_REPLACE(phone, '\D', '', 'g')` уберёт из телефона всё, кроме цифр.
:::

## Задачи для самопроверки

<details>
<summary>1. Количество событий по неделям.</summary>

```sql
SELECT DATE_TRUNC('week', ts)::date AS week, COUNT(*) AS events
FROM events
GROUP BY 1
ORDER BY 1;
```

`DATE_TRUNC('week', ...)` округляет к понедельнику недели.

</details>

<details>
<summary>2. Нормализуй email: нижний регистр без пробелов.</summary>

```sql
SELECT DISTINCT LOWER(TRIM(email)) AS email_norm FROM events;
```

`Anna@Mail.RU` → `anna@mail.ru`. Полезно перед поиском дублей пользователей.

</details>

<details>
<summary>3. Почему `WHERE ts BETWEEN '2026-01-01' AND '2026-01-31'` теряет данные?</summary>

`'2026-01-31'` без времени трактуется как `2026-01-31 00:00:00`, поэтому события 31-го числа после полуночи в диапазон не попадают. Используй `ts >= '2026-01-01' AND ts < '2026-02-01'`.

</details>

## Что дальше

- [CASE и условные выражения](/02-sql/12-case-and-conditionals/) — `COALESCE` для подстановки значений вместо `NULL`.
- [Оконные функции](/02-sql/09-window-functions/) — month-over-month и тренды по времени.

**Практика:** [PostgreSQL docs: Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html) — справочник; задачи на даты есть на [LeetCode SQL](https://leetcode.com/problemset/database/).
