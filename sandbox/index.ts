import { Cli } from '../src'

const dockerClone = new Cli('example', process.argv.slice(2))

dockerClone
  .scope(['container'])
  .command('run')
  .arg('container-name')
  .optionalArg('opt-arg')
  .option('delete')
  .callback((args, opts) => {
    console.log('args: ', args)
    console.log('opts: ', opts)

    console.log('container run!')
  })
