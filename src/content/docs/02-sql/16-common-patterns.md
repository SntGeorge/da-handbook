---
title: Типичные паттерны
description: "Топ-паттернов аналитика на SQL: RFM, когорты, retention, running total, gaps-and-islands — где всё собирается вместе."
sidebar:
  order: 16
---

:::tip[Коротко]
Здесь — готовые «рецепты», которые аналитик пишет постоянно. Все строятся на уже разобранном: [CTE](/02-sql/08-cte/) + [оконные функции](/02-sql/09-window-functions/) + [даты](/02-sql/10-dates-and-strings/).

- **RFM** — сегментация клиентов по давности/частоте/деньгам.
- **Когорты + retention** — сколько пользователей возвращается со временем.
- **Running total / moving average** — нарастающие итоги и сглаживание.
- **Gaps-and-islands** — группировка подряд идущих событий (сессии, серии).
:::

:::note[Поток данных]
Вход: сырые таблицы (заказы, события)
→ Обработка: связки оконных функций, CTE и агрегатов собирают метрику (retention, когорты, RFM)
→ Выход: готовая аналитическая витрина/отчёт.
Зачем: типовые продуктовые расчёты одним запросом — то, что часто спрашивают на собесах.
:::

## Зачем это нужно

Это не новый синтаксис, а **сборка** изученного в типовые задачи бизнеса. Именно эти паттерны спрашивают на собесах и пишут на работе каждую неделю.

```sql title="Демо-данные (заказы с датами)"
CREATE TABLE orders (
    order_id    int,
    customer_id int,
    created_at  date,
    amount      numeric
);

INSERT INTO orders VALUES
    (101,1,'2026-01-05',2500),(102,1,'2026-02-10',1800),
    (103,2,'2026-01-20',990), (104,3,'2026-01-25',4200),
    (105,3,'2026-03-01',700), (106,1,'2026-03-15',1200);
```

## Running total и moving average

Нарастающий итог выручки по времени и сглаживание скачков средним по окну:

```sql
SELECT created_at, amount,
       SUM(amount) OVER (ORDER BY created_at) AS running_total,
       ROUND(AVG(amount) OVER (ORDER BY created_at
             ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)) AS moving_avg_3
FROM orders;
```

| created_at | amount | running_total | moving_avg_3 |
|------------|--------|---------------|--------------|
| 2026-01-05 | 2500   | 2500          | 2500         |
| 2026-01-20 | 990    | 3490          | 1745         |
| 2026-01-25 | 4200   | 7690          | 2563         |
| 2026-02-10 | 1800   | 9490          | 2330         |
| …          | …      | …             | …            |

## Топ-N в каждой группе

«Самый дорогой заказ каждого клиента» — `ROW_NUMBER` + `PARTITION BY` в CTE:

```sql
WITH ranked AS (
    SELECT customer_id, order_id, amount,
           ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY amount DESC) AS rn
    FROM orders
)
SELECT customer_id, order_id, amount FROM ranked WHERE rn = 1;
```

## RFM-сегментация

RFM делит клиентов по трём осям: **R**ecency (как давно покупал), **F**requency (как часто), **M**onetary (сколько денег). Считаем метрики и бьём на сегменты квантилями (`NTILE`):

```sql
WITH rfm AS (
    SELECT customer_id,
           CURRENT_DATE - MAX(created_at) AS recency_days,
           COUNT(*)                       AS frequency,
           SUM(amount)                    AS monetary
    FROM orders
    GROUP BY customer_id
)
SELECT customer_id, recency_days, frequency, monetary,
       NTILE(3) OVER (ORDER BY recency_days)      AS r,   -- меньше дней — лучше
       NTILE(3) OVER (ORDER BY frequency DESC)    AS f,
       NTILE(3) OVER (ORDER BY monetary  DESC)    AS m
FROM rfm;
```

| customer_id | frequency | monetary | r | f | m |
|-------------|-----------|----------|---|---|---|
| 1           | 3         | 5500     | 1 | 1 | 1 |
| 3           | 2         | 4900     | 2 | 2 | 2 |
| 2           | 1         | 990      | 3 | 3 | 3 |

