---
title: Randomization
description: "Randomization in A/B: the randomization unit (user/session/device), stratification, hashing for reproducibility, group balance checks."
sidebar:
  order: 4
---

:::tip[In short]
Randomization is the heart of an A/B test. The key decision is the **randomization unit**: most often the user (not the session), otherwise one person lands in both groups and the result breaks. The split is done by **deterministic hashing** of the ID, and group balance is checked before and after.
:::

## Why you need it

It's exactly the random split that makes groups comparable and [turns correlation into causation](/en/09-ab-testing/01-fundamentals/). A randomization mistake (wrong unit, group skew) invalidates the whole test, no matter how carefully you compute the statistics afterward.

## What to randomize by (the unit)

| Unit | When |
|------|------|
| **User** | by default — one experience per person across all sessions |
| **Session** | if the effect is within a session and switching doesn't confuse |
| **Device / cookie** | when there's no login (anonymous) |
| **Cluster** (city, team) | for [network effects](/en/09-ab-testing/01-fundamentals/) |

:::caution[Session randomization often breaks the test]
If you split by session, one user sees variant A on Monday and B on Tuesday. They "contaminate" both groups and get confused themselves (now the old interface, now the new). For most product tests the unit is the **user**: one person = one stable variant for the whole test.
:::

## Hashing for reproducibility

The group is determined **deterministically**: `hash(user_id + test_name) % 100` → a stable number 0–99 by which the user always lands in the same group.

- **Reproducible**: the same user is always in one group (doesn't "jump" between visits).
- **Salt from the test name** (`+ test_name`): in different tests the split is independent, not the same people forever in "B".

## Stratification

To split important segments evenly, you split **within strata** (platform, country, new/old): first break into strata, then randomize within each. This reduces variance and removes the risk that, say, all iOS users land in one group by chance. Related to [sampling in statistics](/en/05-statistics/04-clt-and-sampling/).

## Balance checks

- **Before the test (A/A test)** — run two identical groups with no change: if the metric already differs "significantly", randomization or the metric is broken.
- **During/after** — check that the group shares match the design (50/50). A sharp divergence is [SRM](/en/09-ab-testing/07-common-pitfalls/), a sign of a split bug.
- Verify that the distribution of key attributes (platform, geo) is similar across groups.

## Practice tasks

<details>
<summary>1. Why do people usually randomize by user, not by session?</summary>

So one person gets the same variant across all visits. Splitting by session, the user lands in A then B — contaminating both groups and seeing a jumping interface, which distorts behavior and the result. The "user" unit gives a clean, stable experience.

</details>

<details>
<summary>2. Why add the test name to the hash when determining the group?</summary>

So the split is independent across tests. If you hash only `user_id`, the same users will always be in "group B" across all experiments, accumulating a systematic skew. Salting with the test name makes each test's split standalone.

</details>

## What's next

- [Running the test](/en/09-ab-testing/05-running-test/) — sanity checks and monitoring.
- [Common pitfalls](/en/09-ab-testing/07-common-pitfalls/) — SRM and group skew.
