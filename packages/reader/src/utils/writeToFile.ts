import fs from 'fs'

/**
 * Writes a string to a file in the output directory.
 * @param name The name of the file.
 * @param prefix The filetype.
 * @param data The data to be written to the file.
 * @param outputDir The output directory relative to root.
 */
export function writeToFile(name: string, prefix: 'json', data: string, outputDir: string) {
  fs.writeFile(`${outputDir}/${name}.${prefix}`, data, (err) => {
    if (err) {
      throw err
    }
  })
}
