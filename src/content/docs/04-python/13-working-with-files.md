---
title: Работа с файлами
description: "Чтение и запись файлов в pandas: CSV (encoding/sep/decimal), Excel с несколькими листами, JSON и json_normalize, Parquet, большие файлы chunksize."
sidebar:
  order: 13
---

:::tip[Коротко]
Данные приходят файлами: CSV, Excel, JSON, иногда Parquet. Главные грабли — **кодировка и разделитель в CSV**. Для больших файлов есть `chunksize` (читать частями) и Parquet (быстрый колоночный формат). Вложенный JSON разворачивается через `json_normalize`.
:::

## Зачем это нужно

90% выгрузок аналитик получает файлами. Уметь их корректно прочитать (особенно «сломанный» CSV из 1С или экспорт из чужой системы) — базовый навык, без которого анализ не начнётся.

## CSV: основные параметры

```python
df = pd.read_csv("data.csv",
                 sep=";",              # разделитель (часто ; в русских выгрузках)
                 encoding="utf-8",     # или "cp1251" для старых русских файлов
                 decimal=",",          # запятая как десятичный разделитель
                 parse_dates=["date"]) # сразу распарсить даты
```

:::caution[Кодировка и разделитель — источник 90% бед с CSV]
Кракозябры вместо русских букв → не та `encoding` (попробуй `cp1251` или `utf-8-sig`). Все данные в одном столбце → не тот `sep`. Числа стали текстом → десятичный разделитель `,` вместо `.` (укажи `decimal=","`). Открой файл в текстовом редакторе и посмотри, что внутри, прежде чем гадать.
:::

## Excel: несколько листов

```python
df = pd.read_excel("report.xlsx", sheet_name="Январь")   # конкретный лист
all_sheets = pd.read_excel("report.xlsx", sheet_name=None)  # dict всех листов

# запись нескольких листов в один файл
with pd.ExcelWriter("out.xlsx") as writer:
    jan.to_excel(writer, sheet_name="Январь", index=False)
    feb.to_excel(writer, sheet_name="Февраль", index=False)
```

Для `.xlsx` нужен пакет `openpyxl` (`pip install openpyxl`).

## JSON и вложенность

```python
df = pd.read_json("data.json")                  # плоский JSON

# вложенный JSON от API — разворачиваем
import json
raw = json.load(open("api.json"))
df = pd.json_normalize(raw, record_path="orders", meta=["user_id"])
```

`json_normalize` разворачивает вложенные структуры (списки внутри объектов) в плоскую таблицу — частая задача при работе с [API](/04-python/15-apis-and-scraping/).

## Parquet: для больших данных

```python
df.to_parquet("data.parquet")        # быстрый колоночный формат (нужен pyarrow)
df = pd.read_parquet("data.parquet")
```

Parquet в разы компактнее и быстрее CSV, хранит типы и не страдает от проблем кодировок. Стандарт для промежуточных данных и [облачных хранилищ](/11-modern-stack/01-cloud-dwh-overview/).

## Большие файлы: chunksize

Если файл не влезает в память — читаем порциями:

```python
total = 0
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    total += chunk["amount"].sum()      # обрабатываем по 100k строк
```

## Когда что

| Формат | Когда |
|--------|-------|
| CSV | универсальный обмен, выгрузки |
| Excel | отчёты для людей, несколько листов |
| JSON | ответы API, вложенные структуры |
| Parquet | большие объёмы, промежуточное хранение |

## Задачи для самопроверки

<details>
<summary>1. Русский CSV открылся кракозябрами, а все данные в одном столбце. Что проверить?</summary>

Два параметра: `encoding` (для старых русских файлов часто `cp1251` вместо `utf-8`) и `sep` (в русских выгрузках часто `;`, а не `,`). Плюс, возможно, `decimal=","`. Загляни в файл текстовым редактором, чтобы увидеть реальный разделитель и символы.

</details>

<details>
<summary>2. Файл на 10 ГБ не влезает в память. Как посчитать сумму столбца?</summary>

Читать частями через `chunksize`: цикл `for chunk in pd.read_csv(..., chunksize=100_000)` и суммировать по кускам. Либо перевести данные в Parquet и работать с колонкой выборочно.

</details>

## Что дальше

- [SQL из Python](/04-python/14-sql-from-python/) — данные не из файла, а прямо из базы.
- [API и скрейпинг](/04-python/15-apis-and-scraping/) — забрать данные из веба.
