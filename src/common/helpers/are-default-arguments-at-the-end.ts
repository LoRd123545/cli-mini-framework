import { ArgumentCreateDto } from '@src/types'

/**
 *
 * @param args arguments
 * @returns false if all default arguments are not at the end, else number of default arguments
 */
export function areDefaultArgumentsAtTheEnd(args: ArgumentCreateDto[]) {
  let metDefaultArg = false
  let defaultArgCount = 0

  for (const arg of args) {
    const { required } = arg

    if (metDefaultArg === true) {
      if (required === true) {
        return false
      }
    }

    if (required === false) {
      metDefaultArg = true
      defaultArgCount++
    }
  }

  return defaultArgCount
}
