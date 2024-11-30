import { Switch } from './types'

import { isSwitch } from './helpers'

const router = (
  route: string,
  callback: (switches?: Switch[]) => void
): boolean => {
  const userArgs: string[] = []
  const switches: Switch[] = []

  for (let i = 2; i < process.argv.length; i++) {
    if (isSwitch(process.argv[i])) {
      switches.push({
        name: process.argv[i].split('=')[0],
        value: process.argv[i].split('=')[1],
      })
    } else {
      userArgs.push(process.argv[i])
    }
  }

  const routeArgs = route.split('/')

  console.log(`user provided args: ${userArgs}`)
  console.log(`args in route: ${routeArgs}`)

  let shouldExecuteCallback = true

  for (const [key, val] of routeArgs.entries()) {
    if (val !== userArgs[key]) {
      shouldExecuteCallback = false
      break
    }
  }

  if (routeArgs.length !== userArgs.length) {
    shouldExecuteCallback = false
  }

  if (shouldExecuteCallback) {
    callback(switches)
    return true
  }

  return false
}

router('commit', (switches) => {
  console.log('callback executed')
  console.log(switches)
})
