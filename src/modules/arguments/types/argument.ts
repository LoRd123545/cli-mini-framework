type OptionalArgument = {
  required: false
  defaultValue: string
  value?: string
}

type RequiredArgument = {
  required: true
  value: string
}

export type Argument = {
  name: string
} & (RequiredArgument | OptionalArgument)
