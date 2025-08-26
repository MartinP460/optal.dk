import path from 'path'
import fs from 'fs'
import { readData } from './read'
import { writeToXLSX } from './convert'

async function main() {
  const args = process.argv.slice(2)
  const rootPath = path.join(process.cwd(), '../..')

  const outputDirs = args

  if (outputDirs.length === 0) {
    throw new Error(
      'No output directory arguments supplied.\n\n Usage: -- <outputDir1> <outputDir2> ...'
    )
  }

  const data = await readData()

  args.forEach((outputDir) => {
    generateJSON(data, rootPath + outputDir)
    generateXLSX(data, rootPath + outputDir)
  })
}

function generateJSON(data: Awaited<ReturnType<typeof readData>>, path: string) {
  Object.entries(data).forEach(([filename, value]) =>
    writeToFile(filename, 'json', JSON.stringify(value), path)
  )
}

function generateXLSX(data: Awaited<ReturnType<typeof readData>>, path: string) {
  writeToXLSX(data, path)
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
