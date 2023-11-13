import fs from 'fs'
import path from 'path'

/**
 * Writes a string to a file in the output directory.
 * @param prefix The file-prefix.
 * @param data The data to be written to the file.
 * @param outputDir The output directory relative to root. Defaults to first supplied command-line argument.
 */
export function writeToFile(prefix: 'json', data: string, outputDir?: string) {
  const rootPath = path.join(process.cwd(), '../..')
  const relativeOutputDir = process.argv.slice(2)[0]

  const defaultOutputDir = rootPath + relativeOutputDir

  fs.writeFile(`${outputDir ?? defaultOutputDir}/data.${prefix}`, data, (err) => {
    if (err) {
      throw err
    }
  })
}
