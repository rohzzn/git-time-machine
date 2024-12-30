#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import ora from 'ora';
import inquirer from 'inquirer';
import boxen from 'boxen';

// Cool ASCII banner
const banner = `
╭─────────────────────────────╮
│   🕰️  Git Time Machine      │
│      Version 1.0.0          │
╰─────────────────────────────╯
`;

const program = new Command();
program
  .name('git-time-machine')
  .description('Interactive git history visualization and analysis')
  .version('1.0.0')
  .argument('[repository]', 'GitHub repository URL or local path')
  .option('-d, --days <number>', 'Number of days to analyze', '30')
  .option('-b, --branch <name>', 'Branch to analyze', 'main')
  .option('-a, --author <email>', 'Filter by author email')
  .option('--detailed', 'Show detailed statistics')
  .parse(process.argv);

async function getGitInfo(repo) {
  const branches = execSync('git branch -r', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean)
    .map(b => b.trim());
  
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  
  const totalCommits = parseInt(execSync('git rev-list --count HEAD', { encoding: 'utf-8' }));
  
  const contributors = execSync('git shortlog -sn --all', { encoding: 'utf-8' })
    .split('\n')
    .filter(Boolean)
    .map(line => {
      const [commits, name] = line.trim().split('\t');
      return { name, commits: parseInt(commits) };
    });

  return { branches, currentBranch, totalCommits, contributors };
}

async function analyzeCommits(days) {
  const commitsPerDay = execSync(
    `git log --format=oneline --since="${days} days ago" | wc -l`,
    { encoding: 'utf-8' }
  ).trim();

  const filesChanged = execSync(
    'git diff --shortstat "@{1 month ago}"',
    { encoding: 'utf-8' }
  ).trim();

  const mostActiveFiles = execSync(
    'git log --pretty=format: --name-only | sort | uniq -c | sort -rg | head -n 5',
    { encoding: 'utf-8' }
  ).split('\n').filter(Boolean);

  return { commitsPerDay, filesChanged, mostActiveFiles };
}

async function interactiveMenu(repo) {
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'Show Repository Overview',
          'View Recent Commits',
          'Show Branch Information',
          'Analyze Code Changes',
          'View Contributors',
          'Exit'
        ]
      }
    ]);

    console.clear();
    console.log(chalk.blue(banner));

    switch (action) {
      case 'Show Repository Overview': {
        const spinner = ora('Fetching repository information...').start();
        const { totalCommits, currentBranch } = await getGitInfo(repo);
        const analysis = await analyzeCommits(program.opts().days);
        spinner.succeed('Repository information fetched!');

        console.log(boxen(
          chalk.white(`
Repository Stats:
────────────────
Total Commits: ${chalk.green(totalCommits)}
Current Branch: ${chalk.yellow(currentBranch)}
Recent Activity (${program.opts().days} days): ${chalk.green(analysis.commitsPerDay)} commits
${chalk.dim(analysis.filesChanged)}
`),
          { padding: 1, borderStyle: 'round', title: 'Overview', titleAlignment: 'center' }
        ));
        break;
      }

      case 'View Recent Commits': {
        const spinner = ora('Fetching recent commits...').start();
        const recentCommits = execSync(
          `git log --pretty=format:"%C(yellow)%h%Creset -%C(bold green)%d%Creset %s %C(dim)(%cr) %C(bold blue)<%an>%Creset" -n 10`,
          { encoding: 'utf-8' }
        );
        spinner.succeed('Recent commits fetched!');

        console.log(boxen(recentCommits, { 
          padding: 1, 
          borderStyle: 'round', 
          title: 'Recent Commits',
          titleAlignment: 'center'
        }));
        break;
      }

      case 'Show Branch Information': {
        const spinner = ora('Analyzing branches...').start();
        const { branches } = await getGitInfo(repo);
        spinner.succeed('Branch analysis complete!');

        console.log(boxen(
          branches.join('\n'),
          { padding: 1, borderStyle: 'round', title: 'Branches', titleAlignment: 'center' }
        ));
        break;
      }

      case 'Analyze Code Changes': {
        const spinner = ora('Analyzing code changes...').start();
        const { mostActiveFiles } = await analyzeCommits(program.opts().days);
        spinner.succeed('Analysis complete!');

        console.log(boxen(
          chalk.white('Most Active Files:\n' + '─'.repeat(20) + '\n' + 
          mostActiveFiles.map(file => chalk.dim(file)).join('\n')),
          { padding: 1, borderStyle: 'round', title: 'Code Analysis', titleAlignment: 'center' }
        ));
        break;
      }

      case 'View Contributors': {
        const spinner = ora('Fetching contributor information...').start();
        const { contributors } = await getGitInfo(repo);
        spinner.succeed('Contributor information fetched!');

        console.log(boxen(
          contributors.map(c => `${chalk.green(c.commits.toString().padEnd(6))} ${chalk.white(c.name)}`).join('\n'),
          { padding: 1, borderStyle: 'round', title: 'Contributors', titleAlignment: 'center' }
        ));
        break;
      }

      case 'Exit':
        return;
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: 'Press enter to continue...'
      }
    ]);
  }
}

async function main() {
  const options = program.opts();
  const repo = program.args[0];
  
  console.log(chalk.blue(banner));
  
  const spinner = ora('Initializing Git Time Machine...').start();
  
  try {
    if (repo && repo.startsWith('http')) {
      spinner.text = 'Cloning repository...';
      execSync(`git clone ${repo} temp_repo --quiet`);
      process.chdir('temp_repo');
    }

    spinner.succeed('Repository ready!');
    await interactiveMenu(repo);

    if (repo && repo.startsWith('http')) {
      execSync('rm -rf temp_repo');
    }

  } catch (error) {
    spinner.fail('Error occurred');
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red(`\nError: ${error.message}`));
  process.exit(1);
});