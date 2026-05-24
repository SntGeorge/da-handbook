---
title: Задачи с собеседований
description: "Реальные SQL-задачи с разбором: вторая зарплата, топ-N по группе, retention, медиана, дубли, сессии."
sidebar:
  order: 17
---

:::tip[Коротко]
Подборка типовых задач с собеседований DA — от джуна к сеньору. Сначала **реши сам**, потом открой разбор. Все задачи решаются инструментами раздела: `GROUP BY`, подзапросы, [CTE](/02-sql/08-cte/), [оконные функции](/02-sql/09-window-functions/).
:::

## Данные для задач

```sql title="Демо-данные"
CREATE TABLE employees (id int, name text, dept text, salary int);
INSERT INTO employees VALUES
    (1,'Аня','Analytics',120),(2,'Борис','Analytics',150),
    (3,'Кира','Analytics',150),(4,'Лев','Sales',90),(5,'Мия','Sales',200);

CREATE TABLE logins (user_id int, login_date date);
INSERT INTO logins VALUES
    (1,'2026-01-01'),(1,'2026-01-02'),(1,'2026-01-03'),(1,'2026-01-06'),
    (2,'2026-01-01'),(2,'2026-01-02');
```

## Задача 1 (junior): вторая по величине зарплата

> Найди вторую по величине зарплату в компании. Учти, что максимальных может быть несколько.

<details>
<summary>Разбор</summary>

Наивное `MAX(salary) WHERE salary < MAX(...)` хрупко. Надёжнее `DENSE_RANK` (одинаковые зарплаты получают один ранг):

```sql
WITH ranked AS (
    SELECT DISTINCT salary,
           DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
)
SELECT salary FROM ranked WHERE rnk = 2;
```

Зарплаты: 200, 150, 150, 120, 90. `DENSE_RANK`: 200→1, 150→2, 120→3. Ответ: **150**. `DENSE_RANK` корректно обрабатывает дубли 150, в отличие от `ROW_NUMBER`.

</details>

## Задача 2 (junior/middle): топ-N в каждой группе

> Выведи топ-2 сотрудника по зарплате в каждом отделе.

<details>
<summary>Разбор</summary>

`ROW_NUMBER` с `PARTITION BY dept`, фильтр по рангу в CTE (в `WHERE` оконку нельзя):

```sql
WITH ranked AS (
    SELECT name, dept, salary,
           ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
    FROM employees
)
SELECT name, dept, salary FROM ranked WHERE rn <= 2;
```

| name  | dept      | salary |
|-------|-----------|--------|
| Борис | Analytics | 150    |
| Кира  | Analytics | 150    |
| Мия   | Sales     | 200    |
| Лев   | Sales     | 90     |

Если нужны **все** при равенстве (а не ровно 2) — бери `RANK`/`DENSE_RANK` вместо `ROW_NUMBER`.

</details>

## Задача 3 (middle): N-day retention

> Сколько пользователей, залогинившихся в день X, вернулись на следующий день?

<details>
<summary>Разбор</summary>

Самосоединение по `login_date + 1` (или `LEAD`). Через self-join:

```sql
SELECT a.login_date AS day,
       COUNT(DISTINCT b.user_id) AS retained_next_day
FROM logins a
LEFT JOIN logins b
       ON b.user_id = a.user_id
      AND b.login_date = a.login_date + 1
GROUP BY a.login_date
ORDER BY a.login_date;
```

Пользователь 1 заходил 1,2,3,6 января → вернулся на следующий день после 1-го и 2-го. Между 3 и 6 — разрыв. Это база для retention-кривых (см. [Продуктовую аналитику](/08-product-analytics/05-retention-curves/)).

</details>

## Задача 4 (middle/senior): gaps-and-islands

> Найди для каждого пользователя самую длинную серию **подряд идущих** дней логина.

<details>
<summary>Разбор</summary>

Трюк «дата минус номер строки»: у подряд идущих дат разность постоянна → это метка «острова».

```sql
WITH g AS (
    SELECT user_id, login_date,
           login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS island
    FROM logins
),
streaks AS (
    SELECT user_id, island, COUNT(*) AS len
    FROM g GROUP BY user_id, island
)
SELECT user_id, MAX(len) AS longest_streak
FROM streaks GROUP BY user_id;
```

У пользователя 1 дни 1,2,3 дают один остров (len=3), день 6 — другой (len=1). Ответ: 3.

</details>

## Задача 5 (senior): медиана без MEDIAN()

> Посчитай медианную зарплату, не используя `PERCENTILE_CONT`/`MEDIAN`.

<details>
<summary>Разбор</summary>

Пронумеровать по возрастанию и по убыванию; медиана — там, где номера «встречаются» (для чётного n — среднее двух центральных):

```sql
WITH r AS (
    SELECT salary,
           ROW_NUMBER() OVER (ORDER BY salary)      AS asc_n,
           ROW_NUMBER() OVER (ORDER BY salary DESC) AS desc_n,
           COUNT(*) OVER ()                          AS total
    FROM employees
)
SELECT AVG(salary) AS median
FROM r
WHERE asc_n IN (desc_n, desc_n + 1, desc_n - 1);
```

Центральная строка — где `asc_n ≈ desc_n`. `AVG` усредняет одно или два центральных значения. (Если СУБД поддерживает — в проде, конечно, проще `PERCENTILE_CONT(0.5)`.)

</details>

## Задача 6 (senior): пользовательские сессии

> Разбей логины на сессии: новая сессия начинается, если между событиями пользователя прошло больше 30 минут.

<details>
<summary>Разбор</summary>

(На данных с `timestamp`.) `LAG` достаёт предыдущее событие; флаг «новая сессия» = разрыв > 30 мин; нарастающая сумма флагов даёт номер сессии:

```sql
WITH e AS (
    SELECT user_id, ts,
           LAG(ts) OVER (PARTITION BY user_id ORDER BY ts) AS prev_ts
    FROM events
),
flagged AS (
    SELECT user_id, ts,
           CASE WHEN prev_ts IS NULL
                  OR ts - prev_ts > INTERVAL '30 minutes'
                THEN 1 ELSE 0 END AS is_new_session
    FROM e
)
SELECT user_id, ts,
       SUM(is_new_session) OVER (PARTITION BY user_id ORDER BY ts) AS session_id
FROM flagged;
```

Паттерн «флаг + нарастающая сумма» (sessionization) — частый на собесах в продуктовых компаниях.

</details>

## Как решать на собесе

:::note[Алгоритм]
1. **Уточни данные**: гранулярность, дубли, `NULL`, что значит каждая строка.
2. **Проговори подход вслух** до кода — интервьюер оценивает мышление, а не скорость печати.
3. **Разбей на шаги через CTE** — читаемо и легко отлаживать по частям.
4. **Проверь крайние случаи**: пустые группы, равные значения, `NULL`, деление на ноль.
:::

## Что дальше

- [Технические вопросы](/12-career/05-technical-interview/) — теория, которую спрашивают рядом с задачами.
- [Типичные паттерны](/02-sql/16-common-patterns/) — если какой-то приём из задач выше непонятен.

**Практика:** [StrataScratch](https://www.stratascratch.com/) (реальные собесы), [LeetCode SQL](https://leetcode.com/problemset/database/), [DataLemur](https://datalemur.com/) — задачи именно для DA-интервью.
