---
title: Installing Python
description: "Installing Python 3.12+ on macOS, Windows and Linux, checking the version, pip."
sidebar:
  order: 1
---

:::tip[In short]
Install **Python 3.12+** (any recent 3.x works). On macOS — via Homebrew, on Windows — with the official installer and the "Add to PATH" checkbox, on Linux it's usually already there. Check with `python --version` and `pip --version`.
:::

## Why 3.12+ specifically

Old versions (3.8 and below) no longer get updates, and fresh libraries require a new Python. Take the latest stable one — fewer compatibility problems with pandas and other packages.

## macOS

Via [Homebrew](https://brew.sh/) (recommended):

```bash
brew install python@3.12
```

Don't touch the system Python on macOS — it's there for the OS's needs.

## Windows

1. Download the installer from [python.org/downloads](https://www.python.org/downloads/).
2. On the first screen, tick **"Add python.exe to PATH"** — this is the most common source of beginner trouble.
3. Click "Install Now".

## Linux

Python is usually already installed. If not (Debian/Ubuntu):

```bash
sudo apt update && sudo apt install python3 python3-pip python3-venv
```

## Verify

```bash
python --version   # or python3 --version
pip --version
```

If you see `Python 3.12.x` — you're set.

:::caution[python vs python3]
On macOS/Linux the command is often called `python3`, while `python` may lead nowhere or to an old Python 2. If `python` doesn't work — use `python3` (and `pip3`).
:::

## What's next

- [VS Code and Jupyter](/en/01-setup/ide-setup/) — an editor for code and notebooks.
- [Virtual environments](/en/01-setup/virtual-environments/) — so projects don't clash on dependencies.
