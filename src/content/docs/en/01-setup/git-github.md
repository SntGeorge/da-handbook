---
title: Git and GitHub
description: "Git from scratch for an analyst: install, init/add/commit/push, working with GitHub and branches in plain words."
sidebar:
  order: 4
---

:::tip[In short]
**Git** is a version control system: it stores a project's change history so you can roll back and work together. **GitHub** is the cloud where that project lives and where you publish your pet project for your resume. The minimum an analyst actually needs: `add` → `commit` → `push`.
:::

## Why an analyst needs Git

Two reasons: (1) a GitHub portfolio is an almost mandatory line on a junior DA resume; (2) on a team, code and SQL queries live in a repository. You don't need to go deep — the basic cycle is enough.

## Installation

- **macOS**: `brew install git` (or it's already there — check `git --version`).
- **Windows**: download [Git for Windows](https://git-scm.com/download/win).
- **Linux**: `sudo apt install git`.

Introduce yourself to Git once:

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## The basic cycle

```bash
git init                 # create a repository in the current folder
git add .                # stage all changes for saving
git commit -m "First commit"   # save a snapshot with a message
git status               # what changed and isn't saved
git log --oneline        # commit history
```

`add` selects what goes into the snapshot; `commit` takes the snapshot itself with a description.

## GitHub: publish a project

1. Create an account at [github.com](https://github.com/) and make an empty repository (the **New** button).
2. Link your local folder to it and push:

```bash
git remote add origin https://github.com/USERNAME/REPO.git
git branch -M main
git push -u origin main
```

After that, every update is `git add .` → `git commit -m "..."` → `git push`.

:::note[SSH keys — to avoid typing a password]
GitHub no longer accepts a password for HTTPS push. Either use a token, or set up an [SSH key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) once — then push works without entering credentials.
:::

## Branches in plain words

A branch is a parallel line of work so you don't break the working version.

```bash
git checkout -b feature   # create a branch and switch to it
# ...edits, commits...
git checkout main         # switch back
git merge feature         # merge the changes into main
```

For a solo pet project you can live in a single `main` branch — branches matter more on a team.

:::caution[Don't commit junk]
Create a `.gitignore` file and add the virtual environment (`venv/`), data, and secrets (`.env`, keys) there. A committed password or API key is a common and dangerous mistake.
:::

## What's next

- [Command line](/en/01-setup/terminal-basics/) — Git runs in the terminal, so the basic commands help.
- [Pet project ideas](/en/12-career/09-pet-project-ideas/) — what to publish on GitHub.
