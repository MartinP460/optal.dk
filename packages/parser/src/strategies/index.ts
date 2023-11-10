import fs from 'fs'
import { KOTInstitution } from '../types'

export async function generateFiles(data: KOTInstitution[]) {
  fs.writeFile('./generated/data.json', JSON.stringify(data, null, 2), (err) => {
    if (err) {
      throw err
    }
  })
}
