import { shallowCompareTwoArrays } from './common/utils'
import { ArgumentException } from './common/exceptions'
import { areDefaultArgumentsAtTheEnd } from './common/helpers'

import type {
  ArgumentCreateDto,
  ArgumentClass,
  Argument,
} from './modules/arguments'

import { OptionClass } from './modules/options'

import { CommandClass, Command } from './modules/commands'
import { Option, OptionCreateDto } from './modules/options/types'

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
  private _arguments: Argument[]

  /**
   * array of key-val pairs (options) that will modify command behavior
   */
  private _options: Option[]

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
  args(args: ArgumentCreateDto[]) {
    const defaultArgCount = areDefaultArgumentsAtTheEnd(args)

    if (defaultArgCount === false) {
      throw new ArgumentException(
        'Default positional arguments, must be at the end'
      )
    }

    const userPath = this._userArgs.slice(0, this._path.length)

    if (shallowCompareTwoArrays(this._path, userPath)) {
      this._shouldExecuteCallback = true
    } else {
      return this
    }

    const userArgs = this._userArgs.slice(this._path.length)

    // only passes if argument count is in range <args.length - defaultArgCount, args.length>
    if (
      userArgs.length > args.length ||
      userArgs.length < args.length - defaultArgCount
    ) {
      if (!userArgs[args.length].startsWith('--')) {
        throw new ArgumentException(
          `Expected ${args.length} argument(s), got ${userArgs.length}`
        )
      }
    }

    for (let i = 0; i < args.length; i++) {
      if (args[i].required) {
        this._arguments.push({
          name: args[i].name,
          value: userArgs[i],
          required: true,
        })
      } else {
        this._arguments.push({
          name: args[i].name,
          required: false,
          defaultValue: args[i].defaultValue || '',
          value: userArgs[i],
        })
      }
    }

    return this
  }

  options(options: OptionCreateDto[]) {
    const rawUserOptions = this._userArgs.slice(
      this._path.length + this._arguments.length
    )

    for (const rawUserOption of rawUserOptions) {
      if (!rawUserOption.startsWith('--')) {
        throw new Error('options must start with --')
      }

      const rawOption = rawUserOption.substring(2)
      const [optionName, optionValue] = rawOption.split(this._delimiter)

      const option = options.find((option) => {
        if (option.name === optionName) {
          return true
        }
      })

      if (!option) {
        throw new Error(`unknown option: --${optionName}`)
      }

      if (option.hasValue && !optionValue) {
        throw new Error(`option --${optionName} must have a value`)
      }

      const optionHasValue = optionValue === undefined ? false : true

      this._options.push({
        name: optionName,
        hasValue: optionHasValue,
        value: optionValue,
      })
    }

    return this
  }

  end(callback: (args: Argument[], options: Option[]) => void) {
    if (this._shouldExecuteCallback) {
      callback(this._arguments, this._options)
    }

    // cleaning up space
    this._shouldExecuteCallback = false

    this._scope = []
    this._command = ''
    this._arguments = []
    this._options = []

    this._path = []
  }

  builder() {
    return new CliBuilder(this._userArgs)
  }
}

class CliBuilder {
  private _scope: string[]
  private _argv: string[]

  constructor(argv: string[]) {
    this._scope = []

    this._argv = argv
  }

  scope(scope: string[]) {
    this._scope.push(...scope)

    return this
  }
  command(command: CommandClass | Command) {
    if (!(command instanceof CommandClass)) {
      const _command = new CommandClass(command.name, command.aliases)
      return new CommandBuilder(this._scope, _command, this._argv)
    }

    return new CommandBuilder(this._scope, command, this._argv)
  }
}

class CommandBuilder {
  private _command: CommandClass
  private _scope: string[]
  private _shouldExecuteCallback: boolean
  private _argv: string[]

  constructor(scope: string[], command: CommandClass, argv: string[]) {
    this._scope = []
    this._scope.push(...scope)

    this._command = command

    this._shouldExecuteCallback = false

    this._argv = argv
  }
  arg(arg: ArgumentClass) {
    return new ArgumentBuilder(arg, this._argv)
  }
  option(option: OptionClass) {
    return new OptionBuilder(option, [], this._argv)
  }
  end(callback: () => void) {
    const path = [...this._scope, this._command.command]
    const userPath = this._argv.slice(0, path.length)

    if (shallowCompareTwoArrays(path, userPath)) callback()
  }
}

class ArgumentBuilder {
  private _args: ArgumentClass[]
  private _argv: string[]

  constructor(arg: ArgumentClass, argv: string[]) {
    this._args = []
    this._args.push(arg)

    this._argv = argv
  }
  arg(arg: ArgumentClass) {
    this._args.push(arg)

    const defaultArgCount = areDefaultArgumentsAtTheEnd(this._args)

    if (defaultArgCount === false) {
      throw new ArgumentException(
        'Default positional arguments, must be at the end'
      )
    }

    return this
  }
  option(option: OptionClass) {
    return new OptionBuilder(option, this._args, this._argv)
  }
  end(callback: (args: ArgumentClass[]) => void) {
    callback(this._args)
  }
}

class OptionBuilder {
  private _options: OptionClass[]
  private _args: ArgumentClass[]
  private _argv: string[]

  constructor(option: OptionClass, args: ArgumentClass[], argv: string[]) {
    this._options = []
    this._options.push(option)

    this._args = []
    this._args.push(...args)

    this._argv = argv
  }

  option(option: OptionClass) {
    this._options.push(option)

    return this
  }
  end(callback: (args: ArgumentClass[], options: OptionClass[]) => void) {
    callback(this._args, this._options)
  }
}

export { Cli }
