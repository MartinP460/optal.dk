import { json } from './json/json'
// import { xlsx } from './xlsx/xlsx'
import { KOTInstitution } from '../types'

export async function generateFiles(data: KOTInstitution[]) {
  json(data)
  // xlsx(data)
}
