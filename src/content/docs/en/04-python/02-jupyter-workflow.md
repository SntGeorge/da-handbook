---
title: Jupyter notebooks
description: "Working in Jupyter and VS Code notebooks: code and markdown cells, magic commands, shortcuts, good practices."
sidebar:
  order: 2
---

:::tip[In short]
A Jupyter notebook is a document of **cells**: you write code, run it one cell at a time (`Shift+Enter`), and immediately see the result and charts alongside. It's the analyst's standard environment: code, output and text notes in one `.ipynb` file.
:::

## Why you need it

Analysis is iterative: load data, look, fix, recompute. In a regular script you'd rerun everything each time; in a notebook you run piece by piece and keep results in memory. That's why all exploratory analysis lives in notebooks.

## Launching

- **In VS Code** — create an `.ipynb` file and open it (see [setup](/en/01-setup/ide-setup/)). The most convenient path.
- **In the browser** — the command `jupyter lab` or `jupyter notebook` in the terminal of an activated [environment](/en/01-setup/virtual-environments/).

## Cells: code and markdown

Two cell types:

- **Code** — Python code; the last line's result is printed below the cell.
- **Markdown** — text with formatting (headings, lists, formulas) for explanations.

```python
import pandas as pd
df = pd.read_csv("orders.csv")
df.head()        # the table prints right below the cell
```

`Shift+Enter` — run the cell and move to the next.

## Magic commands

Jupyter's special commands start with `%` (line) or `%%` (whole cell):

| Command | What it does |
|---------|--------------|
| `%timeit code` | measure execution time |
| `%%time` | time the whole cell |
| `%matplotlib inline` | draw charts inside the notebook |
| `%who` | show defined variables |
| `!pip install pandas` | run a shell command (via `!`) |

## Useful shortcuts

In command mode (press `Esc`, the cell border turns blue):

- `A` / `B` — insert a cell above / below;
- `D D` — delete a cell;
- `M` / `Y` — switch to markdown / code;
- `Shift+Enter` — run.

## Good practices

:::caution[The notebook's main trap — execution order]
Cells can be run in any order, and state is "remembered". Because of this, a notebook that "works" for you can break when run top to bottom. Periodically do **Restart & Run All** — it verifies everything reproduces from a clean slate.
:::

- **One cell — one thought**: loading, then cleaning, then a chart. Don't dump it all into one.
- **Markdown headings** between blocks — the notebook reads like a report.
- **Imports in the first cell**, so they're visible right away.

## Notebooks in VS Code

VS Code opens `.ipynb` natively: the same cells, plus autocomplete, a debugger and Git diffs. Don't forget to select your venv's interpreter (top right) — otherwise installed packages won't be picked up.

## What's next

- [NumPy](/en/04-python/03-numpy/) — the arrays pandas stands on.
- [pandas: introduction](/en/04-python/04-pandas-intro/) — the main analysis tool.
