import { Cli } from '../src2'

import { Cli as OldCli } from '../src'

const app = new Cli(process.argv.slice(2))

app
  .scope(['container'])
  .command('run')
  .arg('container-name')
  .option('mode')
  .option('delete')
  .option('i')
  .callback((args, opts) => {
    console.log(args)
    console.log(opts)
    console.log('container run!')
  })

const oldApp = new OldCli(process.argv.slice(2))

oldApp
  .scope(['container'])
  .command('run')
  .args([{ name: 'container-name' }])
  .options([
    {
      name: 'mode',
    },
    {
      name: 'delete',
    },
    {
      name: 'i',
    },
  ])
  .end((args, opts, switches) => {
    console.log(args)
    console.log(opts)
    console.log(switches)
    console.log('container run!')
  })
