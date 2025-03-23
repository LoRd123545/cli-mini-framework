import { Cli } from '../src'

const app = new Cli('example', process.argv.slice(2))

app
  .scope(['scope1'])
  .command('command1')
  .arg('arg-1')
  .arg('arg-2')
  .optionalArg('opt-arg-1')
  .optionalArg('opt-arg-2')
  .optionalArg('opt-arg-3')
  .option('delete')
  .callback((args, opts) => {
    console.log(args)
    console.log(opts)

    console.log('scope 1 command 1')
  })

app
  .scope(['scope2'])
  .command('command1')
  .callback(() => console.log('scope 2 command 1'))

app.command('command').callback(() => console.log('command'))
