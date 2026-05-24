---
title: Data cleaning
description: "Data cleaning in Excel: removing duplicates, Text-to-Columns, Flash Fill, text functions TRIM/CLEAN/LEFT/MID/FIND."
sidebar:
  order: 6
---

:::tip[In short]
Real data is dirty: extra spaces, duplicates, "23 units" instead of a number, a full name in one cell. The basic cleaning kit is **`TRIM`** (strip spaces), **Remove Duplicates**, **Text-to-Columns / Flash Fill** (split columns) and the text functions `LEFT`/`MID`/`FIND`.
:::

## Why you need it

Dirty data breaks everything downstream: `VLOOKUP` won't find "Anna " (with a space) ≠ "Anna", a sum won't compute because of text among numbers. Cleaning is the mandatory first step of any analysis.

## Removing duplicates

Select the range → **Data → Remove Duplicates** → check the columns to judge a row a duplicate by. Excel keeps the first occurrence.

:::caution[Duplicates are removed irreversibly]
The command changes the data immediately. Before removing, make a copy of the sheet or work on a copy — you can only undo with Ctrl+Z right away, not later.
:::

## Find & Replace and Text-to-Columns

- **Find & Replace** (`Ctrl + H`) — bulk replace: strip `$`, change `,` to `.`, clear out an extra character.
- **Text-to-Columns** (Data → Text to Columns) — split one column into several by a delimiter (`;`, space) or fixed width. The classic for "First Last" in one cell.

## Flash Fill

**Flash Fill** (`Ctrl + E`) — Excel guesses the pattern from your example. Type "Anna" next to "Anna Ivanova", press `Ctrl + E`, and it fills in the rest of the names itself. Magic for one-off cleaning without formulas.

## Text functions

When you need repeatable (formula) cleaning:

| Function | What it does | Example → result |
|----------|--------------|------------------|
| `TRIM` | strips extra spaces | `TRIM(" Anna ")` → `Anna` |
| `CLEAN` | strips non-printable characters | `CLEAN(text)` |
| `UPPER`/`LOWER`/`PROPER` | case | `PROPER("anna")` → `Anna` |
| `LEFT`/`RIGHT` | n characters from the edge | `LEFT("RU-123",2)` → `RU` |
| `MID` | characters from a position | `MID("RU-123",4,3)` → `123` |
| `FIND` | position of a substring | `FIND("-","RU-123")` → `3` |

Combining `MID` and `FIND`, you extract parts by a delimiter:

```text
=MID(A2, FIND("-",A2)+1, 99)     everything after the dash   "RU-123" → "123"
```

:::note[FIND vs SEARCH]
`FIND` is case-sensitive and doesn't understand wildcards; `SEARCH` is the opposite (ignores case, understands `*`/`?`). For most cleaning tasks `SEARCH` is more convenient.
:::

## Practice tasks

<details>
<summary>1. VLOOKUP can't find "Moscow" even though it's definitely in the reference. What's wrong?</summary>

Almost certainly one of the values has an extra space ("Moscow " ≠ "Moscow") or a non-printable character. Wrap the key in `TRIM` (and if needed `CLEAN`) on both sides, or clean the source column.

</details>

<details>
<summary>2. In a column of "RU-123", "KZ-4500" you need the country code and number separately. How?</summary>

Quickly — **Text-to-Columns** with the `-` delimiter or **Flash Fill**. With formulas: `LEFT(A2,2)` for the code and `MID(A2, FIND("-",A2)+1, 99)` for the number.

</details>

## What's next

- [Power Query](/en/03-excel/05-power-query-basics/) — the same cleaning, but with reproducible steps.
- [Data cleaning in Python](/en/04-python/10-data-cleaning/) — the same thing in pandas for large volumes.
