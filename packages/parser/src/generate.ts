import { getKOTData } from './core'
import { generateFiles } from './strategies'

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

  const data = await getKOTData()

  await generateFiles(data)
}

parseAndGenerateKOTData()
