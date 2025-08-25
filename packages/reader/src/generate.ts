import path from 'path'
import fs from 'fs'
import { readData } from './read'

async function main() {
  const args = process.argv.slice(2)
  const rootPath = path.join(process.cwd(), '../..')

  const outputDirs = args

  if (outputDirs.length === 0) {
    throw new Error(
      'No output directory arguments supplied.\n\n Usage: -- <outputDir1> <outputDir2> ...'
    )
  }

  const output = await readData()

  args.forEach((outputDir) => {
    Object.entries(output).forEach(([key, value]) =>
      writeToFile(key, 'json', JSON.stringify(value), rootPath + outputDir)
    )
  })
}

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

main()
