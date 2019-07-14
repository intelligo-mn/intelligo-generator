import arg from 'arg';
import inquirer from 'inquirer';

import { createProject } from './intelligo-cli';

const defaultTemplate = 'messenger';
const defaultName = 'intelligo-bot';

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
    runInstall: args['--install'] || false,
    showVersion: args['--version'] || false,
    projectName: args._[0],
    template: args._[1],
  };
}

async function promptForMissingOptions(options) {

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
    projectName: options.projectName || answers.projectName,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}

export async function cli(args) {
  let parsedOptions = parseArgumentsIntoOptions(args);
  let options = await promptForMissingOptions(parsedOptions);
  await createProject(options);
}

// ...
