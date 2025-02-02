export class ArgumentException extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause: cause })
  }
}
