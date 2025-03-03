import { Extractor } from './extractor'
import { IOption } from './option'
import { IArgument } from './argument'

export class Cli {
  private _programArgs: string[]
  private _extractor: Extractor

  private _scope: string[]
  private _command: string

  private _allowedArguments: string[]
  private _arguments: IArgument[]

  private _options: Map<string, IOption>
  private _allowedOptions: Set<string>

  constructor(programArgs: string[]) {
    this._programArgs = programArgs
    this._extractor = new Extractor(programArgs)

    this._scope = []
    this._command = ''

    this._allowedArguments = []
    this._arguments = []

    this._options = new Map()
    this._allowedOptions = new Set()
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
    const extractedOptions = this._extractor.extractOptions(
      this._scope.length,
      this._arguments.length
    )

    for (const [, option] of extractedOptions) {
      if (!this._allowedOptions.has(option.name)) {
        throw new Error(`unknown option: ${option.name}`)
      }

      this._options.set(option.name, option)
    }
  }

  scope(scope: string[]) {
    const extractedScope = this._extractor.extractScope(scope.length)
    let doScopesMatch = true

    for (let i = 0; i < extractedScope.length; i++) {
      if (extractedScope[i] !== scope[i]) {
        doScopesMatch = false
        break
      }
    }

    if (doScopesMatch) {
      this._scope = extractedScope
    }

    return this
  }

  command(commandName: string) {
    const extractedCommand = this._extractor.extractCommand(this._scope.length)

    if (commandName === extractedCommand) {
      this._command = extractedCommand
    }

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
    this.validateAndFillArguments()
    this.validateAndFillOptions()

    let shouldExecute = true

    const path = [...this._scope, this._command]
    const extractedPath = [
      ...this._extractor.extractScope(this._scope.length),
      this._extractor.extractCommand(this._scope.length),
    ]

    if (path.length !== extractedPath.length) {
      shouldExecute = false
    }

    for (let i = 0; i < path.length; i++) {
      if (path[i] !== extractedPath[i]) {
        shouldExecute = false
        break
      }
    }

    if (shouldExecute) {
      action(this._arguments, this._options)
    }
  }
}
