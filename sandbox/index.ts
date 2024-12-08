import { CliApp } from '../src/index'

const userArgs = process.argv.slice(2)

const app = new CliApp(userArgs)

app
  .scope(['container'])
  .command('start')
  .end((args) => {
    console.log(args)
    console.log('started container')
  })

app
  .scope(['container'])
  .command('stop')
  .end(() => {
    console.log('stopped container')
  })
