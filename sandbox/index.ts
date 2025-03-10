import { Cli } from '../src2'

const app = new Cli(process.argv.slice(2))

app
  .scope([])
  .command('version')
  .arg('arg1')
  .callback((args, opts) => {
    console.log('version')

    console.log(args, opts)
  })

app
  .scope([])
  .command('command1')
  .arg('arg1')
  .arg('arg2')
  .arg('arg3')
  .callback((args, opts) => {
    console.log('command1')

    console.log(args, opts)
  })

app
  .scope([])
  .command('command2')
  .arg('arg1')
  .arg('arg2')
  .option('opt1')
  .callback((args, opts) => {
    console.log('command2')

    console.log(args, opts)
  })