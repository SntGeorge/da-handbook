---
title: VS Code and Jupyter
description: "Installing VS Code, the must-have extensions for an analyst, and working with Jupyter notebooks."
sidebar:
  order: 2
---

:::tip[In short]
**VS Code** is a free editor where an analyst writes both Python scripts and Jupyter notebooks in one window. Install the editor itself plus the **Python** and **Jupyter** extensions — and you can open `.ipynb` files right inside it.
:::

## Installing VS Code

Download from [code.visualstudio.com](https://code.visualstudio.com/) and install like a normal app. Free, available for all OSes.

## Must-have extensions

Open the Extensions panel (`Cmd/Ctrl + Shift + X`) and install:

| Extension | What for |
|-----------|----------|
| **Python** (Microsoft) | Running, debugging, choosing the interpreter |
| **Jupyter** (Microsoft) | `.ipynb` notebooks right in the editor |
| **Pylance** | Autocomplete and type checking (comes with Python) |

## Jupyter in VS Code

Nothing extra to install — the Jupyter extension pulls in the kernel. If you run a notebook for the first time, VS Code will offer to install the package:

```bash
pip install jupyter
```

Create a file with the `.ipynb` extension, open it — pick a Python interpreter in the top right, and you can run cells (`Shift + Enter`).

:::note[Choosing the interpreter]
If you use a [virtual environment](/en/01-setup/virtual-environments/), don't forget to select its interpreter: `Cmd/Ctrl + Shift + P` → "Python: Select Interpreter". Otherwise the venv's libraries won't be picked up.
:::

## Alternative: JupyterLab

If you want a pure notebook interface without an editor:

```bash
pip install jupyterlab
jupyter lab
```

It opens in the browser. For most tasks VS Code is more convenient (code + notebooks + terminal in one place), but it's a matter of taste.

## What's next

- [PostgreSQL and DBeaver](/en/01-setup/postgresql-dbeaver/) — a database for SQL practice.
- [Virtual environments](/en/01-setup/virtual-environments/) — isolating the project's dependencies.
