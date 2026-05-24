---
title: "pandas: time series"
description: "Time series in pandas: to_datetime, DatetimeIndex, resample, rolling windows, shift and diff."
sidebar:
  order: 9
---

:::tip[In short]
First convert the column to a date with **`to_datetime`** — then time operations unlock: **`resample`** (aggregate by day/week/month), **`rolling`** (moving average), **`shift`/`diff`** (compare to the prior period). This is the basis of "by month" and "growth over previous" reports.
:::

## Why you need it

Time-based analytics is everyday work: revenue by week, MAU by month, growth over the prior period, smoothing noise with a moving average. pandas does it in a couple of methods — but only if dates are real dates, not strings.

## to_datetime

```python
df["date"] = pd.to_datetime(df["date"])          # string → date
df["date"] = pd.to_datetime(df["date"], format="%d.%m.%Y")   # if the format is non-standard
```

After that, components are available: `df["date"].dt.year`, `.dt.month`, `.dt.dayofweek`, `.dt.to_period("M")`.

## DatetimeIndex

Many operations are more convenient when the date is the index:

```python
ts = df.set_index("date")
ts.loc["2026-02"]            # all rows for February 2026
ts.loc["2026-01":"2026-03"] # slice by date range
```

## resample: aggregating by periods

`resample` is `groupby` over time. Period codes: `D` (day), `W` (week), `ME` (month), `QE` (quarter):

```python
ts["amount"].resample("ME").sum()       # revenue by month
ts["amount"].resample("W").mean()        # average check by week
```

| period | sum |
|--------|-----|
| 2026-01 | 4300 |
| 2026-02 | 4900 |

## rolling: moving windows

Smoothing and rolling metrics:

```python
ts["amount"].rolling(7).mean()           # 7-day moving average
ts["amount"].rolling(30).sum()           # sum over the last 30 points
```

A moving average removes daily noise and reveals the trend.

## shift and diff: comparing to the past

```python
monthly = ts["amount"].resample("ME").sum()
monthly.shift(1)                         # previous month's value
monthly.diff()                           # absolute growth over previous
monthly.pct_change()                     # growth in percent (month-over-month)
```

`shift` shifts the series (the equivalent of SQL's `LAG`), `diff` and `pct_change` give the growth directly.

:::caution[Sort by date before shift/rolling]
`shift`, `diff` and `rolling` work on the current row order. If the data isn't sorted by date, the "previous period" will be random. Run `df.sort_values("date")` before computing.
:::

## Time zones (briefly)

If time is in UTC and you need a local zone:

```python
ts.tz_localize("UTC").tz_convert("Europe/Berlin")
```

At the start time zones are rarely needed — but remember that "midnight" depends on the zone, and this affects daily metrics.

<details>
<summary>1. How to get revenue by month from a table of daily orders?</summary>

Convert the date: `df["date"] = pd.to_datetime(df["date"])`, make it the index and resample: `df.set_index("date")["amount"].resample("ME").sum()`. `resample` is grouping over time.

</details>

<details>
<summary>2. How does `diff()` differ from `pct_change()`?</summary>

`diff()` gives the absolute difference from the previous value (e.g. +500), `pct_change()` — the relative one as a fraction (e.g. 0.12 = +12%). For month-over-month in percent use `pct_change`.

</details>

## What's next

- [Data cleaning](/en/04-python/10-data-cleaning/) — missing values, types, outliers.
- [Dates and strings in SQL](/en/02-sql/10-dates-and-strings/) — the same time operations in the database.
