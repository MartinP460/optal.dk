import { KOTInstitution } from '../types'
import { json } from './json'

export async function generateFiles(data: Required<KOTInstitution>[]) {
  json(data)
}
