import { Cli } from '../src2'

const app = new Cli(process.argv.slice(2))

app
  .scope([])
  .command('version')
  .callback((args, opts) => {
    console.log('v1')

    console.log(args, opts)
  })

app
  .scope(['container'])
  .command('run')
  .arg('container-name')
  .option('delete')
  .callback((args, opts) => {
    console.log('container run!')

    console.log(args, opts)
  })