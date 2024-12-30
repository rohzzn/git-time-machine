#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import ora from 'ora';
import asciichart from 'asciichart';
import boxen from 'boxen';
import inquirer from 'inquirer';

program
  .name('git-time-machine')
  .description('Interactive git history visualization')
  .version('1.0.0')
  .argument('[repository]', 'GitHub repository URL or local path')
  .option('-d, --days <number>', 'Number of days to analyze', '30')
  .option('-b, --branch <name>', 'Branch to analyze', 'main')
  .parse(process.argv);

async function getGitHistory(repo, days, branch) {
  const spinner = ora('Fetching git history...').start();
  
  try {
    // Clone if remote repository
    if (repo && repo.startsWith('http')) {
      execSync(`git clone ${repo} temp_repo`);
      process.chdir('temp_repo');
    }

    // Get git log data
    const gitLog = execSync(
      `git log --pretty=format:"%h|%ad|%an|%s" --date=short --since="${days} days ago" ${branch}`,
      { encoding: 'utf-8' }
    ).split('\n');

    // Process log entries
    const commits = gitLog.map(line => {
      const [hash, date, author, message] = line.split('|');
      return { hash, date, author, message };
    });

    // Get commit activity data for graph
    const commitsByDate = commits.reduce((acc, commit) => {
      acc[commit.date] = (acc[commit.date] || 0) + 1;
      return acc;
    }, {});

    spinner.succeed('History fetched successfully!');
    return { commits, commitsByDate };

  } catch (error) {
    spinner.fail('Error fetching git history');
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  }
}

async function displayTimeMachine(commits, commitsByDate) {
  // Create activity graph
  const graphData = Object.values(commitsByDate);
  const graph = asciichart.plot(graphData, {
    height: 10,
    colors: [asciichart.blue]
  });

  console.log(boxen(chalk.blue('\n📊 Commit Activity\n\n') + graph + '\n', {
    padding: 1,
    borderStyle: 'round',
    borderColor: 'blue'
  }));

  // Interactive commit browser
  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View recent commits',
          'Show commit details',
          'Compare commits',
          'Exit'
        ]
      }
    ]);

    if (action === 'Exit') break;

    switch (action) {
      case 'View recent commits':
        console.log(chalk.blue('\nRecent Commits:'));
        commits.slice(0, 5).forEach(commit => {
          console.log(`${chalk.yellow(commit.hash)} ${commit.date} - ${commit.message}`);
        });
        break;

      case 'Show commit details':
        const { hash } = await inquirer.prompt([
          {
            type: 'input',
            name: 'hash',
            message: 'Enter commit hash:',
          }
        ]);
        try {
          const details = execSync(`git show ${hash} --stat`, { encoding: 'utf-8' });
          console.log(details);
        } catch (error) {
          console.error(chalk.red('Invalid commit hash'));
        }
        break;

      case 'Compare commits':
        const { hash1, hash2 } = await inquirer.prompt([
          {
            type: 'input',
            name: 'hash1',
            message: 'Enter first commit hash:',
          },
          {
            type: 'input',
            name: 'hash2',
            message: 'Enter second commit hash:',
          }
        ]);
        try {
          const diff = execSync(`git diff ${hash1} ${hash2} --stat`, { encoding: 'utf-8' });
          console.log(diff);
        } catch (error) {
          console.error(chalk.red('Invalid commit hashes'));
        }
        break;
    }
  }
}

async function main() {
  const options = program.opts();
  const repo = program.args[0];
  
  console.log(chalk.blue(boxen('🕰️  Git Time Machine', { padding: 1, borderStyle: 'double' })));
  
  const { commits, commitsByDate } = await getGitHistory(repo, options.days, options.branch);
  await displayTimeMachine(commits, commitsByDate);

  // Cleanup if we cloned a repo
  if (repo && repo.startsWith('http')) {
    execSync('rm -rf temp_repo');
  }
}

main().catch(error => {
  console.error(chalk.red(`\nError: ${error.message}`));
  process.exit(1);
});