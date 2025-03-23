function cliError(error: Error) {
  console.error('error: ', error.message)
  process.exit(1)
}

export { cliError }
