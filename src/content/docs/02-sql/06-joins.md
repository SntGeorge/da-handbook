---
title: JOINs
description: "INNER, LEFT, RIGHT, FULL, CROSS и SELF JOIN — с диаграммами, примерами на e-commerce и разбором дублей после соединения."
sidebar:
  order: 6
---

:::tip[TL;DR]
`JOIN` соединяет строки из двух таблиц по условию (обычно по ключу).

- **INNER** — только совпадения в обеих таблицах.
- **LEFT** — все строки слева + совпадения справа (нет пары → `NULL`).
- **RIGHT** — зеркало LEFT.
- **FULL** — всё из обеих, несовпавшее добивается `NULL`.
- **CROSS** — каждая строка с каждой (декартово произведение).

90% запросов аналитика — это `INNER` и `LEFT JOIN`. Главная ловушка — **дубли строк** после соединения «один-ко-многим».
:::

## Зачем это нужно

Данные в нормальной БД разложены по таблицам: клиенты отдельно, заказы отдельно. Чтобы ответить на вопрос «сколько потратил каждый клиент» — данные нужно **соединить**. Этим и занимается `JOIN`.

### Наша демо-схема

Дальше во всех примерах раздела используем простую схему интернет-магазина. Заведи её у себя (PostgreSQL) и повторяй запросы руками — так усваивается в разы лучше.

```mermaid
erDiagram
    customers ||--o{ orders : "делает"
    orders ||--o{ order_items : "содержит"
    products ||--o{ order_items : "входит в"

    customers {
        int customer_id PK
        text name
        text country
    }
    orders {
        int order_id PK
        int customer_id FK
        text status
        numeric amount
    }
    products {
        int product_id PK
        text title
        text category
    }
    order_items {
        int order_id FK
        int product_id FK
        int qty
    }
```

```sql title="Демо-данные"
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

INSERT INTO customers VALUES
    (1, 'Аня',   'RU'),
    (2, 'Борис', 'RU'),
    (3, 'Кира',  'KZ'),
    (4, 'Лев',   'DE');   -- Лев ещё ничего не заказывал

INSERT INTO orders VALUES
    (101, 1, 'paid',      2500),
    (102, 1, 'paid',      1800),
    (103, 2, 'cancelled',  990),
    (104, 3, 'paid',      4200),
    (105, 9, 'paid',       700);  -- customer_id = 9, такого клиента нет
```

Обрати внимание на две «нестыковки», которые и показывают разницу между джойнами:

- **Лев (id 4)** есть в `customers`, но у него нет заказов.
- **Заказ 105** ссылается на `customer_id = 9`, которого нет в `customers` (так бывает в реальных «грязных» данных).

## INNER JOIN

Возвращает только те строки, где нашлось совпадение **в обеих** таблицах. Нет пары — строка выпадает из результата.

```sql
SELECT c.name, o.order_id, o.amount
FROM customers AS c
INNER JOIN orders AS o ON o.customer_id = c.customer_id;
```

| name  | order_id | amount |
|-------|----------|--------|
| Аня   | 101      | 2500   |
| Аня   | 102      | 1800   |
| Борис | 103      | 990    |
| Кира  | 104      | 4200   |

Лев пропал (нет заказов), заказ 105 пропал (нет такого клиента). `INNER` — это пересечение.

:::note[JOIN = INNER JOIN]
Если написать просто `JOIN`, СУБД понимает это как `INNER JOIN`. Слово `INNER` необязательно, но в учебных запросах пиши явно — читается понятнее.
:::

## LEFT JOIN

Берёт **все строки левой таблицы**, а справа подставляет совпадения. Если пары нет — в правых столбцах будет `NULL`.

```sql
SELECT c.name, o.order_id, o.amount
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id;
```

| name  | order_id | amount |
|-------|----------|--------|
| Аня   | 101      | 2500   |
| Аня   | 102      | 1800   |
| Борис | 103      | 990    |
| Кира  | 104      | 4200   |
| Лев   | NULL     | NULL   |

Теперь Лев на месте — с `NULL` вместо заказа. Это самый частый джойн в аналитике: «покажи **всех** клиентов, даже без заказов».

