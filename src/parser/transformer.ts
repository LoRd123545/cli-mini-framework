import { IOption } from '@src/option'

export class Transformer {
  transformOption(rawOption: string) {
    const [optionName, optionValue] = rawOption.substring(2).split('=')

    const option: IOption = {
      name: optionName,
      value: optionValue,
    }

    return option
  }

  transformOptions(rawOptions: string[]): Map<string, IOption> {
    const options: Map<string, IOption> = new Map()

    for (const rawOption of rawOptions) {
      const option = this.transformOption(rawOption)

      options.set(option.name, option)
    }

    return options
  }
}
