import { KOTInstitution } from '../types'
import { writeToFile } from '../utils/writeToFile'

export function json(institutions: Required<KOTInstitution>[]): void {
  writeToFile('json', JSON.stringify(institutions, null, 2))
}
