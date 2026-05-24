---
title: Working with files
description: "Reading and writing files in pandas: CSV (encoding/sep/decimal), Excel with multiple sheets, JSON and json_normalize, Parquet, large files with chunksize."
sidebar:
  order: 13
---

:::tip[In short]
Data arrives as files: CSV, Excel, JSON, sometimes Parquet. The main trap is **encoding and delimiter in CSV**. For large files there's `chunksize` (read in parts) and Parquet (a fast columnar format). Nested JSON is unfolded with `json_normalize`.
:::

## Why you need it

An analyst receives 90% of exports as files. Being able to read them correctly (especially a "broken" CSV from accounting software or an export from someone else's system) is a basic skill, without which analysis won't even start.

## CSV: key parameters

```python
df = pd.read_csv("data.csv",
                 sep=";",              # delimiter (often ; in some regional exports)
                 encoding="utf-8",     # or "cp1251" for old localized files
                 decimal=",",          # comma as the decimal separator
                 parse_dates=["date"]) # parse dates right away
```

:::caution[Encoding and delimiter — the source of 90% of CSV pain]
Garbled characters instead of letters → the wrong `encoding` (try `cp1251` or `utf-8-sig`). All data in one column → the wrong `sep`. Numbers became text → the decimal separator is `,` instead of `.` (set `decimal=","`). Open the file in a text editor and look inside before guessing.
:::

## Excel: multiple sheets

```python
df = pd.read_excel("report.xlsx", sheet_name="January")   # a specific sheet
all_sheets = pd.read_excel("report.xlsx", sheet_name=None)  # dict of all sheets

# write several sheets into one file
with pd.ExcelWriter("out.xlsx") as writer:
    jan.to_excel(writer, sheet_name="January", index=False)
    feb.to_excel(writer, sheet_name="February", index=False)
```

For `.xlsx` you need the `openpyxl` package (`pip install openpyxl`).

## JSON and nesting

```python
df = pd.read_json("data.json")                  # flat JSON

# nested JSON from an API — unfold it
import json
raw = json.load(open("api.json"))
df = pd.json_normalize(raw, record_path="orders", meta=["user_id"])
```

`json_normalize` unfolds nested structures (lists inside objects) into a flat table — a common task when working with [APIs](/en/04-python/15-apis-and-scraping/).

## Parquet: for big data

```python
df.to_parquet("data.parquet")        # a fast columnar format (needs pyarrow)
df = pd.read_parquet("data.parquet")
```

Parquet is several times more compact and faster than CSV, stores types and doesn't suffer from encoding problems. The standard for intermediate data and [cloud warehouses](/en/11-modern-stack/01-cloud-dwh-overview/).

## Large files: chunksize

If a file doesn't fit in memory — read it in chunks:

```python
total = 0
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    total += chunk["amount"].sum()      # process 100k rows at a time
```

## When to use what

| Format | When |
|--------|------|
| CSV | universal exchange, exports |
| Excel | reports for people, multiple sheets |
| JSON | API responses, nested structures |
| Parquet | large volumes, intermediate storage |

<details>
<summary>1. A localized CSV opened as garbled text, and all data is in one column. What to check?</summary>

Two parameters: `encoding` (for old localized files often `cp1251` instead of `utf-8`) and `sep` (such exports often use `;` not `,`). Plus possibly `decimal=","`. Peek into the file with a text editor to see the real delimiter and characters.

</details>

<details>
<summary>2. A 10 GB file doesn't fit in memory. How to compute a column sum?</summary>

Read in chunks via `chunksize`: a `for chunk in pd.read_csv(..., chunksize=100_000)` loop, summing per chunk. Or convert the data to Parquet and work with the column selectively.

</details>

## What's next

- [SQL from Python](/en/04-python/14-sql-from-python/) — data from the database, not a file.
- [APIs and scraping](/en/04-python/15-apis-and-scraping/) — fetch data from the web.
