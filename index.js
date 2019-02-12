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

  if (!fs.existsSync("intelligo-bot")){
    fs.mkdirSync("intelligo-bot");
  }
  process.chdir('/intelligo-bot');
  fs.readdir('templates/',function(err,files){
      if(err) throw err;
      files.forEach(function(file){
        console.log('Copying '+file)
        fs.writeFile(flie, data, (err) => {
          if (err) throw err
    
          console.log('Copied '+file)
        })
      });

      console.log('Installing Dependencies...')

      startCommand('npm install')
  });
}

function startServer() {
  return startCommand('node --use_strict --harmony .',(error, stdout, stderr) => process.exit(1))
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
