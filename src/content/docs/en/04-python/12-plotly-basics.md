---
title: Plotly
description: "Interactive charts in Python: plotly.express for a quick start, graph_objects for control, hover/zoom, export to HTML."
sidebar:
  order: 12
---

:::tip[In short]
Plotly builds **interactive** charts: hover tooltips, zoom, filtering right in the browser. The quick path is **`plotly.express`** (`px`), one line per chart; fine control — `graph_objects`. The result saves to a self-contained HTML — handy for sharing without screenshots.
:::

## Why you need it

A static chart ([matplotlib](/en/04-python/11-matplotlib-seaborn/)) is good for a report-as-image. But when you need to "play" with data — hover a point, zoom a period, hide a series — you need interactivity. Plotly gives it almost for free and embeds into dashboards (Streamlit, Dash).

## plotly.express: quick start

`px` takes a DataFrame and builds a chart in one line:

```python
import plotly.express as px

fig = px.bar(df, x="country", y="amount", color="status", title="Revenue")
fig.show()

px.line(df, x="date", y="amount")              # a line over time
px.scatter(df, x="amount", y="net", color="country", hover_data=["order_id"])
px.histogram(df, x="amount", nbins=20)
```

The `color` parameter automatically splits data by category and builds a legend.

## graph_objects: full control

When `express` isn't enough (multiple axes, custom layout) — build the chart manually:

```python
import plotly.graph_objects as go

fig = go.Figure()
fig.add_trace(go.Scatter(x=df["date"], y=df["amount"], mode="lines", name="Revenue"))
fig.update_layout(title="Dynamics", xaxis_title="Date", yaxis_title="$")
```

You usually start with `px` and move to `graph_objects` only when needed.

## Interactivity

Out of the box, no code: **hover** (tooltip on pointing), **zoom** (select an area), **pan** (drag), **legend click** (hide/show a series), a download PNG button. Tune the tooltip with the `hover_data` parameter.

## Saving to HTML

```python
fig.write_html("chart.html")                   # a self-contained interactive file
fig.write_image("chart.png")                   # a static image (needs kaleido)
```

The HTML opens in any browser and keeps all interactivity — handy to send to a colleague.

:::note[When Plotly, when matplotlib/Seaborn]
Plotly — for interactive dashboards and presentations where data should be explored. matplotlib/Seaborn — for static images in a report/PDF and quick EDA. For precise scientific graphics people lean to matplotlib, for "live" reports — Plotly.
:::

## Plotly in Jupyter

In a notebook `fig.show()` renders an interactive chart right below the cell. In VS Code it works out of the box; in classic Jupyter you sometimes need the `nbformat` package.

<details>
<summary>1. You need a revenue-by-country chart split by status with tooltips. With what?</summary>

`px.bar(df, x="country", y="amount", color="status")`. The `color="status"` parameter splits the bars by status and adds a legend, and hover with sums is on by default.

</details>

<details>
<summary>2. How to share an interactive chart with a colleague who has no Python?</summary>

`fig.write_html("chart.html")` — produces a self-contained file that opens in any browser keeping zoom and tooltips. No Python needed to view it.

</details>

## What's next

- [Working with files](/en/04-python/13-working-with-files/) — where to get data for charts.
- [BI tools](/en/07-bi-tools/) — dashboards, when notebook charts are no longer enough.
