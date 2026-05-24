---
title: Python basics for an analyst
description: "The minimal Python syntax for an analyst: types, collections (list/dict), slices, loops, functions, comprehensions, f-strings."
sidebar:
  order: 1
---

:::tip[In short]
An analyst doesn't need all of Python — just the minimum that pandas stands on: **data types, lists and dicts, slices, conditions/loops and comprehensions**. Skip OOP, decorators and the rest at the start. The goal of this page is so the code in the next chapters doesn't scare you.
:::

## Why you need it

pandas is a layer on top of Python. If you don't understand the basic syntax (what a list is, how a slice `[1:3]` works, what `for` does), analysis code is magic. Here's exactly the base you meet in real notebooks.

## Data types

```python
n = 42          # int — integer
price = 19.99   # float — decimal
name = "Anna"   # str — string
is_paid = True  # bool — True/False
nothing = None  # None — "nothing", like NULL
```

Check a type — `type(n)`. Convert — `int("42")`, `str(42)`, `float("3.14")`.

## Collections

Four containers, two of which are used constantly:

```python
nums = [1, 2, 3]                 # list — ordered, mutable
point = (55.7, 37.6)             # tuple — like a list, but immutable
user = {"name": "Anna", "age": 30}  # dict — key-value pairs
tags = {"ru", "paid"}            # set — unique values
```

`list` and `dict` are the workhorses. A dict is essentially a table row: `user["name"]` → `"Anna"`.

## Slices and indexing

Indices from zero; the slice `[start:end]` excludes the end:

```python
s = [10, 20, 30, 40, 50]
s[0]      # 10  — first
s[-1]     # 50  — last
s[1:3]    # [20, 30]  — 2nd through 3rd
s[:2]     # [10, 20]  — first two
s[::2]    # [10, 30, 50] — every second
```

The same logic works with strings and later with pandas. Worth memorizing firmly.

## Conditions and loops

```python
amount = 2500
if amount > 2000:
    tier = "large"
elif amount > 1000:
    tier = "medium"
else:
    tier = "small"

for x in [1, 2, 3]:
    print(x * 10)
```

Indentation (4 spaces) is part of the syntax, not formatting: Python uses it to define block boundaries.

## Functions and lambda

```python
def discount(price, pct):
    return price * (1 - pct / 100)

discount(1000, 20)        # 800.0

# lambda — a short inline function, often inside pandas
fee = lambda x: x * 0.05
```

## Comprehensions

A compact way to build a list/dict — appears in analysis code constantly:

```python
squares = [x**2 for x in range(5)]              # [0, 1, 4, 9, 16]
paid = [o for o in orders if o > 2000]          # with a condition (filter)
prices = {k: v*1.2 for k, v in base.items()}    # dict comprehension
```

Reads as "take x for each x in range, [if condition]".

## f-strings

Inserting values into a string — for labels, logs, paths:

```python
country, total = "RU", 4300
print(f"Revenue {country}: {total}")    # Revenue RU: 4300
print(f"Share: {0.1234:.1%}")           # Share: 12.3%
```

:::caution[Indentation and =/==]
Two classic beginner mistakes: mixing tabs and spaces in indentation (Python complains with `IndentationError`) and confusing `=` (assignment) with `==` (comparison). In a condition it's always `==`.
:::

<details>
<summary>1. What does `[10, 20, 30, 40][1:3]` return?</summary>

`[20, 30]`. The slice takes elements from index 1 inclusive up to index 3 exclusive. Indexing from zero, the right bound is excluded.

</details>

<details>
<summary>2. How, in one line, do you get a list of squares of even numbers from 0 to 9?</summary>

`[x**2 for x in range(10) if x % 2 == 0]` → `[0, 4, 16, 36, 64]`. A comprehension with an `if` condition.

</details>

## What's next

- [Jupyter notebooks](/en/04-python/02-jupyter-workflow/) — the environment where an analyst writes this code.
- [pandas: introduction](/en/04-python/04-pandas-intro/) — what it was all for.
