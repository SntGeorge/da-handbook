---
title: Агрегации
description: "GROUP BY, HAVING, COUNT/SUM/AVG/MIN/MAX, поведение NULL и разница WHERE и HAVING."
sidebar:
  order: 5
---

:::tip[Коротко]
Агрегатные функции сворачивают много строк в одно число: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

- `GROUP BY` — считать агрегат **отдельно для каждой группы** (например, по клиенту).
- `WHERE` фильтрует строки **до** группировки, `HAVING` — группы **после**.
- В `SELECT` без `GROUP BY` можно выводить только агрегаты; с `GROUP BY` — только столбцы из `GROUP BY` плюс агрегаты.
:::

## Зачем это нужно

Аналитика — это почти всегда агрегаты: «сколько заказов», «средний чек», «выручка по странам». `GROUP BY` превращает таблицу строк в таблицу метрик.

```sql title="Демо-данные"
CREATE TABLE orders (
    order_id    int PRIMARY KEY,
    customer_id int,
    country     text,
    status      text,
    amount      numeric
);

INSERT INTO orders VALUES
    (101, 1, 'RU', 'paid',      2500),
    (102, 1, 'RU', 'paid',      1800),
    (103, 2, 'RU', 'cancelled',  990),
    (104, 3, 'KZ', 'paid',      4200),
    (105, 3, 'KZ', 'paid',       700),
    (106, 4, 'DE', 'paid',      3000);
```

## Агрегатные функции

| Функция | Что считает |
|---------|-------------|
| `COUNT(*)` | количество строк |
| `COUNT(col)` | количество **не-NULL** значений в столбце |
| `COUNT(DISTINCT col)` | количество уникальных значений |
| `SUM(col)` | сумма |
| `AVG(col)` | среднее |
| `MIN` / `MAX` | минимум / максимум |

Без `GROUP BY` агрегат считается по всей таблице и возвращает одну строку:

```sql
SELECT COUNT(*) AS orders, SUM(amount) AS revenue, ROUND(AVG(amount)) AS avg_check
FROM orders
WHERE status = 'paid';
```

| orders | revenue | avg_check |
|--------|---------|-----------|
| 5      | 12200   | 2440      |

## GROUP BY: агрегат по группам

`GROUP BY country` считает агрегат отдельно для каждой страны:

```sql
SELECT country, COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY country
ORDER BY revenue DESC;
```

| country | orders | revenue |
|---------|--------|---------|
| KZ      | 2      | 4900    |
| RU      | 2      | 4300    |
| DE      | 1      | 3000    |

:::caution[Правило GROUP BY]
В `SELECT` при группировке можно выводить **только** столбцы из `GROUP BY` и агрегаты. Нельзя `SELECT country, amount ... GROUP BY country` — `amount` в группе много, СУБД не знает, какой показать (PostgreSQL выдаст ошибку, MySQL молча вернёт случайный — что хуже).
:::

## COUNT(*) vs COUNT(col): осторожно с NULL

`COUNT(*)` считает все строки. `COUNT(col)` пропускает `NULL`. Это разные числа, и на этом часто ошибаются:

```sql
SELECT
    COUNT(*)              AS all_orders,     -- все заказы
    COUNT(DISTINCT customer_id) AS customers -- уникальные клиенты
FROM orders;
```

| all_orders | customers |
|------------|-----------|
| 6          | 4         |

## WHERE vs HAVING

`WHERE` фильтрует **строки до** группировки. `HAVING` фильтрует **группы после** — там можно использовать агрегаты.

```sql
-- страны, где больше одного оплаченного заказа
SELECT country, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'      -- сначала отсекаем неоплаченные строки
GROUP BY country
HAVING COUNT(*) > 1;       -- потом оставляем только группы с >1 заказом
```

| country | orders |
|---------|--------|
| KZ      | 2      |
| RU      | 2      |

```mermaid
flowchart LR
    A["FROM"] --> B["WHERE<br/>(строки)"] --> C["GROUP BY"] --> D["HAVING<br/>(группы)"] --> E["SELECT"] --> F["ORDER BY"]
```

:::note[Когда что]
Условие на «сырой» столбец (`status = 'paid'`) → в `WHERE` (быстрее, отсекает раньше). Условие на агрегат (`COUNT(*) > 1`, `SUM(amount) > 10000`) → в `HAVING`.
:::

## Продвинутые агрегаты

Три приёма, которые часто экономят время в отчётах.

**`FILTER (WHERE ...)`** — посчитать агрегат только по части строк, не плодя `CASE` (PostgreSQL):

```sql
SELECT
    COUNT(*) FILTER (WHERE status = 'paid')      AS paid,
    COUNT(*) FILTER (WHERE status = 'cancelled') AS cancelled,
    SUM(amount) FILTER (WHERE status = 'paid')   AS paid_revenue
FROM orders;
```

| paid | cancelled | paid_revenue |
|------|-----------|--------------|
| 5    | 1         | 12200        |

**`STRING_AGG`** (в MySQL — `GROUP_CONCAT`) — склеить значения группы в одну строку:

```sql
SELECT country, STRING_AGG(order_id::text, ', ' ORDER BY order_id) AS order_ids
FROM orders
GROUP BY country;
```

| country | order_ids       |
|---------|-----------------|
| RU      | 101, 102, 103   |
| KZ      | 104, 105        |
| DE      | 106             |

**`ROLLUP`** — добавить к группировке строку-итог (subtotal/grand total). Строка итога имеет `NULL` в сгруппированном столбце:

```sql
SELECT country, SUM(amount) AS revenue
FROM orders
GROUP BY ROLLUP(country);
```

| country | revenue |
|---------|---------|
| RU      | 5290    |
| KZ      | 4900    |
| DE      | 3000    |
| NULL    | 13190   |

:::note[Семейство GROUPING SETS]
`ROLLUP(a, b)` даёт иерархические подытоги (по `a,b`, по `a`, общий). `CUBE(a, b)` — итоги по **всем** комбинациям. `GROUPING SETS (...)` — задать нужные срезы вручную. Удобно для сводных отчётов «по странам, по статусам и в целом» одним запросом.
:::

<details>
<summary>1. Выручка и число заказов по каждому клиенту (только оплаченные).</summary>

```sql
SELECT customer_id, COUNT(*) AS orders, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
ORDER BY revenue DESC;
```

</details>

<details>
<summary>2. Клиенты, потратившие суммарно больше 3000.</summary>

```sql
SELECT customer_id, SUM(amount) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(amount) > 3000;
```

Клиент 3 (4900). У клиента 1 — 4300, тоже проходит. Условие на агрегат → `HAVING`.

</details>

<details>
<summary>3. В чём разница между `COUNT(*)` и `COUNT(customer_id)`?</summary>

`COUNT(*)` считает все строки. `COUNT(customer_id)` — только те, где `customer_id` не `NULL`. Если в данных нет `NULL` в этом столбце, числа совпадут; если есть — `COUNT(customer_id)` будет меньше.

</details>

## Что дальше

- [JOIN-ы](/02-sql/06-joins/) — агрегаты по данным из нескольких таблиц (и как не задвоить суммы).
- [Оконные функции](/02-sql/09-window-functions/) — агрегаты без схлопывания строк (например, доля каждого заказа в общей выручке).

**Практика:** [LeetCode SQL](https://leetcode.com/problemset/database/) — фильтруй по тегу *Aggregation*; на [sql-ex.ru](https://sql-ex.ru/) задачи на `GROUP BY` начинаются примерно с 15-й.
