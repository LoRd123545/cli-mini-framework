import { Cli } from '../src/index'

const userArgs = process.argv.slice(2)

const app = new Cli(userArgs)

app
  .scope(['container'])
  .command('run')
  .args([
    { name: 'image', required: true },
    { name: 'container-name', required: false, defaultValue: 'container' },
  ])
  .options([
    { name: 'opt1', hasValue: true },
    { name: 'switch1', hasValue: false },
  ])
  .end((args, options) => {
    console.log(args)
    console.log(options)
  })
