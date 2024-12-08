import { compareTwoArrays } from './utils'

import type { ArgumentCreationOptions, Argument } from './types'

class CliApp {
  private readonly _userArgs: string[]
  private _scope: string[]
  private _shouldExecuteCallback: boolean
  private _arguments: Argument[]

  constructor(userArgs: string[]) {
    this._userArgs = [...userArgs]

    this._scope = []
    this._arguments = []
    this._shouldExecuteCallback = false
  }

  scope(scope: string[]) {
    this._scope = [...scope]

    return this
  }

  command(command: string) {
    this._scope.push(command)

    console.log(this._userArgs)
    console.log(this._scope)

    if (compareTwoArrays(this._scope, this._userArgs)) {
      this._shouldExecuteCallback = true
    }

    return this
  }

  // Not working correctly
  args(args: ArgumentCreationOptions[]) {
    const userArgs = this._userArgs.slice(this._scope.length)

    if (args.length !== userArgs.length) {
      throw new Error(
        `Expected ${args.length} argument(s), got ${userArgs.length}`
      )
    }

    for (let i = 0; i < userArgs.length; i++) {
      this._arguments.push({
        name: args[i].name,
        value: userArgs[i],
        required: args[i].required,
      })
    }

    return this
  }

  end(callback: (args: Argument[]) => void) {
    if (this._shouldExecuteCallback) {
      callback(this._arguments)
    }

    this._shouldExecuteCallback = false
    this._scope = []
  }
}

export { CliApp }
