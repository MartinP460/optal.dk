import fs from 'fs'

export function writeToFile(prefix: 'json', data: string) {
  fs.writeFile(`./generated/data.${prefix}`, data, (err) => {
    if (err) {
      throw err
    }
  })
}
