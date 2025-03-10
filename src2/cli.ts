import { Extractor } from './extractor'
import { Validator } from './validator'
import { Transformer } from './transformer'

import { IOption } from './option'
import { IArgument } from './argument'

import { compareTwoStringArrays } from './utils'

export class Cli {
  private _programArgs: string[]

  private _extractor: Extractor
  private _validator: Validator
  private _transformer: Transformer

  private _scope: string[]
  private _command: string
  private _userPath: string[]
  private _path: string[]

  private _allowedArguments: string[]
  private _arguments: IArgument[]

  private _options: Map<string, IOption>
  private _allowedOptions: Set<string>

  constructor(programArgs: string[]) {
    console.log('[internal] program args: ', programArgs)

    this._programArgs = programArgs

    this._extractor = new Extractor(programArgs)
    this._validator = new Validator()
    this._transformer = new Transformer()

    this._scope = []
    this._command = ''
    this._userPath = []
    this._path = []

    this._allowedArguments = []
    this._arguments = []

    this._options = new Map()
    this._allowedOptions = new Set()

    this._allowedOptions.add('help')
  }

  private validateAndFillArguments() {
    const extractedArguments = this._extractor.extractArguments(
      this._scope.length,
      this._allowedArguments.length
    )

    if (
      extractedArguments.length > this._allowedArguments.length ||
      extractedArguments.length < this._allowedArguments.length
    ) {
      throw new Error(
        `expected ${this._allowedArguments.length} arguments, but got ${extractedArguments.length}`
      )
    }

    for (let i = 0; i < extractedArguments.length; i++) {
      this._arguments.push({
        name: this._allowedArguments[i],
        value: extractedArguments[i],
      })
    }
  }

  private validateAndFillOptions() {
    const extractedOptions = this._extractor.extractOptions(this._scope.length, this._arguments.length);

    if(!this._validator.validateOptions(extractedOptions)) {
      throw new Error('Every option must start with -- and be at least 1 character long')
    }

    const options = this._transformer.transformOptions(extractedOptions);

    for(const [optName, option] of options) {
      if(!this._allowedOptions.has(optName)) {
        throw new Error(`unknown option: ${optName}`)
      }
    }

    this._options = options
  }

  private help() {
    console.log('usage: ');

    console.log()

    if(this._allowedArguments.length > 0) {
      console.log('arguments: ')

      for(const allowedArgument of this._allowedArguments) {
        console.log(`<${allowedArgument}>`)
      }
    }

    if(this._allowedOptions.size > 0) {
      console.log('options: ')

      for(const [optionName] of this._allowedOptions) {
        console.log(`<${optionName}>`)
      }
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

    this._options = new Map()
    this._allowedOptions = new Set()
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
    this._path.push(commandName)

    const extractedCommand = this._extractor.extractCommand(this._scope.length)

    if(!extractedCommand) {
      throw new Error('Please provide command')
    }

    if (commandName === extractedCommand) {
      this._command = extractedCommand
    }

    this._userPath.push(extractedCommand)

    return this
  }

  arg(argName: string) {
    this._allowedArguments.push(argName)

    return this
  }

  option(optionName: string) {
    this._allowedOptions.add(optionName)

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

    if(this._options.has('help')) {
      this.help()
    }

    action(this._arguments, this._options)

    process.exit()
  }
}
