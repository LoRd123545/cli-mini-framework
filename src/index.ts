import { shallowCompareTwoArrays } from './common/utils'
import { ArgumentException } from './common/exceptions'

import type { IArgumentCreateDto, IArgument } from './modules/arguments'
import { IOption, IOptionCreateDto } from './modules/options/types'
import { ISwitch, ISwitchCreateDto } from './modules/switches'

class Cli {
  /**
   * note that variables starting with _ (floor) are only for internal use
   */

  /**
   * command line arguments that are injected to this class
   */
  private readonly _userArgs: string[]

  /**
   * array of nouns to indicate command scope (just for organization)
   */
  private _scope: string[]

  /**
   * actual command (verb) that dictates what will happen after running it
   */
  private _command: string

  /**
   * argument(s) for command (some commands need value(s), just like normal functions)
   */
  private _arguments: IArgument[]

  /**
   * array of key-val pairs (options) that will modify command behavior
   */
  private _options: IOption[]

  private _switches: ISwitch[]

  /**
   * _scope and _command joined, to save time and space
   */
  private _path: string[]

  /**
   * flag that dictates whether callback should be executed
   */
  private _shouldExecuteCallback: boolean

  private _delimiter: string

  constructor(userArgs: string[]) {
    this._delimiter = '='

    this._userArgs = [...userArgs]

    this._scope = []
    this._command = ''
    this._arguments = []
    this._options = []
    this._switches = []

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
  args(args: IArgumentCreateDto[]) {
    const userPath = this._userArgs.slice(0, this._path.length)
    const rawArgs = this._userArgs.slice(this._path.length)

    if (shallowCompareTwoArrays(this._path, userPath)) {
      this._shouldExecuteCallback = true
    } else {
      return this
    }

    if (rawArgs.length > args.length) {
      if (!rawArgs[args.length].startsWith('--')) {
        throw new ArgumentException(
          `Expected ${args.length} argument(s), got ${rawArgs.length}`
        )
      }
    }

    for (let i = 0; i < args.length; i++) {
      this._arguments.push({
        name: args[i].name,
        value: rawArgs[i],
      })
    }

    return this
  }

  options(options: IOptionCreateDto[]) {
    const rawOptions = this._userArgs.slice(
      this._path.length + this._arguments.length
    )

    for (const rawOption of rawOptions) {
      if (!rawOption.startsWith('--')) {
        throw new Error('options must start with --')
      }

      const [optionName, optionValue] = rawOption
        .substring(2)
        .split(this._delimiter)

      const option = options.find((option) => {
        if (option.name === optionName) {
          return true
        }
      })

      if (!option) {
        throw new Error(`unknown option: --${optionName}`)
      }

      this._options.push({
        name: optionName,
        value: optionValue,
      })
    }

    return this
  }

  switches(switches: ISwitchCreateDto[]) {
    const rawSwitches = this._userArgs.slice(
      this._path.length + this._arguments.length + this._options.length
    )

    for (const rawSwitch of rawSwitches) {
      if (!rawSwitch.startsWith('--')) {
        throw new Error('switches must start with --')
      }

      const switchName = rawSwitch.substring(2)

      const _switch = switches.find((_switch) => {
        if (_switch.name === switchName) {
          return true
        }
      })

      if (!_switch) {
        throw new Error(`unknown switch: --${_switch}`)
      }

      this._switches.push({
        name: switchName,
      })
    }

    return this
  }

  end(
    callback: (
      args: IArgument[],
      options: IOption[],
      switches: ISwitch[]
    ) => void
  ) {
    if (this._shouldExecuteCallback) {
      callback(this._arguments, this._options, this._switches)
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

export { Cli }
