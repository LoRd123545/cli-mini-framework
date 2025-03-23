import { Extractor, Transformer, Validator } from './parser'

import { IOption, IOptionMetadata } from './option'
import { IArgument, IArgumentMetadata } from './argument'

import { compareTwoStringArrays } from './utils'
import { cliError } from './errors'

export class Cli {
  private _programName: string

  private _programArgs: string[]

  private _extractor: Extractor
  private _validator: Validator
  private _transformer: Transformer

  private _commands: Set<string>
  private _scope: string[]
  private _command: string
  private _userPath: string[]
  private _path: string[]

  private _allowedArguments: IArgumentMetadata[]
  private _arguments: IArgument[]
  private _optionalArgCount: number

  private _options: Map<string, IOption>
  private _allowedOptions: Map<string, IOptionMetadata>

  constructor(programName: string, programArgs: string[]) {
    this._programName = programName

    this._programArgs = programArgs

    this._extractor = new Extractor(programArgs)
    this._validator = new Validator()
    this._transformer = new Transformer()

    this._commands = new Set()
    this._scope = []
    this._command = ''
    this._userPath = []
    this._path = []

    this._arguments = []
    this._allowedArguments = []
    this._optionalArgCount = 0

    this._options = new Map()
    this._allowedOptions = new Map()
  }

  private validateAndFillArguments() {
    const extractedArguments = this._extractor.extractArguments(
      this._scope.length,
      this._allowedArguments.length
    )

    console.log('extracted args: ', extractedArguments)

    if (
      extractedArguments.length <
        this._allowedArguments.length - this._optionalArgCount ||
      extractedArguments.length > this._allowedArguments.length
    ) {
      if (this._optionalArgCount > 0) {
        cliError(
          new Error(
            `expected ${
              this._allowedArguments.length - this._optionalArgCount
            } - ${this._allowedArguments.length} arguments, but got ${
              extractedArguments.length
            }`
          )
        )
      } else {
        cliError(
          new Error(
            `expected ${this._allowedArguments.length} arguments, but got ${extractedArguments.length}`
          )
        )
      }
    }

    for (let i = 0; i < extractedArguments.length; i++) {
      this._arguments.push({
        name: this._allowedArguments[i].name,
        value: extractedArguments[i],
      })
    }
  }

  private validateAndFillOptions() {
    const extractedOptions = this._extractor.extractOptions(
      this._scope.length,
      this._arguments.length
    )

    if (!this._validator.validateOptions(extractedOptions)) {
      cliError(
        new Error(
          'Every option must start with -- and be at least 1 character long'
        )
      )
    }

    const options = this._transformer.transformOptions(extractedOptions)

    for (const [optName] of options) {
      if (!this._allowedOptions.has(optName)) {
        cliError(new Error(`unknown option: ${optName}`))
      }
    }

    this._options = options
  }

  private help() {
    let usageString = `usage: ${this._programName} ${this._command} `

    for (const arg of this._allowedArguments) {
      usageString += `<${arg.name}> `
    }

    for (const [optionName] of this._allowedOptions) {
      usageString += `[--${optionName}] `
    }

    console.log(usageString)

    console.log(`\n${this._command} - some description`)

    console.log('\nargs:')

    for (const arg of this._allowedArguments) {
      console.log(`${arg.name} - ${arg.description || arg.name}`)
    }

    console.log('\noptions:')

    for (const [optionName, option] of this._allowedOptions) {
      console.log(`${optionName} - ${option.description || optionName}`)
    }
  }

  private validate() {
    this.validateAndFillArguments()
    this.validateAndFillOptions()
  }

  private cleanup() {
    this._extractor = new Extractor(this._programArgs)
    this._validator = new Validator()
    this._transformer = new Transformer()

    this._scope = []
    this._command = ''
    this._userPath = []

    this._allowedArguments = []
    this._arguments = []
    this._optionalArgCount = 0

    this._options = new Map()
    this._allowedOptions = new Map()
  }

  scope(scope: string[]) {
    this._path = [...scope]

    const extractedScope = this._extractor.extractScope(scope.length)

    if (compareTwoStringArrays(extractedScope, scope)) {
      this._scope = extractedScope
    }

    this._userPath = [...extractedScope]

    return this
  }

  command(commandName: string) {
    this._commands.add(commandName)
    this._allowedOptions.set('help', { name: 'help' })
    this._path.push(commandName)

    const extractedCommand = this._extractor.extractCommand(this._scope.length)

    if (!extractedCommand) {
      cliError(new Error('Please provide command'))
    }

    // if (!this._commands.has(extractedCommand as string)) {
    //   cliError(new Error(`unknown command: ${extractedCommand}`))
    // }

    if (commandName === extractedCommand) {
      this._command = extractedCommand
    }

    this._userPath.push(extractedCommand as string)

    return this
  }

  arg(arg: string | IArgumentMetadata) {
    if (typeof arg === 'string') {
      this._allowedArguments.push({
        name: arg,
      })
    } else {
      this._allowedArguments.push(arg)
    }

    return this
  }

  optionalArg(arg: string | IArgumentMetadata) {
    this._optionalArgCount++

    if (typeof arg === 'string') {
      this._allowedArguments.push({
        name: arg,
      })
    } else {
      this._allowedArguments.push(arg)
    }

    return this
  }

  option(option: string | IOptionMetadata) {
    if (typeof option === 'string') {
      this._allowedOptions.set(option, { name: option })
    } else {
      this._allowedOptions.set(option.name, option)
    }

    return this
  }

  callback(action: (args: IArgument[], opts: Map<string, IOption>) => void) {
    let shouldExecute = true

    if (!compareTwoStringArrays(this._path, this._userPath)) {
      shouldExecute = false
    }

    if (shouldExecute === false) {
      this.cleanup()
      return
    }

    this.validate()

    if (this._options.has('help')) {
      this.help()
    } else {
      action(this._arguments, this._options)
    }

    process.exit()
  }
}
