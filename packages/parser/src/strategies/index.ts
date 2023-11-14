import { KOTInstitution } from '../types'
import { json } from './json/json'
import { xlsx } from './xlsx/xlsx'

export async function generateFiles(data: Required<KOTInstitution>[]) {
  json(data)
  xlsx(data)
}
