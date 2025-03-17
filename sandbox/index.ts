import { Cli } from '../src'

const app = new Cli(process.argv.slice(2))

app
  .scope([])
  .command('version')
  .callback((args, opts) => {
    console.log('v1')
  })

app
  .scope(['container'])
  .command('run')
  .arg('container-name')
  .option('delete')
  .callback((args, opts) => {
    console.log(`container ${args[0].value} run!`)
  })

app
  .scope(['container'])
  .command('delete')
  .arg('container-name')
  .callback((args, opts) => {
    console.log(`deleted container ${args[0].value}`)
  })