import arg from 'arg';
import inquirer from 'inquirer';

import { createProject } from './intelligo-cli';

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '--version': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
      '-v': '--version',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    projectName: args._[0],
    runInstall: args['--install'] || false,
    showVersion: args['--version'] || false,
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = 'messenger';
  const defaultName = 'intelligo-bot';

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  if (options.showVersion) {
    return {
      ...options,
      version: true,
    };
  }

  const questions = [];

  if (!options.projectName) {
    questions.push({
      type: 'input',
      name: 'projectName',
      message: 'What name would you like to use for the new project?',
      default: defaultName,
    });
  }

  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose which bot template to use',
      choices: ['messenger', 'slack'],
      default: defaultTemplate,
    });
  }

  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Should a git be initialized?',
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
    projectName: options.projectName || answers.projectName,
  };
}

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  await createProject(options);
}

// ...
