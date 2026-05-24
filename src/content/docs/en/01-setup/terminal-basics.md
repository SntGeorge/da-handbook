---
title: Command line
description: "The minimal set of terminal commands for an analyst: navigation, files, viewing, grep and pipes."
sidebar:
  order: 5
---

:::tip[In short]
You need the terminal to run Python, Git and DB servers. An analyst gets by with ~15 commands: move around folders, view files, search by content, and chain commands with `|`. You don't need to become a sysadmin — you need the minimum.
:::

## Navigation and files

| Command | What it does |
|---------|--------------|
| `pwd` | show the current folder |
| `ls` | list files (`ls -la` — with hidden ones and details) |
| `cd folder` | go into a folder (`cd ..` — one level up) |
| `mkdir name` | create a folder |
| `cp a b` | copy a file |
| `mv a b` | move/rename |
| `rm file` | delete a file (`rm -r folder` — a folder) |

## Viewing content

| Command | What it does |
|---------|--------------|
| `cat file` | print the whole file |
| `head -n 20 file` | first 20 lines |
| `tail -n 20 file` | last 20 lines |
| `less file` | scroll a file (quit with `q`) |

## Search

```bash
grep "error" log.txt       # lines containing "error"
grep -ri "todo" .          # recursively, case-insensitive
find . -name "*.csv"       # find all csv in the folder tree
wc -l data.csv             # how many lines in the file
```

## Redirection and pipes

```bash
ls > files.txt             # write output to a file (overwrites)
ls >> files.txt            # append to the end
cat data.csv | grep "RU" | wc -l   # rows with RU and their count
```

The `|` ("pipe") symbol feeds one command's output into another's input — the foundation of terminal work.

:::note[bash / zsh / PowerShell]
macOS defaults to **zsh**, Linux usually to **bash** — the commands above work the same. On Windows the built-in **PowerShell** has different syntax; it's easier to install Git for Windows and use **Git Bash**, where the unix commands work.
:::

:::caution[rm doesn't ask twice]
`rm` deletes past the trash, with no confirmation and no recovery. Double-check the path, especially with `rm -r`. Never run `rm -rf /` or anything like it.
:::

## What's next

- [Git and GitHub](/en/01-setup/git-github/) — the main tool that lives in the terminal.
- [Installing Python](/en/01-setup/python-installation/) — checking versions also goes through the terminal.
