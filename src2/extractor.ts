import { IOption } from './option'

export class Extractor {
  /**
   * Cmd command model
   *
   * -------------------------
   *
   * program_name   scope   command   args  options
   * req            opt     req       opt   opt
   */

  private _programArgs: string[]

  constructor(programArgs: string[]) {
    console.log('[internal] program args: ', programArgs)

    this._programArgs = programArgs
  }

  extractScope(scopeLength: number): string[] {
    if (scopeLength <= 0) {
      return []
    }

    const foundScope = this._programArgs.slice(0, scopeLength)

    if (foundScope.length !== scopeLength) {
      return []
    }

    return foundScope
  }

  extractCommand(scopeLength: number): string {
    return this._programArgs[scopeLength]
  }

  extractArguments(commandIndex: number, argumentCount: number): string[] {
    if (commandIndex === -1) {
      return []
    }

    const rawArguments = this._programArgs.slice(
      commandIndex + 1,
      commandIndex + argumentCount + 1
    )

    if (rawArguments.length < argumentCount) {
      return []
    }

    return rawArguments
  }

  extractOptions(
    commandIndex: number,
    argumentCount: number
  ): Map<string, IOption> {
    const rawOptions: string[] = []

    for (let i = 0; i < this._programArgs.length; i++) {
      const lastArgumentIndex = commandIndex + argumentCount

      if (this._programArgs[i].startsWith('--')) {
        if (i > lastArgumentIndex) {
          rawOptions.push(this._programArgs[i])
        }
      }
    }

    const extractedOptions = new Map<string, IOption>()

    for (const rawOption of rawOptions) {
      const [optName, optVal] = rawOption.slice(2).split('=')

      extractedOptions.set(optName, {
        name: optName,
        value: optVal,
      })
    }

    return extractedOptions
  }
}
