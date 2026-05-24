---
title: SQL
description: Структурированный язык запросов — главный инструмент Data Analyst. От SELECT до оконных функций и оптимизации.
sidebar:
  order: 0
  label: Обзор раздела
---

SQL — навык №1 для аналитика. По данным анализа рынка 2026 года, **90%+ вакансий** Data Analyst требуют SQL, и для middle-позиций — не просто базовые запросы, а оконные функции, CTE и понимание оптимизации.

## Маршрут по разделу

Страницы идут от концепций к практике. Если ты совсем новичок — иди по порядку, не перепрыгивай через JOINы к оконным функциям.

**База:**

1. [Реляционные БД](/02-sql/01-rdbms-concepts/) — что такое таблицы, ключи, связи.
2. [Установка окружения](/02-sql/02-environment-setup/) — PostgreSQL + демо-БД для практики.
3. [SELECT и WHERE](/02-sql/03-select-basics/) — первые запросы.
4. [Операторы фильтрации](/02-sql/04-filtering-operators/) — BETWEEN, IN, LIKE, IS NULL.
5. [Агрегации](/02-sql/05-aggregations/) — GROUP BY, HAVING, COUNT/SUM/AVG.

**JOINs и подзапросы:**

6. [JOIN-ы](/02-sql/06-joins/) — все типы с визуализацией.
7. [Подзапросы](/02-sql/07-subqueries/) — scalar, IN, EXISTS, correlated.
8. [CTE](/02-sql/08-cte/) — WITH и рекурсивные CTE.

**Продвинутое:**

9. [Оконные функции](/02-sql/09-window-functions/) — ROW_NUMBER, RANK, LAG/LEAD, PARTITION BY.
10. [Даты и строки](/02-sql/10-dates-and-strings/) — работа с типами данных.
11. [Множественные операции](/02-sql/11-set-operations/) — UNION, INTERSECT, EXCEPT.
12. [CASE и условные выражения](/02-sql/12-case-and-conditionals/) — CASE, COALESCE, NULLIF.

**Практика и оптимизация:**

13. [Модификация данных](/02-sql/13-data-modification/) — INSERT, UPDATE, DELETE.
14. [Индексы и оптимизация](/02-sql/14-indexes-optimization/) — EXPLAIN, типичные тормоза.
15. [Диалекты](/02-sql/15-dialects-comparison/) — PostgreSQL vs ClickHouse vs BigQuery vs MySQL.
16. [Типичные паттерны](/02-sql/16-common-patterns/) — RFM, когорты, retention.
17. [Задачи с собеседований](/02-sql/17-interview-tasks/) — разбор реальных задач.

## Где практиковаться

Параллельно с чтением — решай задачи. Лучшие площадки:

- [sql-ex.ru](https://sql-ex.ru/) — классика на русском, очень крутая теория.
- [LeetCode SQL](https://leetcode.com/problemset/database/) — задачи с собесов в FAANG.
- [StrataScratch](https://www.stratascratch.com/) — задачи из реальных компаний.
- [HackerRank SQL](https://www.hackerrank.com/domains/sql) — начинающим.
- [SQLBolt](https://sqlbolt.com/) — интерактивный учебник.
