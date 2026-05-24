---
title: Установка Python
description: "Установка Python 3.12+ на macOS, Windows и Linux, проверка версии, pip."
sidebar:
  order: 1
---

:::tip[Коротко]
Поставь **Python 3.12+** (любая свежая 3.x подойдёт). На macOS — через Homebrew, на Windows — официальным установщиком с галочкой «Add to PATH», на Linux он обычно уже есть. Проверка — `python --version` и `pip --version`.
:::

## Зачем именно 3.12+

Старые версии (3.8 и ниже) уже не получают обновлений, а свежие библиотеки требуют новый Python. Бери последнюю стабильную — меньше проблем с совместимостью pandas и прочих пакетов.

## macOS

Через [Homebrew](https://brew.sh/) (рекомендуется):

```bash
brew install python@3.12
```

Системный Python в macOS трогать не стоит — он для нужд ОС.

## Windows

1. Скачай установщик с [python.org/downloads](https://www.python.org/downloads/).
2. На первом экране поставь галочку **«Add python.exe to PATH»** — это самый частый источник проблем у новичков.
3. Жми «Install Now».

## Linux

Обычно Python уже стоит. Если нет (Debian/Ubuntu):

```bash
sudo apt update && sudo apt install python3 python3-pip python3-venv
```

## Проверка

```bash
python --version   # или python3 --version
pip --version
```

Видишь `Python 3.12.x` — всё готово.

:::caution[python vs python3]
На macOS/Linux команда часто называется `python3`, а `python` может вести в никуда или в старый Python 2. Если `python` не работает — используй `python3` (и `pip3`).
:::

## Что дальше

- [VS Code и Jupyter](/01-setup/ide-setup/) — редактор для кода и ноутбуков.
- [Виртуальные окружения](/01-setup/virtual-environments/) — чтобы проекты не конфликтовали зависимостями.
