---
title: NumPy
description: "NumPy basics for an analyst: ndarray vs list, creating arrays, indexing, broadcasting, vectorized operations and aggregations."
sidebar:
  order: 3
---

:::tip[In short]
NumPy is a library of fast numeric arrays (`ndarray`) that pandas is built on. The key idea is **vectorized operations**: instead of looping over elements you write `arr * 2`, and it works all at once and fast. You don't need deep NumPy, but understanding broadcasting helps — it shows up in pandas.
:::

## Why you need it

A pandas column is essentially a NumPy array. When you write `df["amount"] * 1.2`, a NumPy vectorized operation runs under the hood. Understanding the basics explains why pandas is fast and how it behaves.

## ndarray vs list

```python
import numpy as np

lst = [1, 2, 3]
arr = np.array([1, 2, 3])

# list: multiplication repeats elements
lst * 2      # [1, 2, 3, 1, 2, 3]

# array: element-wise (vectorized) multiplication
arr * 2      # array([2, 4, 6])
```

An array stores numbers of one type contiguously in memory — hence the speed on large data and convenient math.

## Creating arrays

```python
np.array([1, 2, 3])          # from a list
np.zeros(5)                  # [0. 0. 0. 0. 0.]
np.ones((2, 3))              # a 2×3 matrix of ones
np.arange(0, 10, 2)          # [0 2 4 6 8]
np.linspace(0, 1, 5)         # 5 points from 0 to 1
```

## Indexing and slices

Like lists, plus boolean masks and 2D access:

```python
a = np.array([10, 20, 30, 40, 50])
a[1:3]          # array([20, 30])
a[a > 25]       # array([30, 40, 50]) — a boolean mask
```

A boolean mask (`a > 25` gives a `True/False` array used to select elements) is the basis of filtering in pandas too.

## Broadcasting

NumPy "stretches" the smaller array to the shape of the larger one so the operation applies element-wise:

```python
prices = np.array([100, 200, 300])
prices * 1.2            # array([120., 240., 360.]) — the scalar is stretched
prices + np.array([1, 2, 3])   # array([101, 202, 303])
```

It's exactly thanks to broadcasting that `df["price"] * 1.2` works in pandas with no loops.

## Universal functions and aggregations

```python
np.sqrt(arr)            # element-wise square root
np.log(arr)             # logarithm

a.sum()    a.mean()     # sum, mean
a.min()    a.max()      # min, max
a.std()                 # standard deviation
```

:::note[When NumPy, when pandas]
Pure NumPy is rarely needed — for matrix computations, ML features, numeric operations. For tabular data (with columns and names) use pandas: it's more convenient and built on top of NumPy.
:::

<details>
<summary>1. How does `[1,2,3] * 2` differ from `np.array([1,2,3]) * 2`?</summary>

The list repeats: `[1, 2, 3, 1, 2, 3]`. The array multiplies element-wise (vectorized): `array([2, 4, 6])`. This is NumPy's key difference — arithmetic applies to each element.

</details>

<details>
<summary>2. What does `a[a > 25]` do?</summary>

It's a boolean mask: `a > 25` gives a `True/False` array, and indexing with it keeps only elements where `True`. The same technique is the basis of filtering in pandas.

</details>

## What's next

- [pandas: introduction](/en/04-python/04-pandas-intro/) — tables on top of NumPy arrays.
- [pandas: selecting data](/en/04-python/05-pandas-selecting/) — the same boolean masks, but over columns.