### Найти строки без пары

Классический приём — `LEFT JOIN` + фильтр по `NULL`. Так находят клиентов без заказов, товары без продаж и т.п.:

```sql {4}
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.customer_id
WHERE o.order_id IS NULL;   -- остались только те, у кого пары не нашлось
```

Результат: `Лев`.

:::caution[ON vs WHERE при LEFT JOIN]
Условие на правую таблицу, поставленное в `WHERE`, превращает `LEFT JOIN` обратно в `INNER`:

```sql
-- ❌ Лев исчезнет: WHERE отфильтрует строку с NULL-статусом
LEFT JOIN orders o ON o.customer_id = c.customer_id
WHERE o.status = 'paid'

-- ✅ условие в ON — Лев останется (с NULL в столбцах заказа)
LEFT JOIN orders o ON o.customer_id = c.customer_id AND o.status = 'paid'
```

Правило: фильтр по **правой** таблице в `LEFT JOIN` ставь в `ON`, иначе теряешь смысл «левого» соединения.
:::

## RIGHT JOIN

Зеркало `LEFT`: берёт все строки **правой** таблицы. На практике почти не используется — обычно проще поменять таблицы местами и написать `LEFT`. Эти два запроса эквивалентны:

```sql
SELECT * FROM customers c RIGHT JOIN orders o ON o.customer_id = c.customer_id;
SELECT * FROM orders o LEFT JOIN customers c ON o.customer_id = c.customer_id;
```

Второй вариант (через `LEFT`) покажет «осиротевший» заказ 105 — заказ есть, а клиента нет.

## FULL OUTER JOIN

Берёт **всё из обеих** таблиц. Несовпавшие строки с обеих сторон добиваются `NULL`. Удобно для сверки двух источников: «что есть слева, но нет справа, и наоборот».

```sql
SELECT c.name, o.order_id
FROM customers AS c
FULL OUTER JOIN orders AS o ON o.customer_id = c.customer_id;
```

| name  | order_id |
|-------|----------|
| Аня   | 101      |
| Аня   | 102      |
| Борис | 103      |
| Кира  | 104      |
| Лев   | NULL     |
| NULL  | 105      |

Здесь видно обе аномалии сразу: Лев без заказа и заказ 105 без клиента.

## CROSS JOIN

Декартово произведение: **каждая** строка слева сцепляется с **каждой** справа. Без `ON`. Если в таблицах 4 и 5 строк — на выходе 20.

```sql
-- все возможные пары "клиент × месяц" — каркас для отчёта без пропусков
SELECT c.name, m.month
FROM customers AS c
CROSS JOIN (VALUES ('2026-01'), ('2026-02'), ('2026-03')) AS m(month);
```

:::caution[CROSS JOIN множит строки]
`CROSS JOIN` на больших таблицах — это взрыв: 100k × 100k = 10 млрд строк. Используй осознанно (генерация календарей, сетки комбинаций), а не по ошибке (забытое условие `ON` в некоторых диалектах превращается в крест).
:::

## SELF JOIN

Таблица соединяется сама с собой — через алиасы. Нужен для иерархий: сотрудник → руководитель, категория → родительская категория.

```sql
-- кто чей руководитель
SELECT e.name AS employee, m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON e.manager_id = m.employee_id;
```

`LEFT` здесь не случаен: у самого верхнего руководителя `manager_id IS NULL`, и с `INNER` он бы выпал.

## Соединение нескольких таблиц

`JOIN`-ы сцепляются цепочкой. Чтобы добраться от клиента до названий товаров, идём через `order_items`:

```sql
SELECT c.name, p.title, oi.qty
FROM customers   AS c
JOIN orders      AS o  ON o.customer_id = c.customer_id
JOIN order_items AS oi ON oi.order_id   = o.order_id
JOIN products    AS p  ON p.product_id  = oi.product_id
WHERE o.status = 'paid';
```

Каждый `JOIN` добавляет одну таблицу и своё условие в `ON`. Порядок написания на результат `INNER JOIN` не влияет (планировщик сам решает, как выполнять), но влияет на читаемость — иди по логическим связям.

