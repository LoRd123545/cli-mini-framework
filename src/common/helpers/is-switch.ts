const isSwitch = (str: string) => {
  return str.match(
    /^(-|--)[a-zA-Z0-9_-]+(?:=("([^"\\]|\\.)*"|'([^'\\]|\\.)*'))?$/
  )
}

export { isSwitch }
