---
title: Virtual environments
description: "Why venv matters, how to create and activate an environment, requirements.txt and the difference from conda."
sidebar:
  order: 6
---

:::tip[In short]
A virtual environment is an isolated folder of packages for a single project. Without it, libraries from different projects clash on versions. The standard tool is the built-in **`venv`**: create it, activate it, install packages — and they live only in that project.
:::

## Why you need it

Project A wants pandas 1.5, project B wants pandas 2.2. If you install packages globally, they overwrite each other. A venv gives each project its own set of packages — no conflicts, no "it worked on my machine".

## Creating and activating

In the project folder:

```bash
python -m venv venv        # create an environment in the venv/ folder
```

Activate it:

```bash
# macOS / Linux
source venv/bin/activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1
```

After activation a `(venv)` prefix appears at the start of the line — meaning you're inside. Now `pip install pandas` installs the package only here. Exit with `deactivate`.

## requirements.txt

To freeze the package list and reproduce the environment on another machine:

```bash
pip freeze > requirements.txt        # save the current versions
pip install -r requirements.txt      # install from the file
```

Commit `requirements.txt` to Git — it's the recipe for the environment. The `venv/` folder itself should **not** go into Git (add it to `.gitignore`).

## venv vs conda

| | venv | conda |
|--|------|-------|
| Comes with | Python (built-in) | the Anaconda/Miniconda distribution |
| Installs | only Python packages | packages + non-Python (C libraries) |
| When | most analyst tasks | a heavy scientific stack, tricky builds |

`venv` is enough to start. conda helps if you hit packages that are hard to build via pip.

:::caution[Select the environment in your editor]
Created a venv — point [VS Code](/en/01-setup/ide-setup/) to its interpreter (`Python: Select Interpreter`). Otherwise the notebook uses the global Python and "won't see" the installed packages.
:::

## What's next

- [VS Code and Jupyter](/en/01-setup/ide-setup/) — connecting the environment to the editor.
- [Python for analysis](/en/04-python/01-python-basics-for-analyst/) — starting to write code.