## Главная ловушка: дубли после JOIN

Самая частая ошибка джуна. Соединяешь «один-ко-многим» — и строки **размножаются**. Если потом считать агрегат, получишь завышенные числа.

У Ани два заказа. Считаем «выручку по клиентам», случайно подключив лишнюю таблицу:

```sql
-- ❌ amount задвоится: order_items "размножил" строки заказа
SELECT c.name, SUM(o.amount) AS revenue
FROM customers   AS c
JOIN orders      AS o  ON o.customer_id = c.customer_id
JOIN order_items AS oi ON oi.order_id   = o.order_id
GROUP BY c.name;
```

Если в заказе 101 три позиции, строка заказа повторится трижды → `amount` просуммируется трижды.

:::caution[Как лечить дубли]
- **Агрегируй на нужном уровне до соединения** (через подзапрос или CTE): сначала схлопни `order_items` до сумм по заказу, потом джойни.
- Проверяй **гранулярность**: на каком уровне одна строка результата? Один заказ? Одна позиция? Если перемешал уровни — будут дубли.
- Сомневаешься — сравни `COUNT(*)` до и после `JOIN`. Выросло сильнее, чем ожидал, — ищи fan-out.
:::

## Когда что применять

| Задача | JOIN |
|--------|------|
| Только сматченные записи (заказы с известным клиентом) | `INNER` |
| Все объекты, даже без связей (все клиенты, в т.ч. без заказов) | `LEFT` |
| Найти записи без пары (клиенты без заказов) | `LEFT` + `WHERE ... IS NULL` |
| Сверить два источника на расхождения | `FULL OUTER` |
| Все комбинации (календарь, сетка) | `CROSS` |
| Иерархия внутри одной таблицы | `SELF` (`LEFT JOIN` на себя) |

## Задачи для самопроверки

Решай на демо-схеме выше. Ответ — под спойлером, но сначала напиши сам.

<details>
<summary>1. Выведи всех клиентов и количество их оплаченных заказов (включая тех, у кого 0).</summary>

```sql
SELECT c.name, COUNT(o.order_id) AS paid_orders
FROM customers AS c
LEFT JOIN orders AS o
       ON o.customer_id = c.customer_id
      AND o.status = 'paid'      -- фильтр в ON, чтобы не потерять клиентов без заказов
GROUP BY c.name
ORDER BY paid_orders DESC;
```

`COUNT(o.order_id)` считает только не-`NULL`, поэтому у Льва и Бориса (заказ отменён) будет 0. Условие `status = 'paid'` стоит в `ON`, а не в `WHERE`.

</details>

<details>
<summary>2. Найди заказы, ссылающиеся на несуществующего клиента.</summary>

```sql
SELECT o.order_id, o.customer_id
FROM orders AS o
LEFT JOIN customers AS c ON c.customer_id = o.customer_id
WHERE c.customer_id IS NULL;
```

Результат: заказ 105. Это типичная проверка целостности данных.

</details>

<details>
<summary>3. Почему этот запрос может вернуть выручку больше реальной?</summary>

```sql
SELECT SUM(o.amount)
FROM orders o
JOIN order_items oi ON oi.order_id = o.order_id;
```

`JOIN` с `order_items` размножает строку заказа по числу позиций (fan-out), и `amount` суммируется по разу за каждую позицию. Правильно — сначала свернуть `order_items` в подзапросе или вовсе не подключать его, если нужна только сумма по заказам.

</details>

## Что дальше

- [Подзапросы](/02-sql/07-subqueries/) — как агрегировать «до JOIN», чтобы убить дубли.
- [CTE](/02-sql/08-cte/) — тот же приём, но читаемее, через `WITH`.
- [Агрегации](/02-sql/05-aggregations/) — если подзабыл `GROUP BY` / `HAVING`.

**Практика:** на [sql-ex.ru](https://sql-ex.ru/) задачи 25–50 как раз про джойны; на [LeetCode](https://leetcode.com/problemset/database/) фильтруй по тегу *Join*.
