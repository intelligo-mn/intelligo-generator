#!/usr/bin/env node

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const program = require('commander')
const readline = require('readline')
const util = require('util')

const MODE_0666 = parseInt('0666', 8)
const MODE_0755 = parseInt('0755', 8)

const TEMPLATE_DIR = path.join(__dirname, '.', 'templates')
const VERSION = require('./package').version

let _exit = process.exit

process.exit = exit

around(program, 'optionMissingArgument', function (fn, args) {
  program.outputHelp()
  fn.apply(this, args)
  return { args: [], unknown: [] }
})

before(program, 'outputHelp', function () {
  // track if help was shown for unknown option
  this._helpShown = true
})

before(program, 'unknownOption', function () {
  // allow unknown options if help was shown, to prevent trailing error
  this._allowUnknownOption = this._helpShown

  // show help if not yet shown
  if (!this._helpShown) {
    program.outputHelp()
  }
})

program
  .name('intelligo')
  .version(VERSION, '    --version')
  .usage('[dir]')
  .parse(process.argv)

if (!exit.exited) {
  main()
}
/**
 * Install an around function; AOP.
 */

function around(obj, method, fn) {
  let old = obj[method]

  obj[method] = function () {
    let args = new Array(arguments.length)
    for (let i = 0; i < args.length; i++) args[i] = arguments[i]
    return fn.call(this, old, args)
  }
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
  let old = obj[method]

  obj[method] = function () {
    fn.call(this)
    old.apply(this, arguments)
  }
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm(msg, callback) {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.question(msg, function (input) {
    rl.close()
    callback(/^y|yes|ok|true$/i.test(input))
  })
}

/**
 * Copy file from template directory.
 */

function copyTemplate(from, to) {
  write(to, fs.readFileSync(path.join(TEMPLATE_DIR, from), 'utf-8'))
}

/**
 * Create bot at the given directory.
 *
 * @param {string} name
 * @param {string} dir
 */

function createBotApp(name, dir) {
  console.log()

  // Package
  const pkg = {
    name: name,
    version: '0.0.0',
    private: true,
    scripts: {
      start: 'node index.js'
    },
    dependencies: {
      'config': '~3.0.1',
      'express': '~4.16.1',
      'intelligo': '^0.8.7'
    }
  }

  if (dir !== '.') {
    mkdir(dir, '.')
  }

  mkdir(dir, 'config')

  copyTemplate('config/default.json', path.join(dir, 'config/default.json'))
  copyTemplate('gitignore_temp', path.join(dir, '.gitignore'))
  copyTemplate('index.js', path.join(dir, 'index.js'))

  write(path.join(dir, 'package.json'), JSON.stringify(pkg, null, 2) + '\n')

  const prompt = '$'

  if (dir !== '.') {
    console.log()
    console.log('   change directory:')
    console.log('     %s cd %s', prompt, dir)
  }

  console.log()
  console.log('   install dependencies:')
  console.log('     %s npm install', prompt)
  console.log()
  console.log('   run the app:')

  console.log('     %s npm start', prompt)


  console.log()
}

/**
 * Create an app name from a directory path, fitting npm naming requirements.
 *
 * @param {String} pathName
 */

function createAppName(pathName) {
  return path.basename(pathName)
    .replace(/[^A-Za-z0-9.-]+/g, '-')
    .replace(/^[-_.]+|-+$/g, '')
    .toLowerCase()
}

/**
 * Check if the given directory `dir` is empty.
 *
 * @param {String} dir
 * @param {Function} fn
 */

function emptyDirectory(dir, fn) {
  fs.readdir(dir, function (err, files) {
    if (err && err.code !== 'ENOENT') throw err
    fn(!files || !files.length)
  })
}

/**
 * Main program.
 */

function main() {
  // Path
  let destinationPath = program.args.shift() || '.'

  // App name
  let appName = createAppName(path.resolve(destinationPath)) || 'intelligo-bot'

  // Generate application
  emptyDirectory(destinationPath, function (empty) {
    if (empty || program.force) {
      createBotApp(appName, destinationPath)
    } else {
      confirm('destination is not empty, continue? [y/N] ', function (ok) {
        if (ok) {
          process.stdin.destroy()
          createBotApp(appName, destinationPath)
        } else {
          console.error('aborting')
          exit(1)
        }
      })
    }
  })
}

/**
 * Make the given dir relative to base.
 *
 * @param {string} base
 * @param {string} dir
 */

function mkdir(base, dir) {
  let loc = path.join(base, dir)

  console.log('   \x1b[36mcreate\x1b[0m : ' + loc + path.sep)
  mkdirp.sync(loc, MODE_0755)
}

/**
 * Generate a callback function for commander to warn about renamed option.
 *
 * @param {String} originalName
 * @param {String} newName
 */

function renamedOption(originalName, newName) {
  return function (val) {
    warning(util.format("option `%s' has been renamed to `%s'", originalName, newName))
    return val
  }
}
function exit(code) {
  // flush output for Node.js Windows pipe bug
  // https://github.com/joyent/node/issues/6247 is just one bug example
  // https://github.com/visionmedia/mocha/issues/333 has a good discussion
  function done() {
    if (!(draining--)) _exit(code)
  }

  let draining = 0
  let streams = [process.stdout, process.stderr]

  exit.exited = true

  streams.forEach(function (stream) {
    // submit empty write request and wait for completion
    draining += 1
    stream.write('', done)
  })

  done()
}
/**
 * Display a warning similar to how errors are displayed by commander.
 *
 * @param {String} message
 */

function warning(message) {
  console.error()
  message.split('\n').forEach(function (line) {
    console.error('  warning: %s', line)
  })
  console.error()
}

/**
 * echo str > file.
 *
 * @param {String} file
 * @param {String} str
 */

function write(file, str, mode) {
  fs.writeFileSync(file, str, { mode: mode || MODE_0666 })
  console.log('   \x1b[36mcreate\x1b[0m : ' + file)
}
