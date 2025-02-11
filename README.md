# Git Time Machine

🕰️ An elegant and powerful CLI tool for visualizing git repository history with real-time analysis and beautiful formatting.


[Live Site](https://www.npmjs.com/package/git-time-machine)


## ✨ What's New in 2.0

- 🎨 Beautiful new interface with interactive menus
- 📊 Enhanced repository analytics
- 🔍 Detailed contributor insights
- 📈 Code change statistics
- 🌳 Comprehensive branch analysis
- ⚡ Improved performance

## 🚀 Installation

```bash
npx git-time-machine https://github.com/username/repository
```

Or install globally:

```bash
npm install -g git-time-machine
git-time-machine https://github.com/username/repository
```

## 🎯 Features

### Repository Overview
- Total commit count
- Recent activity analysis
- File change statistics
- Current branch status

### Commit Analysis
- Detailed commit history
- Commit patterns
- Author contributions
- Time-based insights

### Branch Information
- Complete branch listing
- Branch comparison
- Active branch details

### Code Changes
- Most active files
- Change frequency
- Impact analysis
- File modification stats

### Contributor Stats
- Contribution leaderboard
- Author activity
- Time-based metrics

## 🛠️ Usage

Basic usage:
```bash
git-time-machine https://github.com/username/repository
```

### Options

```bash
Options:
  -d, --days <number>    Number of days to analyze (default: 30)
  -b, --branch <name>    Branch to analyze (default: main)
  -a, --author <email>   Filter by author email
  --detailed            Show detailed statistics
  -h, --help           Display help for command
```

### Examples

Analyze last 60 days:
```bash
git-time-machine https://github.com/username/repo -d 60
```

Analyze specific branch:
```bash
git-time-machine https://github.com/username/repo -b develop
```

Filter by author:
```bash
git-time-machine https://github.com/username/repo -a "user@example.com"
```

## 🖥️ Interactive Menu

Navigate through different views:
1. Repository Overview
2. Recent Commits
3. Branch Information
4. Code Changes Analysis
5. Contributor Statistics

## 🌟 Output Examples

```
╭─────────────────────────────╮
│   🕰️  Git Time Machine      │
│      Version 2.0.0          │
╰─────────────────────────────╯

Repository Stats:
────────────────
Total Commits: 156
Current Branch: main
Recent Activity (30 days): 45 commits
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/rohzzn/git-time-machine/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 🙏 Acknowledgments

- Inspired by the need for better git visualization
- Built with Node.js and modern CLI tools
- Special thanks to all contributors

## 🔗 Links

- [NPM Package](https://www.npmjs.com/package/git-time-machine)
- [GitHub Repository](https://github.com/rohzzn/git-time-machine)
- [Bug Reports](https://github.com/rohzzn/git-time-machine/issues)

---

<div align="center">
Made with ❤️ by Rohan Pothuru
</div>
