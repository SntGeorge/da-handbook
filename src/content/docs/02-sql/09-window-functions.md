---
title: Оконные функции
description: "ROW_NUMBER, RANK, LAG/LEAD, агрегаты OVER, PARTITION BY, рамки окна, running total и топ-N в группе."
sidebar:
  order: 9
---

:::tip[Коротко]
Оконная функция считает значение **по группе строк, но не схлопывает их** (в отличие от `GROUP BY`). Каждая строка остаётся, а рядом появляется агрегат/ранг.

```sql
SELECT order_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS customer_total
FROM orders;
```

`PARTITION BY` — на какие группы бить, `ORDER BY` внутри `OVER` — порядок (для рангов и нарастающих итогов). Это самая частая тема на собесах мидла.
:::

## Зачем это нужно

`GROUP BY` отвечает «сколько всего у клиента», но теряет отдельные заказы. Оконные функции дают **и то, и другое**: видишь каждый заказ И его долю/ранг/сумму по клиенту. Отсюда — running total, «топ-N в каждой категории», «разница с предыдущим месяцем».

```sql title="Демо-данные"
INSERT INTO orders VALUES
    (101,1,'RU','paid',2500),(102,1,'RU','paid',1800),
    (104,3,'KZ','paid',4200),(105,3,'KZ','paid',700),(106,4,'DE','paid',3000);
```

## Анатомия: OVER (...)

```sql
функция() OVER (PARTITION BY ... ORDER BY ...)
```

- `PARTITION BY` — делит строки на группы (как `GROUP BY`, но без схлопывания). Нет `PARTITION BY` → одно окно на всю таблицу.
- `ORDER BY` внутри `OVER` — задаёт порядок внутри окна (нужен рангам, `LAG`, нарастающим итогам).

```sql
SELECT order_id, customer_id, amount,
       SUM(amount) OVER (PARTITION BY customer_id) AS by_customer
FROM orders;
```

| order_id | customer_id | amount | by_customer |
|----------|-------------|--------|-------------|
| 101      | 1           | 2500   | 4300        |
| 102      | 1           | 1800   | 4300        |
| 104      | 3           | 4200   | 4900        |
| 105      | 3           | 700    | 4900        |
| 106      | 4           | 3000   | 3000        |

Сумма по клиенту проставлена в **каждую** строку — строки не схлопнулись.

## Ранги: ROW_NUMBER, RANK, DENSE_RANK

Три функции нумерации, разница — в обработке одинаковых значений:

```sql
SELECT order_id, amount,
       ROW_NUMBER() OVER (ORDER BY amount DESC) AS rn,
       RANK()       OVER (ORDER BY amount DESC) AS rnk,
       DENSE_RANK() OVER (ORDER BY amount DESC) AS dense
FROM orders;
```

| amount | rn | rnk | dense |
|--------|----|----|-------|
| 4200   | 1  | 1  | 1     |
| 3000   | 2  | 2  | 2     |
| 2500   | 3  | 3  | 3     |
| 1800   | 4  | 4  | 4     |
| 700    | 5  | 5  | 5     |

- `ROW_NUMBER` — всегда уникальный номер 1,2,3… (даже при равных значениях).
- `RANK` — при равных даёт одинаковый ранг, потом «прыгает»: 1,2,2,**4**.
- `DENSE_RANK` — при равных одинаковый, без пропусков: 1,2,2,**3**.

## LAG и LEAD: соседние строки

`LAG` — значение из **предыдущей** строки окна, `LEAD` — из **следующей**. Незаменимо для «разница с прошлым периодом», «следующее событие пользователя».

```sql
SELECT order_id, amount,
       LAG(amount) OVER (ORDER BY order_id)  AS prev_amount,
       amount - LAG(amount) OVER (ORDER BY order_id) AS diff
FROM orders;
```

| order_id | amount | prev_amount | diff  |
|----------|--------|-------------|-------|
| 101      | 2500   | NULL        | NULL  |
| 102      | 1800   | 2500        | -700  |
| 104      | 4200   | 1800        | 2400  |
| 105      | 700    | 4200        | -3500 |
| 106      | 3000   | 700         | 2300  |

### Другие полезные функции

