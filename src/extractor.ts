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

  extractCommand(scopeLength: number): string | undefined {
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

    return rawArguments
  }

  extractOptions(
    commandIndex: number,
    argumentCount: number
  ): string[] {
    const extractedOptions: string[] = this._programArgs.slice(
      commandIndex + argumentCount + 1
    )

    return extractedOptions
  }
}
