#!/usr/bin/env node
const fs = require('fs')

const program = require('commander')
const childProcess = require('child_process')
const port = process.env.port || 3000
const pjson = require('./package.json')

function startCommand(command, callback) {
  const child = childProcess.exec(command, callback)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

function init() {

  console.log('Creating new bot...')

  fs.readFile(__dirname + '/templates/index.js', (err, data) => {
    if (err) throw err

    console.log('Copying index.js...')

    fs.writeFile('index.js', data, (err) => {
      if (err) throw err

      console.log('Copied index.js...')
    })
  })

  fs.readFile(__dirname + '/templates/package.json', (err, data) => {
    if (err) throw err

    console.log('Copying Package.json...')

    fs.writeFile('package.json', data, (err) => {
      if (err) throw err

      console.log('Copied Package.json...')
      console.log('Installing Dependencies...')

      startCommand('npm install')
    })
  })
}

function startServer() {
  return startCommand('node --use_strict --harmony .',(error, stdout, stderr) => process.exit(1))
}

function console_out(rl, msg) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  console.log(msg)
  rl.prompt(true)
}

program
  .version(pjson.version)

program
  .command('init')
  .action(() => init())

program
  .command('start')
  .action(() => {
    startServer()
    console.log(`Server is running on http://localhost: ${port}`)
  })

program
  .action((cmd, env) => program.outputHelp())

program.parse(process.argv)
