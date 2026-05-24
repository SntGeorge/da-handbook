---
title: Git и GitHub
description: "Git с нуля для аналитика: установка, init/add/commit/push, работа с GitHub и ветками простыми словами."
sidebar:
  order: 4
---

:::tip[Коротко]
**Git** — система версий: хранит историю изменений проекта, чтобы можно было откатиться и работать вместе. **GitHub** — облако, где этот проект лежит и куда ты выкладываешь pet-проект для резюме. Минимум, который реально нужен аналитику: `add` → `commit` → `push`.
:::

## Зачем аналитику Git

Две причины: (1) портфолио на GitHub — почти обязательный пункт резюме junior DA; (2) в команде код и SQL-запросы хранят в репозитории. Глубоко погружаться не нужно — хватит базового цикла.

## Установка

- **macOS**: `brew install git` (или уже стоит — проверь `git --version`).
- **Windows**: скачай [Git for Windows](https://git-scm.com/download/win).
- **Linux**: `sudo apt install git`.

Один раз представься Git'у:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Базовый цикл

```bash
git init                 # создать репозиторий в текущей папке
git add .                # подготовить все изменения к сохранению
git commit -m "Первый коммит"   # сохранить снимок с подписью
git status               # что изменилось и не сохранено
git log --oneline        # история коммитов
```

`add` отбирает, что попадёт в снимок; `commit` делает сам снимок с описанием.

## GitHub: выложить проект

1. Заведи аккаунт на [github.com](https://github.com/) и создай пустой репозиторий (кнопка **New**).
2. Свяжи локальную папку с ним и отправь:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

Дальше каждое обновление — `git add .` → `git commit -m "..."` → `git push`.

:::note[SSH-ключи — чтобы не вводить пароль]
GitHub больше не принимает пароль для push по HTTPS. Либо используй токен, либо настрой [SSH-ключ](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) один раз — тогда push идёт без ввода учёток.
:::

## Ветки на пальцах

Ветка — параллельная линия работы, чтобы не ломать рабочую версию.

```bash
git checkout -b feature   # создать ветку и перейти в неё
# ...правки, коммиты...
git checkout main         # вернуться
git merge feature         # влить изменения в main
```

Для соло pet-проекта можно жить в одной ветке `main` — ветки нужнее в команде.

:::caution[Не коммить лишнее]
Создай файл `.gitignore` и внеси туда виртуальное окружение (`venv/`), данные, секреты (`.env`, ключи). Закоммиченный пароль или API-ключ — частая и опасная ошибка.
:::

## Что дальше

- [Командная строка](/01-setup/terminal-basics/) — Git работает в терминале, полезно знать базовые команды.
- [Идеи pet-проектов](/12-career/09-pet-project-ideas/) — что выложить на GitHub.