Сегмент `111` — лучшие клиенты (недавно, часто, много), `333` — спящие. На практике сегменты группируют в «Champions», «At risk», «Lost».

## Когортный анализ и retention

Когорта — группа пользователей по месяцу **первой** покупки. Retention — сколько из них вернулось в следующие месяцы.

```sql
WITH first_month AS (   -- месяц первой покупки = когорта
    SELECT customer_id,
           DATE_TRUNC('month', MIN(created_at))::date AS cohort
    FROM orders GROUP BY customer_id
),
activity AS (           -- в каких месяцах клиент был активен
    SELECT DISTINCT customer_id,
           DATE_TRUNC('month', created_at)::date AS month
    FROM orders
)
SELECT f.cohort,
       a.month,
       COUNT(DISTINCT a.customer_id) AS active
FROM first_month f
JOIN activity a ON a.customer_id = f.customer_id
GROUP BY f.cohort, a.month
ORDER BY f.cohort, a.month;
```

| cohort     | month      | active |
|------------|------------|--------|
| 2026-01-01 | 2026-01-01 | 3      |
| 2026-01-01 | 2026-02-01 | 1      |
| 2026-01-01 | 2026-03-01 | 2      |

Это «длинный» формат когортной таблицы; в дашборде его разворачивают в матрицу «когорта × месяц жизни» через `CASE`/pivot. Подробнее про метрику — в [Продуктовой аналитике](/08-product-analytics/04-cohort-analysis/).

## Gaps-and-islands (сессии, серии)

Классический приём: сгруппировать **подряд идущие** события (сессии пользователя, серии дней покупок). Трюк — «номер строки минус значение» даёт постоянную метку для последовательной группы.

```sql
-- сгруппировать покупки клиента в "серии" подряд идущих месяцев
WITH m AS (
    SELECT DISTINCT customer_id,
           EXTRACT(MONTH FROM created_at)::int AS mon
    FROM orders
),
grp AS (
    SELECT customer_id, mon,
           mon - ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY mon) AS island
    FROM m
)
SELECT customer_id, MIN(mon) AS streak_start, MAX(mon) AS streak_end, COUNT(*) AS len
FROM grp
GROUP BY customer_id, island;
```

Если месяцы идут подряд (1,2,3), разность `mon - row_number` одинаковая → они попадают в один «остров». Разрыв создаёт новый остров.

:::note[Главный вывод]
Почти любая «продвинутая» аналитическая задача = CTE (разбить на шаги) + оконные функции (ранги/итоги/соседи) + даты (`DATE_TRUNC`). Освоил эти три — закрыл большинство реальных задач.
:::

<details>
<summary>1. Month-over-month рост выручки (в % к предыдущему месяцу).</summary>

```sql
WITH monthly AS (
    SELECT DATE_TRUNC('month', created_at)::date AS m, SUM(amount) AS rev
    FROM orders GROUP BY 1
)
SELECT m, rev,
       ROUND((rev - LAG(rev) OVER (ORDER BY m)) * 100.0
             / LAG(rev) OVER (ORDER BY m)) AS mom_pct
FROM monthly;
```

`LAG` берёт выручку прошлого месяца, считаем процент изменения.

</details>

<details>
<summary>2. Доля каждого клиента в общей выручке.</summary>

```sql
SELECT customer_id, SUM(amount) AS rev,
       ROUND(SUM(amount) * 100.0 / SUM(SUM(amount)) OVER ()) AS pct
FROM orders GROUP BY customer_id;
```

Окно `SUM(SUM(amount)) OVER ()` — суммирует уже сгруппированные суммы по всей выборке.

</details>

## Что дальше

- [Задачи с собеседований](/02-sql/17-interview-tasks/) — закрепить эти паттерны на реальных задачах.
- [Продуктовая аналитика](/08-product-analytics/) — RFM, когорты и retention с продуктовой стороны.

**Практика:** [StrataScratch](https://www.stratascratch.com/) — задачи из собесов FAANG; [LeetCode SQL](https://leetcode.com/problemset/database/) (hard).
