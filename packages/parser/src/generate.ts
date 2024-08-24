import path from 'path'
import { getGroupings } from './groupings'
import { getInstitutions } from './institutions'
import { writeToFile } from './utils/writeToFile'

async function parseAndGenerateKOTData() {
  const args = process.argv.slice(2)

  // output folder for all file types
  const relativeOutputDir = args[0]
  // output folder for generated JSON (to be used in the frontend)
  const JSONOutputDir = args[1]

  if (!relativeOutputDir) {
    throw new Error(
      'No output directory argument supplied.\n\n Usage: -- <outputDir> <jsonOutputDir>.'
    )
  } else if (!JSONOutputDir) {
    throw new Error(
      'No JSON output directory argument supplied.\n\n Usage: -- <outputDir> <jsonOutputDir>.'
    )
  }

  const institutions = await getInstitutions()
  const groupings = getGroupings(institutions)

  writeToJSON('institutions', institutions)
  writeToJSON('groupings', groupings)
}

function writeToJSON(name: string, data: unknown) {
  const rootPath = path.join(process.cwd(), '../..')
  const relativeOutputDir = process.argv.slice(2)[0]
  const relativeJSONOutputDir = process.argv.slice(2)[1]

  const outputDir = rootPath + relativeOutputDir
  const JSONOutputDir = rootPath + relativeJSONOutputDir

  writeToFile(name, 'json', JSON.stringify(data), outputDir)
  writeToFile(name, 'json', JSON.stringify(data), JSONOutputDir)
}

parseAndGenerateKOTData()
