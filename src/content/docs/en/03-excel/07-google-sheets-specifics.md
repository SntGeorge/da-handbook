---
title: Google Sheets specifics
description: "How Google Sheets differs from Excel: QUERY, IMPORTRANGE, ARRAYFORMULA, GOOGLEFINANCE and collaboration."
sidebar:
  order: 7
---

:::tip[In short]
Google Sheets does almost everything Excel does, but has a few unique functions. The main one is **`QUERY`**: SQL-like queries right in the spreadsheet. Plus **`IMPORTRANGE`** (data from another sheet), **`ARRAYFORMULA`** (a formula across a whole column at once) and real real-time collaboration.
:::

## Why you need it

Many companies live in Google Sheets rather than Excel — because it's free and shareable. The basic formulas (`SUMIFS`, `VLOOKUP`, `XLOOKUP`) work the same, but there are unique tricks that speed up work a lot and that interviewers like to ask about.

## QUERY — SQL inside a spreadsheet

`QUERY` lets you write near-SQL over a range:

```text
=QUERY(A1:D, "select B, sum(D) where C='paid' group by B order by sum(D) desc")
```

This is a full `SELECT ... WHERE ... GROUP BY ... ORDER BY` over the sheet's data. For an analyst who knows SQL, it's the most powerful tool in Sheets.

:::note[Columns in QUERY are letters]
Inside `QUERY` refer to columns by sheet letters (`A`, `B`, `C`), not by headers. `select B, sum(D)` means columns B and D of the range.
:::

## IMPORTRANGE — data from another spreadsheet

Pulls a range from another Google file by link:

```text
=IMPORTRANGE("URL_or_spreadsheet_id", "Sheet1!A1:D100")
```

On first run you grant access once (the "Allow access" button). Handy for gathering data from several spreadsheets into one summary.

## ARRAYFORMULA — a formula across a whole column

Instead of dragging a formula across thousands of rows — one formula working over the whole array:

```text
=ARRAYFORMULA(B2:B * C2:C)        multiplies the columns entirely
```

It's computed at once for the whole range, no need to copy down. Often combined with `IF` and `IFERROR`.

## Other unique functions

- **`GOOGLEFINANCE`** — quotes and exchange rates: `=GOOGLEFINANCE("USDEUR")`.
- **`IMPORTHTML`** — a table or list from a page by URL.
- **`IMPORTDATA`** — data from a CSV/TSV by link.

## Excel vs Google Sheets

| | Excel | Google Sheets |
|--|-------|---------------|
| Collaboration | via OneDrive | real-time, native |
| `QUERY` (SQL-style) | no | yes |
| Power on large data | higher | ~10M cell limit, lags sooner |
| Power Query | yes | no (use `QUERY`/Apps Script) |
| Automation | VBA | Apps Script (JavaScript) |

## Apps Script (overview)

For automation in Sheets, instead of VBA there's **Apps Script** in JavaScript: you can write functions, set triggers (e.g. refresh data on a schedule), send emails. Not required to know at the start — it's enough to know the capability exists.

## Practice tasks

<details>
<summary>1. Need revenue by category with sorting — in one formula in Sheets. How?</summary>

`=QUERY(A1:D, "select B, sum(D) where C='paid' group by B order by sum(D) desc")`. `QUERY` replaces the filter + pivot combo with one line. Columns are referenced by sheet letters.

</details>

<details>
<summary>2. When is Excel preferable to Google Sheets?</summary>

On large volumes (hundreds of thousands of rows, heavy models), when working with Power Query, and when you need full offline work. Google Sheets wins on collaboration, being free, and the `QUERY` function.

</details>

## What's next

- [Core formulas](/en/03-excel/02-formulas-core/) — they work in Sheets too.
- [SQL: SELECT basics](/en/02-sql/03-select-basics/) — `QUERY` is essentially SQL, worth knowing the original.
