#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { execSync } from 'child_process';
import ora from 'ora';
import inquirer from 'inquirer';
import boxen from 'boxen';
import os from 'os';
import path from 'path';
import fs from 'fs';

const program = new Command();

// Use system temp directory instead of current directory
const getTempDir = () => {
  const tempBase = path.join(os.tmpdir(), 'git-time-machine');
  const tempDir = path.join(tempBase, `repo-${Date.now()}`);
  
  // Create base temp directory if it doesn't exist
  if (!fs.existsSync(tempBase)) {
    fs.mkdirSync(tempBase, { recursive: true });
  }
  
  // Create unique directory for this run
  fs.mkdirSync(tempDir, { recursive: true });
  
  return tempDir;
};

// Clean up function
const cleanup = (tempDir) => {
  try {
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  } catch (error) {
    console.warn(chalk.yellow('Note: Temporary files may need manual cleanup at:', tempDir));
  }
};

// ... rest of your existing code ...

async function main() {
  const options = program.opts();
  const repo = program.args[0];
  let tempDir = '';
  
  console.log(chalk.blue(banner));
  
  const spinner = ora('Initializing Git Time Machine...').start();
  
  try {
    if (repo && repo.startsWith('http')) {
      tempDir = getTempDir();
      spinner.text = 'Cloning repository...';
      execSync(`git clone ${repo} "${tempDir}" --quiet`);
      process.chdir(tempDir);
    }

    spinner.succeed('Repository ready!');
    await interactiveMenu(repo);

  } catch (error) {
    spinner.fail('Error occurred');
    console.error(chalk.red(`\nError: ${error.message}`));
    process.exit(1);
  } finally {
    // Clean up temp directory
    if (tempDir) {
      cleanup(tempDir);
    }
  }
}

main().catch(error => {
  console.error(chalk.red(`\nError: ${error.message}`));
  process.exit(1);
});