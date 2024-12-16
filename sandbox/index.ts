import { CliApp } from '../src/index'

const userArgs = process.argv.slice(2)

const app = new CliApp(userArgs)

app
  .scope(['container'])
  .command('create')
  .args([
    {
      name: 'image-name',
      required: true,
    },
    {
      name: 'container-name',
      required: true,
    },
  ])
  .end((args) => {
    console.log(args)
    console.log('Container created!')
  })

app
  .scope(['container'])
  .command('start')
  .args([
    {
      name: 'container-name',
      required: true,
    },
  ])
  .end((args) => {
    console.log(args)
    console.log('Container started!')
  })

app
  .scope(['container'])
  .command('stop')
  .args([
    {
      name: 'container-name',
      required: true,
    },
  ])
  .end((args) => {
    console.log(args)
    console.log('Container stopped!')
  })

app
  .scope(['image'])
  .command('build')
  .args([
    {
      name: 'image-name',
      required: true,
    },
  ])
  .end((args) => {
    console.log(args)
    console.log('Image built!')
  })
