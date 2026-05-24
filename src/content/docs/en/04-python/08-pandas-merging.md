---
title: "pandas: merging"
description: "Combining tables in pandas: merge and join types, join by index, concat by rows and columns, common mistakes."
sidebar:
  order: 8
---

:::tip[In short]
**`merge`** is SQL's `JOIN`: glue two tables by key (`inner`/`left`/`right`/`outer`). **`concat`** stacks tables (by rows, like `UNION`) or appends columns. The main trap is row inflation when the key has duplicates.
:::

## Why you need it

Data is almost always split across tables: orders separate, customers separate. To pull a customer's name onto an order, or a product reference onto sales, you need `merge`.

```python title="Two tables"
orders = pd.DataFrame({
    "order_id":   [101, 102, 104],
    "customer_id":[1, 1, 3],
    "amount":     [2500, 1800, 4200],
})
customers = pd.DataFrame({
    "customer_id":[1, 2, 3],
    "name":       ["Anna", "Boris", "Kira"],
})
```

## merge: join by key

```python
orders.merge(customers, on="customer_id", how="left")
```

| order_id | customer_id | amount | name |
|----------|-------------|--------|------|
| 101      | 1           | 2500   | Anna |
| 102      | 1           | 1800   | Anna |
| 104      | 3           | 4200   | Kira |

## Join types (how=)

| how | What it keeps |
|-----|---------------|
| `inner` (default) | only matches in both |
| `left` | all left rows + matches from the right |
| `right` | all right rows + matches from the left |
| `outer` | all rows of both, missing → NaN |

If key names differ — `left_on="id"`, `right_on="customer_id"`.

## join by index

`join` is `merge` but by index (shorter when the key is the index):

```python
orders.set_index("customer_id").join(customers.set_index("customer_id"))
```

## concat: stacked and side by side

```python
pd.concat([jan, feb])                    # by rows: exports for different months (UNION)
pd.concat([df1, df2], axis=1)            # by columns: append side by side
```

`axis=0` (default) — one under another; `axis=1` — side by side by index.

## combine_first

Fill missing values in one table with values from another:

```python
primary.combine_first(backup)            # where primary is NaN, take from backup
```

:::caution[merge's main mistake — row inflation]
If the key in the right table isn't unique, each left row matches **several** right rows, and the row count grows (and sums double). Before `merge` check the key's uniqueness: `customers["customer_id"].is_unique`. This is the same trap as [row "fan-out" in SQL joins](/en/02-sql/06-joins/).
:::

## Practice tasks

<details>
<summary>1. You need all orders, and if a customer has a name — pull it, otherwise NaN. Which how?</summary>

`how="left"` with the orders table on the left: `orders.merge(customers, on="customer_id", how="left")`. All orders are kept; the name is filled where present, otherwise `NaN`.

</details>

<details>
<summary>2. After a merge the revenue total suddenly doubled. Why?</summary>

Most likely the key in the right table isn't unique — the left rows multiplied across matches. Check `df["key"].is_unique` and aggregate/deduplicate the right table before the merge if needed.

</details>

## What's next

- [pandas: time series](/en/04-python/09-pandas-time-series/) — dates, resampling, rolling windows.
- [JOINs in SQL](/en/02-sql/06-joins/) — the same joins on the database side.