- `FIRST_VALUE(x)` / `LAST_VALUE(x)` — первое/последнее значение в окне (например, первый заказ клиента в каждой его строке).
- `NTH_VALUE(x, n)` — n-е значение.
- `NTILE(k)` — разбить строки окна на `k` равных групп (используется для перцентилей и [RFM-сегментации](/02-sql/16-common-patterns/)).

:::caution[LAST_VALUE и рамка]
`LAST_VALUE` с `ORDER BY` по умолчанию смотрит на рамку «до текущей строки», поэтому часто возвращает не то, что ждёшь (текущую строку, а не конец окна). Чтобы получить настоящее последнее значение, задай рамку явно: `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`.
:::

## Агрегаты как оконные + рамка

`SUM/AVG/COUNT ... OVER (ORDER BY ...)` с порядком превращаются в **нарастающий итог** (running total). По умолчанию рамка — «от начала окна до текущей строки».

```sql
SELECT order_id, amount,
       SUM(amount) OVER (ORDER BY order_id) AS running_total
FROM orders;
```

| order_id | amount | running_total |
|----------|--------|---------------|
| 101      | 2500   | 2500          |
| 102      | 1800   | 4300          |
| 104      | 4200   | 8500          |
| 105      | 700    | 9200          |
| 106      | 3000   | 12200         |

Рамкой `ROWS BETWEEN` управляют скользящим окном — например, среднее по 3 последним строкам (moving average):

```sql
AVG(amount) OVER (ORDER BY order_id ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)
```

:::caution[ORDER BY в OVER меняет смысл]
Без `ORDER BY` внутри `OVER` агрегат считается по **всему** окну (одно число на партицию). С `ORDER BY` включается рамка «до текущей строки» → получается нарастающий итог. Это частый сюрприз: добавил `ORDER BY` для красоты — а `SUM` стал running total.
:::

## Топ-N в каждой группе

Классическая задача с собеса: «самый дорогой заказ в каждой стране». Решается `ROW_NUMBER` с `PARTITION BY` внутри CTE:

```sql
WITH ranked AS (
    SELECT order_id, country, amount,
           ROW_NUMBER() OVER (PARTITION BY country ORDER BY amount DESC) AS rn
    FROM orders
)
SELECT order_id, country, amount
FROM ranked
WHERE rn = 1;
```

| order_id | country | amount |
|----------|---------|--------|
| 101      | RU      | 2500   |
| 104      | KZ      | 4200   |
| 106      | DE      | 3000   |

:::note[Где нельзя оконку]
Оконные функции нельзя использовать в `WHERE` (они считаются после фильтрации). Поэтому фильтр по рангу выносят в CTE/подзапрос и фильтруют снаружи — как в примере выше с `WHERE rn = 1`.
:::

<details>
<summary>1. Доля каждого заказа в выручке его клиента (в процентах).</summary>

```sql
SELECT order_id, customer_id, amount,
       ROUND(amount * 100.0 / SUM(amount) OVER (PARTITION BY customer_id)) AS pct
FROM orders;
```

Окно `SUM(amount) OVER (PARTITION BY customer_id)` даёт сумму клиента в каждой строке, делим на неё.

</details>

<details>
<summary>2. Второй по величине заказ в каждой стране.</summary>

```sql
WITH ranked AS (
    SELECT order_id, country, amount,
           DENSE_RANK() OVER (PARTITION BY country ORDER BY amount DESC) AS rnk
    FROM orders
)
SELECT * FROM ranked WHERE rnk = 2;
```

</details>

<details>
<summary>3. Чем ROW_NUMBER отличается от RANK при одинаковых значениях?</summary>

`ROW_NUMBER` всегда даёт уникальные 1,2,3,4 (равные значения получают разные номера произвольно). `RANK` даёт равным один ранг и пропускает следующие (1,2,2,4), `DENSE_RANK` — без пропуска (1,2,2,3). Для «строго топ-1 без дублей» бери `ROW_NUMBER`.

</details>

## Что дальше

- [Типичные паттерны](/02-sql/16-common-patterns/) — retention, когорты, RFM строятся на окнах.
- [Даты и строки](/02-sql/10-dates-and-strings/) — окна по времени (month-over-month) нужны вместе с датами.

**Практика:** [StrataScratch](https://www.stratascratch.com/) и [LeetCode SQL](https://leetcode.com/problemset/database/) (hard) — оконные функции там в каждой второй задаче.
