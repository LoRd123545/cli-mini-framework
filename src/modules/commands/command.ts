import { Argument } from '../arguments'

export class Command {
  private _scope: string[]
  private _name: string
  private _aliases: string[]

  private _argv: string[]

  get name() {
    return this._name
  }

  get path() {
    return [...this._scope, this._name]
  }

  get aliases() {
    return this._aliases
  }

  constructor(name: string, aliases?: string[], argv?: string[]) {
    this._scope = []
    this._name = name

    if (!aliases) {
      this._aliases = []
    } else {
      this._aliases = aliases
    }

    if (!argv) {
      this._argv = process.argv.slice(2)
    } else {
      this._argv = argv
    }
  }

  scope(scope: string[]) {
    this._scope.push(...scope)

    return this
  }

  arg(name: string) {
    const argvFromCommandOnwards = this._argv.slice(this._scope.length + 1)

    return new Argument(name, argvFromCommandOnwards)
  }
}
