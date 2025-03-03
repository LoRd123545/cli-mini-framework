import { IArgument } from './types'

export class Argument {
  private _name: string
  private _value: string
  private _argvFromCommandOnwards: string[]

  private static _arguments: IArgument[] = []

  static get arguments() {
    return Argument._arguments
  }

  get value(): string {
    return this.value
  }

  constructor(name: string, argvFromCommandOnwards: string[]) {
    this._name = name
    this._value = argvFromCommandOnwards[0]
    this._argvFromCommandOnwards = argvFromCommandOnwards

    this.arg(name)
  }

  arg(name: string) {
    Argument._arguments.push({
      name,
      value: this._argvFromCommandOnwards[Argument._arguments.length],
    })

    return this
  }
}
