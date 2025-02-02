export class CommandClass {
  private _command: string
  private _aliases: string[]

  get command() {
    return this._command
  }

  get aliases() {
    return this._aliases
  }

  constructor(command: string, aliases: string[] = []) {
    this._command = command
    this._aliases = aliases
  }
}

export * from './types'
