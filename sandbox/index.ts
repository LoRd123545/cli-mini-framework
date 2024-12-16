import { CliApp } from '../src/index'

const userArgs = process.argv.slice(2)

const app = new CliApp(userArgs)

app
  .scope(['container'])
  .command('start')
  .args([
    {
      name: 'containerName',
      required: true,
    },
    {
      name: 'containerImage',
      required: true,
    },
  ])
  .end((args) => {
    console.log(args)
    console.log('started container')
  })
