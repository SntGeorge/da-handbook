---
title: Clustering
description: "Clustering: k-means and the elbow method, DBSCAN for dense clusters, hierarchical, the silhouette metric, use in customer segmentation."
sidebar:
  order: 6
---

:::tip[In short]
Clustering is the analyst's main [unsupervised](/en/10-ml-basics/02-supervised-vs-unsupervised/) task: split objects into groups of similar ones **without predefined labels**. The workhorse is **k-means** (you set the number of clusters k, chosen by the elbow method). The main use is customer segmentation, complementing [RFM](/en/08-product-analytics/06-rfm-analysis/).
:::

## Why you need it

"What types of users do we have?" — when segments aren't known in advance, clustering finds them. The result is the basis for personalization, targeting and product decisions about "who we're even building for".

## k-means

The most common algorithm: splits data into **k** clusters, minimizing the distance of points to their cluster's center.

1. Set the number of clusters k.
2. The algorithm iteratively moves centers and reassigns points.
3. You get k groups with centroids.

```python
from sklearn.cluster import KMeans
km = KMeans(n_clusters=4, random_state=42).fit(X_scaled)
labels = km.labels_
```

:::caution[k-means needs scaling and k in advance]
Two catches: (1) the algorithm computes distances, so features must be [scaled](/en/10-ml-basics/07-feature-engineering/) (otherwise "age" and "income in dollars" aren't comparable); (2) k is set **before** running. k is chosen by the **elbow method**: plot the error (inertia) across different k and take the "elbow" — the point after which improvement sharply slows.
:::

## DBSCAN

Density-based clustering: it groups densely located points and marks isolated ones as **noise/outliers**. Pros — no need to set k and it finds clusters of arbitrary shape. Con — sensitive to density parameters. Good when clusters are uneven and there are outliers.

## Hierarchical clustering

Builds a **tree** of nested clusters (a dendrogram): you can "cut" it at the needed level and get any number of groups. It visually shows the proximity structure but is slower on large data.

## The silhouette metric

Since there are no labels, quality is assessed indirectly. The **silhouette score** (from −1 to 1) shows how tightly points sit in their cluster and how far from others:

- closer to 1 — clusters are clear and separated;
- around 0 — clusters overlap;
- below 0 — points are probably in the wrong clusters.

It helps compare different k and algorithms, but the final word is the **meaningfulness** of the clusters for the business.

## Use in segmentation

Clustering by behavior (frequency, check, activity) yields segments that aren't obvious in advance. It's a machine complement to manual [RFM](/en/08-product-analytics/06-rfm-analysis/): RFM cuts by fixed rules, k-means finds groups from the data itself.

## Practice tasks

<details>
<summary>1. How to choose the number of clusters k for k-means?</summary>

The elbow method: run k-means for different k, plot inertia (total distance to centers) and look for the "elbow" — the k after which improvement sharply slows. Additionally look at silhouette and, above all, the meaningfulness of the clusters for the task. k is set before running, so tuning is mandatory.

</details>

<details>
<summary>2. Before k-means the features "age" (0–100) and "income" (0–1,000,000) weren't scaled. What happens?</summary>

Income, with its huge range, completely "overpowers" age in distance computation — clusters form almost only by income. k-means is sensitive to scale, so features must be brought to a common scale (StandardScaler/MinMax) before clustering.

</details>

## What's next

- [Feature engineering](/en/10-ml-basics/07-feature-engineering/) — scaling and preparing features.
- [RFM segmentation](/en/08-product-analytics/06-rfm-analysis/) — rule-based segmentation as an alternative.
