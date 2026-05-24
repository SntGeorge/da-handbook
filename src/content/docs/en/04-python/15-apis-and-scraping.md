---
title: APIs and scraping
description: "Getting data from the web: the requests library (GET/POST, headers, params), parsing JSON, Bearer auth, BeautifulSoup, ethics and rate limits."
sidebar:
  order: 15
---

:::tip[In short]
Web data is fetched two ways: an **API** (via `requests` — returns ready JSON, the preferred path) and **scraping** HTML (`BeautifulSoup` — when there's no API). Always respect `robots.txt`, rate limits and terms of use — otherwise you risk a block or breaking the law.
:::

## Why you need it

Not all data is in a database: exchange rates, weather, open registries, metrics from external services. APIs and scraping let you pull them into analysis. An API is the civilized way; scraping is the last resort when there's no API.

## requests: an API call

```python
import requests

r = requests.get("https://api.example.com/orders",
                 params={"country": "RU", "limit": 100},   # ?country=RU&limit=100
                 headers={"Accept": "application/json"})
r.raise_for_status()         # raise if the status isn't 2xx
data = r.json()              # parse the JSON response into dict/list
```

`GET` — fetch data, `POST` — send (`requests.post(url, json={...})`).

## From JSON to a DataFrame

```python
import pandas as pd
df = pd.json_normalize(data["orders"])      # unfold JSON into a table
```

Nested responses are unfolded by `json_normalize` (see [working with files](/en/04-python/13-working-with-files/)).

## Authorization

Most APIs require a token. Most often — the `Authorization: Bearer` header:

```python
headers = {"Authorization": f"Bearer {token}"}
r = requests.get(url, headers=headers)
```

:::caution[A token is a secret]
An API key/token must not be committed to the repository or exposed in a notebook. Keep it in an environment variable (`os.environ["API_TOKEN"]`) or a `.env` (added to `.gitignore`). A leaked token = access to data in your name.
:::

## BeautifulSoup: parsing HTML

When there's no API, data is extracted from an HTML page:

```python
from bs4 import BeautifulSoup

html = requests.get("https://example.com").text
soup = BeautifulSoup(html, "html.parser")
titles = [el.text for el in soup.select("h2.title")]   # a CSS selector
```

For simple tables `pd.read_html(url)` is often enough — pandas finds the `<table>` on the page itself.

## Ethics and rules

:::caution[Scrape responsibly]
- **`robots.txt`** (`site.com/robots.txt`) — what the owner allows crawling. Respect it.
- **Rate limits** — don't hammer the server: add pauses (`time.sleep`), limit frequency. Otherwise an IP ban.
- **Terms of use** — many sites forbid scraping by contract; personal data is protected by law.
- **Look for an API first** — it's more legal, more stable and more convenient than parsing markup that changes.
:::

## Practice tasks

<details>
<summary>1. How to safely pass an API token into a request?</summary>

Via a header: `headers={"Authorization": f"Bearer {token}"}`, with the token itself stored in an environment variable or `.env` (in `.gitignore`), not in code. That way it won't get into the repository and git history.

</details>

<details>
<summary>2. A site serves data both as JSON via an API and as HTML on the page. What to choose?</summary>

The API. It returns structured JSON (ready for `json_normalize`), is more stable (HTML markup changes and breaks the parser) and is usually more legal. HTML scraping is a fallback when an API isn't available.

</details>

## What's next

- [Working with files](/en/04-python/13-working-with-files/) — `json_normalize` for nested responses.
- [Common patterns](/en/04-python/16-common-patterns/) — assembling it all into working pipelines.
