---
title: Event tracking
description: "Designing product-analytics events: what an event is, naming conventions, event vs user properties, tracking plan, when to log, anti-patterns."
sidebar:
  order: 7
---

:::tip[In short]
An event is a recorded user action (`order_completed`) with **properties** (amount, payment method). The quality of all product analytics is decided at this stage: bad taxonomy = garbage data forever. The main rules — a single **naming convention** and a pre-agreed **tracking plan**.
:::

## Why you need it

Amplitude, funnels, retention — all of it is computed **from events**. If events are named chaotically (`Login`, `log_in`, `userLoggedIn` mixed together) or you forgot to log a key action, the data can't be fixed after the fact. Event design is the foundation, and an analyst often designs it themselves.

## What an event and properties are

- **Event** — what happened: `product_viewed`, `add_to_cart`, `order_completed`.
- **Event properties** — details of the event: `price`, `category`, `payment_method`.
- **User properties** — attributes of the user: `plan`, `country`, `signup_date`.

| Type | Bound to | Example |
|------|----------|---------|
| Event property | a specific event | `order_completed` → `amount: 2500` |
| User property | the user as a whole | `plan: premium` |

## Naming conventions

:::caution[Pick one style and stick to it]
The most common trouble is a zoo of names: `Sign Up`, `signup`, `user_signed_up` for one action. Analytics falls apart. Agree on a single standard before launch:

- a single case and separator (often `snake_case`);
- the `object_action` format (`order_completed`, `cart_updated`) — readable and groupable;
- a single language (English), no spaces or emoji.
:::

## Tracking plan

A **tracking plan** is a document (usually a table) describing in advance: which events to log, with which properties, of what type, when they fire. Agreed between the analyst, PM and development **before** implementation. It's the contract that saves you from chaos and gaps.

| event | when | properties |
|-------|------|------------|
| `order_completed` | successful payment | `amount`, `currency`, `items_count` |
| `product_viewed` | opened a card | `product_id`, `category` |

## When to log, when not

- **Log** key path steps and business actions (registration, purchase, feature activation).
- **Don't log** everything "just in case": every click and scroll bloats the volume, costs money and drowns in noise.
- Think ahead: **what question** will this event help answer. No question — no event.

## Anti-patterns

- **Too-generic events**: one `button_click` with a name property instead of meaningful events — impossible to analyze.
- **PII in properties**: putting email, phone, name into properties — a privacy and legal violation. Log `user_id`, not personal data.
- **Logging "everything"**: data exists, meaning doesn't; you pay to store noise.
- **Changing an event's meaning after the fact** — breaks historical data.

<details>
<summary>1. A developer suggests one event `click` with a "what was clicked" property. What's the problem?</summary>

Too generic an event: everything dumps into one `click`, and meaningful analysis (funnels, conversions of specific actions) becomes painful. Better separate semantic events (`add_to_cart`, `checkout_started`) by the `object_action` scheme. A generic click event is a classic anti-pattern.

</details>

<details>
<summary>2. Can you put the user's email into an event's properties for convenience?</summary>

No. It's personal data (PII): storing it in events is legally risky (GDPR and the like) and insecure. Use an anonymized `user_id`, and keep personal data separately with access control. Logging PII in events is a serious anti-pattern.

</details>

## What's next

- [Amplitude](/en/08-product-analytics/08-amplitude/) — where these events turn into reports.
- [Mixpanel](/en/08-product-analytics/09-mixpanel/) — an alternative event-analytics platform.
