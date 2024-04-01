/** Converts a thousand-seperated integer to a number. */
export function convertToNumber(str: string) {
  if (str === '') return 0

  return parseFloat(str.replace('.', ''))
}
