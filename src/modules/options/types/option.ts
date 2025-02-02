type Switch = {
  name: string
  hasValue: false
}

type ValueOption = {
  name: string
  hasValue: true
  value: string
}

export type Option = Switch | ValueOption
