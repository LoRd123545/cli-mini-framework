export class ArgumentClass {
  private _name: string
  private _required: boolean
  private _value: string

  get value(): string {
    return this.value
  }

  constructor(name: string, required: boolean = true) {
    this._name = name
    this._required = required
    this._value = ''
  }
}

export * from './types'
