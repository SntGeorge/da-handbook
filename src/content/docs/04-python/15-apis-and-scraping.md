---
title: API и скрейпинг
description: "Получение данных из веба: библиотека requests (GET/POST, headers, params), парсинг JSON, Bearer-авторизация, BeautifulSoup, этика и rate limits."
sidebar:
  order: 15
---

:::tip[Коротко]
Данные из веба берут двумя способами: **API** (через `requests` — отдаёт готовый JSON, предпочтительный путь) и **скрейпинг** HTML (`BeautifulSoup` — когда API нет). Всегда уважай `robots.txt`, лимиты запросов (rate limits) и условия использования — иначе можно получить блокировку или нарушить закон.
:::

## Зачем это нужно

Не все данные лежат в базе: курсы валют, погода, открытые реестры, метрики из внешних сервисов. API и скрейпинг позволяют забрать их в анализ. API — цивилизованный способ, скрейпинг — крайний, когда API нет.

## requests: запрос к API

```python
import requests

r = requests.get("https://api.example.com/orders",
                 params={"country": "RU", "limit": 100},   # ?country=RU&limit=100
                 headers={"Accept": "application/json"})
r.raise_for_status()         # упасть, если статус не 2xx
data = r.json()              # распарсить JSON-ответ в dict/list
```

`GET` — забрать данные, `POST` — отправить (`requests.post(url, json={...})`).

## Из JSON в DataFrame

```python
import pandas as pd
df = pd.json_normalize(data["orders"])      # развернуть JSON в таблицу
```

Вложенные ответы разворачивает `json_normalize` (см. [работу с файлами](/04-python/13-working-with-files/)).

## Авторизация

Большинство API требуют токен. Чаще всего — заголовок `Authorization: Bearer`:

```python
headers = {"Authorization": f"Bearer {token}"}
r = requests.get(url, headers=headers)
```

:::caution[Токен — это секрет]
API-ключ/токен нельзя коммитить в репозиторий и светить в ноутбуке. Держи в переменной окружения (`os.environ["API_TOKEN"]`) или `.env` (добавленном в `.gitignore`). Утёкший токен = доступ к данным от твоего имени.
:::

## BeautifulSoup: парсинг HTML

Когда API нет, данные вытаскивают из HTML-страницы:

```python
from bs4 import BeautifulSoup

html = requests.get("https://example.com").text
soup = BeautifulSoup(html, "html.parser")
titles = [el.text for el in soup.select("h2.title")]   # CSS-селектор
```

Для простых таблиц часто хватает `pd.read_html(url)` — pandas сам найдёт `<table>` на странице.

## Этика и правила

:::caution[Скрейпь ответственно]
- **`robots.txt`** (`site.com/robots.txt`) — что владелец разрешает обходить. Уважай его.
- **Rate limits** — не долби сервер: делай паузы (`time.sleep`), ограничивай частоту. Иначе бан по IP.
- **Условия использования** — у многих сайтов скрейпинг запрещён договором; персональные данные защищены законом.
- **Сначала ищи API** — он легальнее, стабильнее и удобнее, чем парсинг вёрстки, которая меняется.
:::

## Задачи для самопроверки

<details>
<summary>1. Как безопасно передать API-токен в запрос?</summary>

Через заголовок: `headers={"Authorization": f"Bearer {token}"}`, а сам токен хранить в переменной окружения или `.env` (в `.gitignore`), не в коде. Так он не попадёт в репозиторий и историю git.

</details>

<details>
<summary>2. Сайт отдаёт данные и в JSON через API, и в HTML на странице. Что выбрать?</summary>

API. Он возвращает структурированный JSON (готов к `json_normalize`), стабильнее (вёрстка HTML меняется и ломает парсер) и обычно легальнее. Скрейпинг HTML — запасной вариант, когда API недоступен.

</details>

## Что дальше

- [Работа с файлами](/04-python/13-working-with-files/) — `json_normalize` для вложенных ответов.
- [Типичные паттерны](/04-python/16-common-patterns/) — собираем всё в рабочие пайплайны.
