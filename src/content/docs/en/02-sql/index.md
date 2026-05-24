---
title: SQL
description: Structured Query Language — the Data Analyst's main tool. From SELECT to window functions and optimization.
sidebar:
  order: 0
  label: Section overview
---

SQL is the #1 skill for an analyst. Per the 2026 market analysis, **90%+ of Data Analyst postings** require SQL, and for middle positions — not just basic queries, but window functions, CTEs and an understanding of optimization.

## Route through the section

The pages go from concepts to practice. If you're a complete beginner — go in order, don't jump from JOINs to window functions.

**Basics:**

1. [Relational databases](/en/02-sql/01-rdbms-concepts/) — what tables, keys and relationships are.
2. [Environment setup](/en/02-sql/02-environment-setup/) — PostgreSQL + a demo DB for practice.
3. [SELECT and WHERE](/en/02-sql/03-select-basics/) — your first queries.
4. [Filtering operators](/en/02-sql/04-filtering-operators/) — BETWEEN, IN, LIKE, IS NULL.
5. [Aggregations](/en/02-sql/05-aggregations/) — GROUP BY, HAVING, COUNT/SUM/AVG.

**JOINs and subqueries:**

6. [JOINs](/en/02-sql/06-joins/) — all types with a visualization.
7. [Subqueries](/en/02-sql/07-subqueries/) — scalar, IN, EXISTS, correlated.
8. [CTEs](/en/02-sql/08-cte/) — WITH and recursive CTEs.

**Advanced:**

9. [Window functions](/en/02-sql/09-window-functions/) — ROW_NUMBER, RANK, LAG/LEAD, PARTITION BY.
10. [Dates and strings](/en/02-sql/10-dates-and-strings/) — working with data types.
11. [Set operations](/en/02-sql/11-set-operations/) — UNION, INTERSECT, EXCEPT.
12. [CASE and conditionals](/en/02-sql/12-case-and-conditionals/) — CASE, COALESCE, NULLIF.

**Practice and optimization:**

13. [Data modification](/en/02-sql/13-data-modification/) — INSERT, UPDATE, DELETE.
14. [Indexes and optimization](/en/02-sql/14-indexes-optimization/) — EXPLAIN, common slowdowns.
15. [Dialects](/en/02-sql/15-dialects-comparison/) — PostgreSQL vs ClickHouse vs BigQuery vs MySQL.
16. [Common patterns](/en/02-sql/16-common-patterns/) — RFM, cohorts, retention.
17. [Interview tasks](/en/02-sql/17-interview-tasks/) — walkthroughs of real tasks.

## Where to practice

Solve tasks alongside reading. The best platforms:

- [LeetCode SQL](https://leetcode.com/problemset/database/) — tasks from FAANG interviews.
- [StrataScratch](https://www.stratascratch.com/) — tasks from real companies.
- [HackerRank SQL](https://www.hackerrank.com/domains/sql) — for beginners.
- [SQLBolt](https://sqlbolt.com/) — an interactive tutorial.
