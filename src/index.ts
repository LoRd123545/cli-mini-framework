import { shallowCompareTwoArrays } from './utils'

import type { ArgumentCreationOptions, Argument } from './types'

class CliApp {
  /**
   * note that variables starting with _ (floor) are only for internal use
   */

  // command line arguments that are injected to this class
  private readonly _userArgs: string[]

  // array of nouns to indicate command scope (just for organization)
  private _scope: string[]

  // actual command (verb) that dictates what will happen after running it
  private _command: string

  // argument(s) for command (some commands need value(s), just like normal functions)
  private _arguments: Argument[]

  // array of key-val pairs that will modify command behavior
  private _options: string[]

  // _scope and _command joined, to save time and space
  private _path: string[]

  // flag that dictates whether callback should be executed
  private _shouldExecuteCallback: boolean

  constructor(userArgs: string[]) {
    this._userArgs = [...userArgs]

    this._scope = []
    this._command = ''
    this._arguments = []
    this._options = []

    this._path = []

    this._shouldExecuteCallback = false
  }

  /**
   * This function sets expected scope
   *
   * @param scope - expected scope
   */
  scope(scope: string[]) {
    this._scope = [...scope]
    this._path = [...scope]

    return this
  }

  /**
   * This function sets expected command
   *
   * @param command expected command
   */
  command(command: string) {
    this._command = command
    this._path.push(command)

    return this
  }

  /**
   * This function sets expected arguments
   * Note: this function does not support optional arguments yet
   *
   * @param args - expected arguments
   * @throws {Error} if length of args and arguments provided by user are not matching
   */
  args(args: ArgumentCreationOptions[]) {
    const userPath = this._userArgs.slice(0, this._path.length)

    if (shallowCompareTwoArrays(this._path, userPath)) {
      this._shouldExecuteCallback = true
    } else {
      return this
    }

    const userArgs = this._userArgs.slice(this._path.length)

    console.log(userArgs)
    console.log(args)

    if (args.length !== userArgs.length) {
      throw new Error(
        `Expected ${args.length} argument(s), got ${userArgs.length}`
      )
    }

    for (let i = 0; i < args.length; i++) {
      this._arguments.push({
        name: args[i].name,
        value: userArgs[i],
        required: args[i].required,
      })
    }

    console.log(this._arguments)

    return this
  }

  end(callback: (args: Argument[]) => void) {
    if (this._shouldExecuteCallback) {
      callback(this._arguments)
    }

    // cleaning up space
    this._shouldExecuteCallback = false

    this._scope = []
    this._command = ''
    this._arguments = []
    this._options = []

    this._path = []
  }
}

export { CliApp }
