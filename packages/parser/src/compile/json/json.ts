import path from 'path'
import { KOTInstitution } from '../../types'
import { writeToFile } from '../../utils/writeToFile'

export function json(institutions: KOTInstitution[]) {
  const rootPath = path.join(process.cwd(), '../..')
  const relativeJSONOutputDir = process.argv.slice(2)[1]

  const JSONOutputDir = rootPath + relativeJSONOutputDir

  writeToFile('json', JSON.stringify(institutions, null, 2))
  writeToFile('json', JSON.stringify(institutions, null, 2), JSONOutputDir)
}
