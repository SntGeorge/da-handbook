---
title: Excel basics
description: "The Excel interface, relative and absolute references ($), number formats, conditional formatting, named ranges."
sidebar:
  order: 1
---

:::tip[In short]
Before formulas, get two things straight: **reference types** (`A1`, `$A$1`, `$A1`, `A$1` — they decide what happens when you copy) and **formats** (how a number looks without changing its value). This is the foundation everything else rests on.
:::

## Why you need it

90% of a beginner's Excel mistakes are a reference that "drifts" when copied and a number that "looks like a date". Understanding references and formats saves hours of debugging formulas.

## The interface in a minute

- **The ribbon** on top — tabs with commands (Home, Insert, Data, Formulas).
- **A cell** — the intersection of a column (`A`, `B`...) and a row (`1`, `2`...), an address like `B3`.
- **A sheet** — the tabs at the bottom; one file (workbook) has many.
- **The formula bar** — shows what's actually in the cell (the formula, not the result).

## Reference types: where to put `$`

The `$` sign "freezes" a column or row when you copy a formula. This is the most important topic in the basics.

| Notation | What it locks | When copied |
|----------|---------------|-------------|
| `A1` | nothing (relative) | shifts by both row and column |
| `$A$1` | everything (absolute) | doesn't move at all |
| `$A1` | column only | row changes, column doesn't |
| `A$1` | row only | column changes, row doesn't |

Example: multiply prices in column `B` by a rate in the single cell `$E$1`:

```text
B2 * $E$1     ← copy down: B3*$E$1, B4*$E$1...
```

Without `$` the rate reference would slide to `E2`, `E3` (empty) — and everything would break. The **F4** key cycles through reference types.

:::caution[The most common mistake]
A formula works in the first row but "breaks" when dragged down — you almost always forgot the `$` on a reference that should be fixed (a rate, a coefficient, a range header).
:::

## Formats: looks ≠ value

A format changes how a number is **displayed**, not the number itself. `0.5`, `50%` and `$0.50` can all be the single value `0.5`.

- **Number / currency / percent** — separators, decimal places, currency.
- **Date/time** — Excel stores a date as a number (the serial day number); the format just draws it nicely.
- **Text** — disables calculation; useful for SKUs and phone numbers with leading zeros.

**Conditional formatting** (the Home tab) highlights cells by a rule: color negatives red, top-10, a color scale. Handy for quick visual analysis.

## Named ranges

You can give a cell/range a name (the "Name" box left of the formula bar) and reference it by name:

```text
=B2 * Rate       instead of   =B2 * $E$1
```

Formulas read like text and you don't need to remember addresses. Handy for constants and frequently used ranges.

## What's next

- [Core formulas](/en/03-excel/02-formulas-core/) — IF, SUMIFS, COUNTIFS.
- [Lookups](/en/03-excel/03-lookups/) — pull data from another table.
