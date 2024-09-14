/** Converts a thousand-seperated integer to a number. */
export function convertToNumber(str: string) {
  if (str === '') return 0

  if (!str) {
    throw new Error(`${str} cannot be parsed to a float.`)
  }

  return parseFloat(str.replace('.', ''))
}
