# Git Time Machine

An interactive CLI tool for visualizing git repository history with beautiful ASCII charts and an easy-to-use interface.

## Installation

```bash
npx git-time-machine [repository-url]
```
Or install globally:
```
npm install -g git-time-machine-cli
git-time-machine [repository-url]
```

## Features

- Visual commit activity graph
- Interactive commit browser
- Commit comparison
- Detailed commit information
- Support for both remote and local repositories

## Options

- -d, --days <number> - Number of days to analyze (default: 30)
- -b, --branch <name> - Branch to analyze (default: main)

## Examples

```bash
# Analyze a GitHub repository
npx git-time-machine https://github.com/username/repo

# Analyze last 60 days
npx git-time-machine https://github.com/username/repo -d 60

# Analyze specific branch
npx git-time-machine https://github.com/username/repo -b develop

```


