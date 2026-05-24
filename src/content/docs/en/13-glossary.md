---
title: Metrics glossary
description: "A reference of an analyst's key metrics by domain: product, unit economics, marketing, funnel, statistics and A/B — with formulas and links to deep-dives."
---

:::tip[In short]
A cheat sheet of the metrics asked about in interviews and computed at work — grouped by domain, with **formulas** and links to the detailed write-ups. Handy to keep open alongside: forgot how LTV/CAC or ROAS is computed — glance and go.
:::

## Product metrics

User behavior in the product. In detail — [key metrics](/en/08-product-analytics/01-key-metrics/) and [retention curves](/en/08-product-analytics/05-retention-curves/).

| Metric | What it is | Formula | More |
|--------|------------|---------|------|
| **DAU / WAU / MAU** | unique users per day / week / month | `COUNT(DISTINCT user)` over the period | [key metrics](/en/08-product-analytics/01-key-metrics/) |
| **Stickiness** | how often they return | $\dfrac{\text{DAU}}{\text{MAU}}$ | [key metrics](/en/08-product-analytics/01-key-metrics/) |
| **Retention (N-day)** | share returning after N days | $\dfrac{\text{returned on day }N}{\text{cohort of day }0}$ | [retention](/en/08-product-analytics/05-retention-curves/) |
| **Churn rate** | share lost over a period | $1 - \text{retention}$ | [key metrics](/en/08-product-analytics/01-key-metrics/) |
| **ARPU** | average revenue per user | $\dfrac{\text{revenue}}{\text{all users}}$ | [key metrics](/en/08-product-analytics/01-key-metrics/) |
| **ARPPU** | average revenue per **paying** user | $\dfrac{\text{revenue}}{\text{paying users}}$ | [key metrics](/en/08-product-analytics/01-key-metrics/) |
| **LTV** | revenue from a customer over their lifetime | $\text{ARPU} \times \text{lifespan}$ (by margin) | [unit economics](/en/08-product-analytics/02-unit-economics/) |
| **NDR** | net dollar retention of a cohort | $\dfrac{\text{cohort revenue after a year}}{\text{its revenue at the start}}$ | [retention](/en/08-product-analytics/05-retention-curves/) |

## Unit economics

Whether we make or lose money on a single customer. In detail — [unit economics](/en/08-product-analytics/02-unit-economics/).

| Metric | What it is | Formula | More |
|--------|------------|---------|------|
| **CAC** | customer acquisition cost | $\dfrac{\text{acquisition spend}}{\text{customers acquired}}$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |
| **LTV/CAC** | customer payback (healthy ≥ 3) | $\dfrac{\text{LTV}}{\text{CAC}}$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |
| **Contribution margin** | margin per unit | $\text{revenue per unit} - \text{variable costs}$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |
| **Payback period** | how long CAC takes to recoup | $\dfrac{\text{CAC}}{\text{monthly margin}}$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |

## Marketing

Advertising payback and cost of target actions.

| Metric | What it is | Formula | More |
|--------|------------|---------|------|
| **CTR** | click-through rate | $\dfrac{\text{clicks}}{\text{impressions}} \times 100\%$ | [funnels](/en/08-product-analytics/03-funnels/) |
| **CR** | conversion to a target action | $\dfrac{\text{target actions}}{\text{visits}} \times 100\%$ | [funnels](/en/08-product-analytics/03-funnels/) |
| **CPC** | cost per click | $\dfrac{\text{spend}}{\text{clicks}}$ | [types of analysts](/en/00-intro/analyst-types/) |
| **CPM** | cost per 1000 impressions | $\dfrac{\text{spend}}{\text{impressions}} \times 1000$ | [types of analysts](/en/00-intro/analyst-types/) |
| **CPA** | cost per target action | $\dfrac{\text{spend}}{\text{actions}}$ | [types of analysts](/en/00-intro/analyst-types/) |
| **ROAS** | return on ad spend | $\dfrac{\text{revenue from ads}}{\text{ad spend}}$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |
| **ROMI** | return on marketing investment | $\dfrac{\text{profit} - \text{spend}}{\text{spend}} \times 100\%$ | [unit economics](/en/08-product-analytics/02-unit-economics/) |

:::note[ROAS vs ROMI]
**ROAS** counts revenue per dollar of ads (ignores cost of goods), **ROMI** counts profit (accounts for costs, so it can be negative). ROAS = 4 sounds good, but at a 20% margin the real ROMI may turn out to be a loss.
:::

## Funnel and conversion

Where users drop off along the way. In detail — [funnels](/en/08-product-analytics/03-funnels/).

| Metric | What it is | Formula |
|--------|------------|---------|
| **Step conversion** | share moving to the next step | $\dfrac{\text{moved to step }n{+}1}{\text{were at step }n}$ |
| **End-to-end conversion** | share reaching the goal | $\dfrac{\text{reached the end}}{\text{entered the funnel}}$ |
| **Dropoff** | share leaving at a step | $1 - \text{step conversion}$ |

## Statistics and A/B

Hypothesis-testing metrics and terms. In detail — [statistics](/en/05-statistics/06-hypothesis-testing/) and [A/B tests](/en/09-ab-testing/01-fundamentals/).

| Term | What it is | Formula / value | More |
|------|------------|-----------------|------|
| **Mean** | center of the data | $\bar{x} = \dfrac{1}{n}\sum x_i$ | [descriptive](/en/05-statistics/01-descriptive-stats/) |
| **Standard deviation** | spread around the mean | $\sigma = \sqrt{\dfrac{1}{n}\sum (x_i-\bar{x})^2}$ | [descriptive](/en/05-statistics/01-descriptive-stats/) |
| **Standard error (SE)** | spread of the sample mean | $SE = \dfrac{\sigma}{\sqrt{n}}$ | [CLT and sampling](/en/05-statistics/04-clt-and-sampling/) |
| **Confidence interval** | range for the true mean | $\bar{x} \pm z \cdot SE$ (for 95% $z=1.96$) | [confidence intervals](/en/05-statistics/05-confidence-intervals/) |
| **p-value** | probability of such data if there's no effect | compared with $\alpha$ (usually 0.05) | [hypothesis testing](/en/05-statistics/06-hypothesis-testing/) |
| **Power** | chance of catching a real effect | $1 - \beta$ (standard 0.8) | [hypothesis testing](/en/05-statistics/06-hypothesis-testing/) |
| **MDE** | minimum detectable effect | set before the test; $n \propto 1/\text{MDE}^2$ | [sample size](/en/09-ab-testing/03-sample-size/) |

:::caution[A metric without context misleads]
Any number in the tables above is an **estimate from a sample**, not exact truth. "5% conversion" means a range (see [confidence interval](/en/05-statistics/05-confidence-intervals/)), and a "significant" A/B result doesn't yet mean the effect is [practically important](/en/09-ab-testing/06-analyzing-results/). Compute the metric — but look at the spread and effect size.
:::

## What's next

- [Product analytics](/en/08-product-analytics/01-key-metrics/) — product metrics in detail.
- [Unit economics](/en/08-product-analytics/02-unit-economics/) — how metrics add up to profit.
- [Statistics](/en/05-statistics/01-descriptive-stats/) — where the spread and interval formulas come from.
