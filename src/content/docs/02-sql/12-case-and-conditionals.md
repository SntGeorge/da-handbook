---
title: CASE и условные выражения
description: "CASE WHEN, COALESCE, NULLIF, GREATEST/LEAST — условная логика в SQL и pivot через CASE."
sidebar:
  order: 12
---

:::tip[Коротко]
`CASE` — это `if/else` внутри SQL: вернуть разное значение в зависимости от условия.

```sql
CASE WHEN amount >= 3000 THEN 'big'
     WHEN amount >= 1000 THEN 'medium'
     ELSE 'small' END
```

Плюс короткие помощники: `COALESCE` (первое не-`NULL`), `NULLIF` (превратить значение в `NULL`), `GREATEST`/`LEAST` (макс/мин из аргументов).
:::

## Зачем это нужно

`CASE` строит категории и метки: сегменты по сумме, флаги, бакеты. А `COALESCE` — лечит `NULL` (подставляет 0 или «не указано»). И то, и другое встречается почти в каждом аналитическом запросе.

```sql title="Демо-данные"
INSERT INTO orders VALUES
    (101,1,'paid',2500),(102,1,'paid',1800),
    (103,2,'cancelled',990),(104,3,'paid',4200),(105,3,'paid',700);
```

## CASE: поисковый и простой

**Поисковый** `CASE` (с условиями) — самый частый:

```sql
SELECT order_id, amount,
       CASE WHEN amount >= 3000 THEN 'крупный'
            WHEN amount >= 1000 THEN 'средний'
            ELSE 'мелкий' END AS bucket
FROM orders;
```

| order_id | amount | bucket  |
|----------|--------|---------|
| 101      | 2500   | средний |
| 102      | 1800   | средний |
| 103      | 990    | мелкий  |
| 104      | 4200   | крупный |
| 105      | 700    | мелкий  |

**Простой** `CASE` (сравнение одного значения) — короче, когда проверяешь равенство:

```sql
CASE status WHEN 'paid' THEN 'оплачен'
            WHEN 'cancelled' THEN 'отменён'
            ELSE status END
```

:::note[Условия проверяются по порядку]
`CASE` берёт **первое** подошедшее `WHEN`. Поэтому порядок важен: сначала более узкие/высокие условия. Если ни одно не сработало и нет `ELSE` — вернётся `NULL`.
:::

## CASE в SELECT, WHERE, ORDER BY

`CASE` — выражение, его можно ставить куда угодно. Например, кастомная сортировка (оплаченные сверху):

```sql
SELECT order_id, status
FROM orders
ORDER BY CASE status WHEN 'paid' THEN 0 ELSE 1 END, order_id;
```

## Pivot через CASE

Классический приём — «развернуть» строки в столбцы: посчитать суммы по статусам в одну строку. `SUM(CASE WHEN ... THEN amount END)`:

```sql
SELECT
    SUM(CASE WHEN status = 'paid'      THEN amount ELSE 0 END) AS paid,
    SUM(CASE WHEN status = 'cancelled' THEN amount ELSE 0 END) AS cancelled
FROM orders;
```

| paid  | cancelled |
|-------|-----------|
| 9200  | 990       |

Это основа сводных отчётов: статусы/категории становятся столбцами.

## COALESCE: первое не-NULL

`COALESCE(a, b, c)` возвращает первое значение, которое не `NULL`. Используется для значений по умолчанию:

```sql
-- если телефон не указан — показать заглушку
SELECT name, COALESCE(phone, 'не указан') AS phone FROM customers;
```

Частый случай — `COALESCE(SUM(amount), 0)`, чтобы вместо `NULL` (когда строк нет) получить 0.

## NULLIF, GREATEST, LEAST

- `NULLIF(a, b)` — вернёт `NULL`, если `a = b` (иначе `a`). Главное применение — **защита от деления на ноль**:

```sql
SELECT revenue / NULLIF(orders_count, 0) AS avg_check FROM ...;
-- если orders_count = 0, делитель станет NULL, и вместо ошибки будет NULL
```

- `GREATEST(a, b, ...)` / `LEAST(a, b, ...)` — макс/мин **из аргументов в строке** (не по столбцу, как `MAX`/`MIN`):

```sql
SELECT GREATEST(price, min_price) AS final_price FROM ...;
```

:::caution[NULL съедает CASE и арифметику]
Любая арифметика с `NULL` даёт `NULL` (`100 + NULL = NULL`). Если в данных бывают пропуски — оборачивай в `COALESCE(col, 0)` до вычислений, иначе метрика «провалится» в `NULL`.
:::

## Задачи для самопроверки

<details>
<summary>1. Помести каждый заказ в бакет по сумме и посчитай количество в каждом.</summary>

```sql
SELECT CASE WHEN amount >= 3000 THEN 'крупный'
            WHEN amount >= 1000 THEN 'средний'
            ELSE 'мелкий' END AS bucket,
       COUNT(*) AS cnt
FROM orders
GROUP BY 1;
```

Можно группировать прямо по выражению `CASE` (или по его номеру в `SELECT` — `GROUP BY 1`).

</details>

<details>
<summary>2. Конверсия: доля оплаченных заказов (без деления на ноль).</summary>

```sql
SELECT ROUND(
    SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) * 100.0
    / NULLIF(COUNT(*), 0)
) AS paid_pct
FROM orders;
```

`SUM(CASE ...)` считает оплаченные, `NULLIF(COUNT(*), 0)` страхует от деления на ноль.

</details>

<details>
<summary>3. Чем GREATEST отличается от MAX?</summary>

`MAX(col)` — агрегат: максимум **по строкам** одного столбца (сворачивает строки). `GREATEST(a, b, c)` — максимум **из нескольких значений в одной строке** (по столбцам), строки не сворачивает.

</details>

## Что дальше

- [Типичные паттерны](/02-sql/16-common-patterns/) — pivot через `CASE` и сегментация лежат в основе RFM и когорт.
- [Операторы фильтрации](/02-sql/04-filtering-operators/) — больше про поведение `NULL`.

**Практика:** [LeetCode SQL](https://leetcode.com/problemset/database/) — задачи с тегами *Conditional* и pivot; [StrataScratch](https://www.stratascratch.com/).
