---
title: Color and design
description: "Color in visualization: palette types (sequential/diverging/qualitative), ColorBrewer, colorblind accessibility, contrast and fonts."
sidebar:
  order: 3
---

:::tip[In short]
Color isn't decoration — it's a data encoding. Three palette types for three tasks: **sequential** (low to high), **diverging** (deviation from a center), **qualitative** (categories). The main accessibility rule: **don't rely on color alone** — ~8% of men can't tell red from green.
:::

## Why you need it

The wrong palette distorts data (a rainbow "jumps" where values are smooth), and ignoring color blindness makes a chart unreadable for part of the audience. Color is a powerful but disciplined tool.

## Three palette types

| Type | For what | Example |
|------|----------|---------|
| **Sequential** | ordered values from low to high | a sales heatmap |
| **Diverging** | deviation in both directions from a center | profit/loss around zero |
| **Qualitative** | unrelated categories | countries, products |

:::caution[Don't use a rainbow for numeric data]
The rainbow (jet) palette has no natural order: the eye sees "boundaries" where the data changes smoothly, and vice versa. For ordered quantities — sequential (one hue from light to dark), for deviations — diverging. A rainbow misleads.
:::

## ColorBrewer

[ColorBrewer](https://colorbrewer2.org/) is a ready set of proven palettes for maps and charts, with a "colorblind safe" filter. Don't pick colors by eye — take a ready scheme from there (it's built into matplotlib, Tableau, Power BI).

## Colorblind accessibility

About 8% of men and 0.5% of women see colors poorly (most often red/green).

- **Don't encode meaning by color alone**: add shape, label, hatching or direct labeling.
- Avoid red+green as the only differentiator (and that's the classic "bad/good").
- Check the palette with a color-blindness simulator or use colorblind-safe schemes.

## Contrast and readability

- Sufficient contrast between text and background (dark on light or vice versa). A guide — the WCAG standard.
- No more than ~6 colors on a chart; the rest in shades of gray, the accent in one color.
- Gray is your best friend: push secondary things into gray, highlight the main thing with color ([pre-attentive](/en/06-visualization/01-principles/)).

## Fonts for dashboards

- Sans-serif, legible at small sizes: Inter, Roboto, the system font.
- A single font and a couple of sizes (heading/label) — not a zoo of typefaces.
- Numbers — preferably tabular (monospaced) figures, so columns align.

<details>
<summary>1. You're showing profit and loss around zero. Which palette?</summary>

Diverging: two contrasting hues diverging from a neutral center (e.g. blue — profit, red — loss, white — near zero). It emphasizes the direction and magnitude of deviation from zero, which sequential can't convey.

</details>

<details>
<summary>2. Why can't you distinguish "good/bad" by red and green alone?</summary>

About 8% of men can't tell red from green (color blindness) — for them the chart loses meaning. You need to duplicate the encoding: by shape, label, icon or hatching, or choose a colorblind-safe palette. Color shouldn't be the sole carrier of meaning.

</details>

## What's next

- [Storytelling with data](/en/06-visualization/04-storytelling/) — assembling charts into a story.
- [Anti-patterns](/en/06-visualization/05-common-mistakes/) — typical design mistakes.
