import path from 'path'
import { readData } from './read'
import { writeToFile } from './utils/writeToFile'

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

main()
